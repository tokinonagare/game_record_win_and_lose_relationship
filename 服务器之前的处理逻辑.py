from collections import deque
from copy import deepcopy

from models.db_schema import create_texas_holdem_room_api, \
    create_doudizhu_room_api
from libs.sanic_api.views import APIBaseView, ok_response


class TexasHoledmRoomCreationPermission(APIBaseView):
    """创建德州扑克
    """

    async def get(self, request, club_id):
        """检查请求的用户是否可以创建房间
        :return: 返回创建房间所需要的数据
        """
        return ok_response({'rule': create_texas_holdem_room_api})


class DoudizhuRoomCreationPermission(APIBaseView):
    """创建斗地主
    """

    async def get(self, request, club_id):
        return ok_response({'rule': create_doudizhu_room_api})


class LoseChip(APIBaseView):
    """对局详情
    """

    @classmethod
    def player_classify(cls, players):
        # 对本局玩家按输赢进行分类
        winners = []
        losers = []
        partners = players['partners']
        for index, player in enumerate(partners):
            # 不输为赢
            if player['amount'] >= 0:
                winners.append(player)
            else:
                losers.append(player)
        winners.sort(key=lambda _player: _player['amount'])
        losers.sort(key=lambda _player: _player['amount'], reverse=True)

        return deque(winners), deque(losers), deepcopy(winners + losers)

    def chip_transfer_result(self, body_data):
        """
        :处理方法:
                1. 先将正在处理的输家赢家添加到result对应玩家的partner中。
                2. 求当前处理玩家的输赢数据的和，如果是小于0，则输家还有剩余，
                   修改result中该赢家partner中该输家输掉的筹码值，赢家还有剩余则同理。
        :return: 返回本局输赢之间的关系数据结构
        """
        dwinners, dlosers, result = self.player_classify(body_data)

        def set_partner(user_id, partner):
            for user in result:
                if user['id'] == user_id:
                    user['partner'] = partner

        # 赢家从输家那拿到积分
        winner_partner = []
        loser_partner = []

        # 只要赢家结算妥当了，输家可能还有没给出的，不理会
        while dwinners:
            winner = dwinners.pop()

            if winner['amount'] == 0:
                set_partner(winner['id'], [])
                continue

            loser = dlosers.pop()

            remainder = winner['amount'] + loser['amount']
            # 余负数
            if remainder < 0:
                # 记录输家给出了多少，还欠多少
                loser_partner.append({
                    'id': winner['id'],
                    'name': winner['name'],
                    'amount': -winner['amount']
                })
                loser['amount'] = remainder
                # 输家还要继续给
                dlosers.append(loser)

                # 记录从输家那拿了多少
                winner_partner.append({
                    'id': loser['id'],
                    'name': loser['name'],
                    'amount': winner['amount']
                })
                # 这个赢家给足了，销账
                set_partner(winner['id'], winner_partner)
                winner_partner = []

            else:
                winner_partner.append({
                    'id': loser['id'],
                    'name': loser['name'],
                    'amount': -loser['amount']
                })
                winner['amount'] = remainder

                if remainder == 0:
                    set_partner(winner['id'], winner_partner)
                    winner_partner = []
                else:
                    # 这个赢家还没给足，回去等下一个输家继续给
                    dwinners.append(winner)

                loser_partner.append({
                    'id': winner['id'],
                    'name': winner['name'],
                    'amount': loser['amount']
                })
                set_partner(loser['id'], loser_partner)
                loser_partner = []

        # 如果输家比如还剩一个记分牌没给出，将给出了多少也记录下
        if loser_partner:
            last_loser = dlosers.pop()
            set_partner(last_loser['id'], loser_partner)

        return result

    async def post(self, request):
        result = self.chip_transfer_result(request.json)
        return ok_response({'benefitRelationships': result})
