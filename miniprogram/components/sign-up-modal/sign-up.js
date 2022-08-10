import {
  request,
} from '../../utils/request';
import {
  toast,
} from '../../utils/util';

Component({
  properties: {
    hidden: {
      type: Boolean,
      value: true
    },
    userInfo: null,
    gameType: {
      type: String,
      value: '对内联赛'
    },
    isDelegate: {
      type: Boolean,
      value: false
    },
    gameId: {
      type: String,
      value: ''
    }
  },

  data: {
    team: ''
  },

  methods: {
    async signUp() {
      console.log('data', this.data.userInfo);
      console.log('gameType', this.data.gameType);
      console.log('gameId', this.data.gameId);

      const openId = wx.getStorageSync('openId');

      let data = {
        "openId": openId,
        "nickName": this.data.userInfo.nickName,
        "avatarUrl": this.data.userInfo.avatarUrl,
        "team": this.data.team,
        "status": "confirmed",
        "isDelegate": this.data.isDelegate,
      }
      console.log(data);

      await request('PUT', `/game/${this.data.gameId}/sign-up`, data);
      toast("报名成功！", 'none', 3000, false);
      this.cancel();
      this.triggerEvent('OnSignUpSuccess');
    },

    cancel() {
      this.setData({
        hidden: true,
      });
    },

    selectTeam(e) {
      const team = e.currentTarget.dataset.team;
      this.setData({
        team
      })
    }
  }
})