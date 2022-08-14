import {modal, toast} from '../../utils/util';
import {request} from '../../utils/request';

Component({
  properties: {
    gameId: '',
    gameType: '',
    teamName: '',
    status: '',
    teamParticipants: [],
    isEditable: false,
  },
  data: {
    borderCss: 'no-team-border',
    moveModalHidden: true,
    moveModalTitle: null,
    movePlayer: null,
  },
  methods: {
    async showSignOff(e) {
      const item = e.currentTarget.dataset.item;
      console.log('item', item);

      const openId = wx.getStorageSync('openId');
      if (openId && item?.openId === openId) {
        const names = {
          confirmed: '报名',
          tbd: '待定',
          leave: '请假'
        };
        const res = await modal('xx', `确定要取消${item.isDelegate ? '此代' : ''}${names[this.data.status]}吗？`);
        if (res) {
          await request("PUT", `/game/${this.data.gameId}/sign-off`, {_id: item._id});
          toast("已取消", "none", 3000, false, true);
          this.triggerEvent('OnSignOfSuccess');
        }
      }
    },

    async movePlayer(e) {
      const player = e.currentTarget.dataset.player;
      console.log('player', player);

      if (!player) {
        toast('未找到人员信息');
        return;
      }

      this.setData({
        moveModalHidden: false,
        movePlayer: player,
        moveModalTitle: `将${player.nickName}${player.isDelegate?'(代)':''}移动至`
      });
    },

    async deletePlayer(e) {
      const player = e.currentTarget.dataset.player;
      console.log('player', player);

      if (!player) {
        toast('未找到人员信息');
        return;
      }
 
      const res = await modal('xx', `确定要将${player.nickName}${player.isDelegate?'(代)':''}移除出本场比赛吗？`);
      if (res) {
        await request("PUT", `/game/${this.data.gameId}/sign-off`, {_id: player._id});
        this.triggerEvent('OnAdminSuccess');
      }

      return false;
    },

    oMoveSuccess() {
      this.triggerEvent('OnAdminSuccess');
    },
  },

  attached: function () {
    let border;
    if (this.data.teamName === '白队')
      border = 'white-border';
    if (this.data.teamName === '蓝队')
      border = 'blue-border';
    if (this.data.teamName === '红队')
      border = 'red-border';

      this.setData({
        borderCss: border
      });
  },
})