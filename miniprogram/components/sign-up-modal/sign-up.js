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
    status: {
      type: String,
      value: 'confirmed'
    },
    gameId: {
      type: String,
      value: ''
    },
    customTitle: {
      type: String,
      value: ''
    },
    isMoveTeam: {
      type: Boolean,
      value: false
    },
  },

  data: {
    team: '',
    reason: '',
    reasons: [
      {name: '出差'},
      {name: '伤病'},
      {name: '媳妇儿不让'},
      {name: '带娃'},
      {name: '天气不好'},
      {name: '来例假了'},
      {name: '另有安排'},
    ]
  },

  methods: {
    async signUp() {
      console.log('data', this.data.userInfo);
      console.log('gameType', this.data.gameType);
      console.log('gameId', this.data.gameId);
      console.log('isMoveTeam', this.data.isMoveTeam);

      if (this.data.isMoveTeam) {
        await this.moveTeam();
        return;
      }

      if (this.data.status !== 'confirmed' && !this.data.reason) {
        toast('请说明理由', 'none', 3000, false);
        return;
      }

      const openId = wx.getStorageSync('openId');

      let data = {
        "openId": openId,
        "nickName": this.data.userInfo.nickName,
        "avatarUrl": this.data.userInfo.avatarUrl,
        "team": this.data.gameType === '对内联赛' ? this.data.team : 'noTeam',
        "status": this.data.status,
        "isDelegate": this.data.isDelegate,
        "reason": this.data.reason
      }
      console.log(data);

      const result = await request('PUT', `/game/${this.data.gameId}/sign-up`, data);
      console.log('报名result', result);
      if (this.data.status === 'confirmed') {
        const tip = this.data.isDelegate ? `代报名成功！` : `牛逼, 你已经参加了${result.participationTimes}场比赛了!`;
        toast(tip, 'none', 3000, false, true);
      } else {
        toast(`您已${this.data.status==='tbd'?'进入待定状态':'请假'}`, 'none', 3000, false, true);
      }
      this.cancel();
      this.triggerEvent('OnSignUpSuccess');
    },

    async tbdOrLeave(status, reason) {
      const openId = wx.getStorageSync('openId');

      let data = {
        "openId": openId,
        "nickName": this.data.userInfo.nickName,
        "avatarUrl": this.data.userInfo.avatarUrl,
        "status": status,
        "reason": reason,
      }
      console.log(data);

      const result = await request('PUT', `/game/${this.data.gameId}/sign-up`, data);
      console.log('报名result', result);
      toast("提交成功！", 'none', 3000, false, true);
      this.cancel();
    },

    async moveTeam() {
      const data = {
        moveToTeam: this.data.team,
        participant: this.data.userInfo
      }
      await request('PUT', `/game/${this.data.gameId}/move-team`, data);

      this.cancel();
      this.triggerEvent('OnSignUpSuccess');
    },

    cancel() {
      this.setData({
        team: '',
        hidden: true,
      });
    },

    selectTeam(e) {
      const team = e.currentTarget.dataset.team;
      this.setData({
        team
      })
    },

    reasonInput: function (e) {
      const reason = e.detail.value;
      console.log(reason);

      const reasons = this.data.reasons;
      for (const r of reasons) {
        r.checked = false;
      }

      this.setData({
        reason: reason,
        reasons
      });
    },

    radioChange(e) {
      console.log('radio发生change事件，携带value值为：', e.detail.value)
  
      const reasons = this.data.reasons;
      let reason;
      for (let i = 0, len = reasons.length; i < len; ++i) {
        reasons[i].checked = reasons[i].name === e.detail.value;
        if (reasons[i].checked) {
          reason = reasons[i].name;
        }
      }
  
      this.setData({
        reasons,
        reason
      })
    }
  },
})