// index.js

import {
  modal,
  toast,
  formatDate
} from '../../utils/util';
import {request} from '../../utils/request';

// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false


    year: new Date().getFullYear(),
    leagueMerged: {},
    leagueRounds: [],
    playerRank: [],
    playerSortedBy: 'goal',
    loginHidden: true,
    userInputLoginPwd: '',
    isEditMode: false,
    editRoundHidden: true,
    editingRound: null,
    isShowEditRoundDatePicker: false,
    editPlayerHidden: true,
    isScroll: true,
    inputBottom: 0,
    toastDuration: 3000
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad(options) {
    // if (wx.getUserProfile) {
    //   this.setData({
    //     canIUseGetUserProfile: true
    //   })
    // }

    console.log({options});

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });

    this.getAllData();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
  },

  onShareTimeline: function (res) {
    return {
      title: this.formatMergedInfo(),
      imageUrl: `https://iti-images.s3.amazonaws.com/events/897195ed-1495-bc59-11e2-28704a1e2a92.webp`,
      query: "",
      success: function (res) {},
    };
  },
  onShareAppMessage: function (res) {
    return {
      title: this.formatMergedInfo(),
      imageUrl: `https://iti-images.s3.amazonaws.com/events/897195ed-1495-bc59-11e2-28704a1e2a92.webp`,
      path: "pages/index/index?id=123",
      success: function (res) {},
    };
  },
  async onPullDownRefresh() {
    console.log('onPullDownRefresh');
    wx.showNavigationBarLoading();
    await this.getAllData();
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  formatMergedInfo() {
    if (!this.data.leagueMerged){
      return '土拨鼠2022夏季联赛积分榜';
    }
    return `${this.data.leagueMerged.till}，白队${this.data.leagueMerged.white}分，蓝队${this.data.leagueMerged.blue}分，红队${this.data.leagueMerged.red}分`;
  },

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  async getAllData() {
    const result = await request('GET', '/league/all');
    if (result.hasValue === false) {
      this.setData({
        leagueMerged: null,
        leagueRounds: [],
        playerRank: []
      })
    } else {
      this.setData({
        leagueMerged: result.merged,
        leagueRounds: result.allRounds,
        playerRank: result.playerData,
      })
    }
  },
  async getLeagueMerged() {
    const result = await request('GET', '/league/merged');
    this.setData({
      leagueMerged: result
    })
  },
  async getLeagueRounds() {
    const result = await request('GET', '/league');
    this.setData({
      leagueRounds: result
    })
  },
  async getPlayerRank() {
    const result = await request('GET', '/players/goal-rank');
    this.setData({
      playerRank: result
    })
  },
  sortByAssist() {
    console.log('sortByAssist');
    console.log(this.data.playerRank);
    let sorted = this.data.playerRank.sort((a, b) => {
      return b.assist - a.assist;
    });
    this.setData({
      playerRank: sorted,
      playerSortedBy: 'assist'
    });
  },
  sortByGoal() {
    console.log('sortByGoal');

    let sorted = this.data.playerRank.sort((a, b) => {
      return b.goal - a.goal;
    });
    this.setData({
      playerRank: sorted,
      playerSortedBy: 'goal'
    });
  },

  showLogin() {
    console.log('enter login');
    this.setData({
      loginHidden: false
    });
  },

  cancelLogin() {
    this.setData({
      loginHidden: true,
      editRoundHidden: true,
      editPlayerHidden: true,
    });
  },

  // loginInput: function (e) {
  //   this.setData({
  //     userInputLoginPwd: e.detail.value
  //   })
  // },

  // login() {
  //   if (this.data.userInputLoginPwd === 'nb') {
  //     this.setData({
  //       isEditMode: true,
  //       loginHidden: true
  //     });
  //   } else {
  //     toast('密码错', 'none', this.data.toastDuration, false);
  //   }
  // },

  loginSuccess() {
    this.setData({
      isEditMode: true,
      loginHidden: true
    });
  },

  editRound(e) {
    if (!this.data.isEditMode) return;

    console.log('edit round', e.currentTarget.dataset.round);
    e.currentTarget.dataset.round.isNew = undefined;

    this.setData({
      editingRound: e.currentTarget.dataset.round,
      editRoundHidden: false
    });
  },
  editPlayer(e) {
    if (!this.data.isEditMode) return;

    console.log('edit player', e.currentTarget.dataset.player);

    this.setData({
      editingPlayer: e.currentTarget.dataset.player,
      editPlayerHidden: false
    });
  },
  createRound() {
    const roundNo = this.data.leagueRounds?.length ? this.data.leagueRounds[0].roundNo + 1 : 1;
    const date = this.getRoundDate();
    console.log(date);
    this.setData({
      editingRound: {
        date: date,
        roundNo: roundNo,
        white: null,
        blue: null,
        red: null,
        isNew: true
      },
      editRoundHidden: false
    });
  },
  getRoundDate(dateValue) {
    let date = dateValue ? new Date(dateValue) : new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
  },

  async editRoundConfirm() {
    console.log(this.data.editingRound);

    // if (this.data.editingRound.date && this.data.editingRound.roundNo)
    // Object.keys(this.data.editingRound).forEach((item, key) => {
    //   console.log('item: ' + item, 'value: ' + this.data.editingRound[key]);
    // })

    this.setData({
      ['editingRound.white']: this.data.editingRound.white || 0,
      ['editingRound.blue']: this.data.editingRound.blue || 0,
      ['editingRound.red']: this.data.editingRound.red || 0,
    })

    console.log(this.data.editingRound);

    if (this.data.editingRound.isNew) {
      const result = await request('POST', `/league`, this.data.editingRound);
      console.log(result);

      if (result.error) {
        toast(result.msg, 'none', this.data.toastDuration, false);
        return;
      }
    } else {
      const result = await request('PUT', `/league/${this.data.editingRound._id}`, this.data.editingRound);
      console.log(result);
      if (result.error) {
        toast(result.msg, 'none', this.data.toastDuration, false);
        return;
      }
    }

    this.setData({
      editRoundHidden: true
    });
    this.getAllData();
  },

  showRoundDatePicker() {
    this.setData({
      isShowEditRoundDatePicker: true
    });
  },

  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    const date = formatDate(e.detail.value);
    console.log('date', date);
    this.setData({
      ['editingRound.date']: date
    })
  },

  editRoundInput(e) {
    console.log(e);
    const no = parseInt(e.detail.value, 10);
    const field = e.currentTarget.dataset.item;

    this.setData({
      ['editingRound.' + field]: no
    });

    console.log(this.data.editingRound);
  },

  onfocus(e) {
    this.setData({
      isScroll: false
    })
  },

  onblur() {
    this.setData({
      isScroll: true
    })
  },

  editPlayerNameInput(e) {
    console.log('name', e.detail.value);
    this.setData({
      ['editingPlayer.name']: e.detail.value
    });
  },

  editPlayerInput(e) {
    console.log(e);
    const no = parseInt(e.detail.value, 10);
    const field = e.currentTarget.dataset.item;

    this.setData({
      ['editingPlayer.' + field]: no
    });

    console.log('editingPlayer', this.data.editingPlayer);
  },

  async deleteRound() {
    const res = await modal('xx', '确定要删除此轮数据吗？');
    console.log(res);

    if (res) {
      await request('DELETE', '/league/' + this.data.editingRound._id);
      this.setData({
        editRoundHidden: true
      });
      this.getAllData();
    }
  },

  async deletePlayer() {
    const res = await modal('xx', '确定要删除此人的数据吗？');

    if (res) {
      await request('DELETE', '/players/' + this.data.editingPlayer._id);
      this.setData({
        editPlayerHidden: true
      });
      this.getAllData();
    }
  },

  async editPlayerConfirm() {
    if (!this.data.editingPlayer.name) {
      toast('请输入姓名', 'none', this.data.toastDuration);
      return;
    }

    this.setData({
      ['editingPlayer.goal']: this.data.editingPlayer.goal || 0,
      ['editingPlayer.assist']: this.data.editingPlayer.assist || 0,
    })

    console.log('editingPlayer', this.data.editingPlayer);

    if (this.data.editingPlayer.isNew) {
      const result = await request('POST', `/players`, this.data.editingPlayer);
      console.log(result);
      if (result.error) {
        toast(result.msg, 'none', this.data.toastDuration, false);
        return;
      }
    } else {
      const result = await request('PUT', `/players/${this.data.editingPlayer._id}`, this.data.editingPlayer);
      console.log(result);
      console.log(result);
      if (result.error) {
        toast(result.msg, 'none', this.data.toastDuration, false);
        return;
      }
    }

    this.setData({
      editPlayerHidden: true
    });
    this.getAllData();
  },

  createPlayer() {
    this.setData({
      editingPlayer: {
        name: null,
        goal: null,
        assist: null,
        isNew: true
      },
      editPlayerHidden: false
    });
  },

  noUndefined(obj) {

  },

  foucus: function (e) {
    console.log('e.detail.height', e.detail.height);
    var that = this;

    that.setData({

      inputBottom: 150

    })

  },



  //失去聚焦

  blur: function (e) {

    var that = this;

    that.setData({

      inputBottom: 0

    })

  },

})