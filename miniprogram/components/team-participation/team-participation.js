import {
  modal,
  toast
} from '../../utils/util';
import {
  request
} from '../../utils/request';

Component({
  properties: {
    gameId: '',
    gameType: '',
    team: '',
    status: '',
    teamParticipants: [],
    isEditable: false,
  },
  data: {
    borderCss: 'noTeam-border',
    moveModalHidden: true,
    moveModalTitle: null,
    movePlayer: null,
    teamName: {
      white: '白队',
      blue: '蓝队',
      red: '红队',
      noTeam: '未分组',
    }
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
          await request("PUT", `/game/${this.data.gameId}/sign-off`, {
            _id: item._id
          });
          toast("已取消", "none", 3000, false, true);
          this.triggerEvent('OnSignOfSuccess');
        }
      }
    },

    async movePlayer(e) {
      const player = e.currentTarget.dataset.player;
      console.log('player', player);
      console.log('team', this.data.team);
      const team = this.data.team;

      if (!player) {
        toast('未找到人员信息');
        return;
      }

      // 当取消移动时，需要用这个来回到当前球员初始的status (confirmed, tbd, leave)
      wx.setStorageSync('playerStatus', this.data.status);

      this.setData({
        team,  // 不重设一下蓝队默认选中状态有问题
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
        await request("PUT", `/game/${this.data.gameId}/sign-off`, {
          _id: player._id
        });

        this.triggerEvent('OnAdminSuccess');
      }
    },

    oMoveSuccess() {
      this.triggerEvent('OnAdminSuccess');
    },
  },

  attached: function () {
    if (this.data.team) {
      let border = `${this.data.team}-border`;

      this.setData({
        borderCss: border
      });
    }
  },
})