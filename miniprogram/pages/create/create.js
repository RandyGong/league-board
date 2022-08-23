import {
  formatDate,
  toast,
  getThursdayOfCurrentWeek,
  getMondayOfNextWeek,
  getWeekday,
  modal,
  loading
} from '../../utils/util';
import {
  request
} from '../../utils/request';
import {
  GlobalEventEmitter
} from '../../utils/eventEmitter';
const chooseLocation = requirePlugin('chooseLocation');

Page({
  data: {
    isLoading: true,
    hasCurrentGame: false,
    showGameDataView: false,
    isGameInfoEditable: false,
    isPlayerDataEditable: false,
    goingTobeEdit: '',
    loginHidden: true,
    signUpHidden: true,
    isDelegate: false,
    signUpStatus: 'confirmed',
    isUserAlreadyInGame: false,
    playerData: null,
    isSharing: false,
    exitFromLocationChoose: false,
    getUserProfileTried: 0,

    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    timeArray: [
      ['0时', '1时', '2时', '3时', '4时', '5时', '6时', '7时', '8时', '9时', '10时', '11时', '12时', '13时', '14时', '15时', '16时', '17时', '18时', '19时', '20时', '21时', '22时', '23时'],
      ['00分', '15分', '30分', '45分'],
      [' - '],
      ['0时', '1时', '2时', '3时', '4时', '5时', '6时', '7时', '8时', '9时', '10时', '11时', '12时', '13时', '14时', '15时', '16时', '17时', '18时', '19时', '20时', '21时', '22时', '23时'],
      ['00分', '15分', '30分', '45分']
    ],
    timeIndex: [18, 0, 0, 22, 0],
    gameType: {
      types: ['对内联赛', '友谊赛', '对抗赛'],
      index: 0
    },
    aSideType: {
      types: ['5人制', '6人制', '7人制', '8人制', '9人制', '11人制'],
      index: 1
    },
    game: null,
    gameBeforeEdit: null,
    totalConfirmed: 0,
  },

  async onLoad() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });

    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      });
    }
    GlobalEventEmitter.on('openIdGot', async (data) => {
      console.log(`openIdGot`, data);
      await this.getPlayerData(false);
    });

    GlobalEventEmitter.on('currentGameTabDoubleSelected', async () => {
      console.log('currentGameTabDoubleSelected');
      await this.refresh();
    });

    // await this.getCurrentGame();
  },

  async onShow() {
    this.setTabSelection();

    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null

    this.setData({
      isSharing: false
    });

    console.log('this.data.exitFromLocationChoose', this.data.exitFromLocationChoose);
    // 从地点选择界面退出时不触发reload, 正在创建比赛时不触发reload
    if (!this.data.exitFromLocationChoose) {
      await this.getCurrentGame();
    }

    console.log('location', location);

    if (location && location.name) {
      this.setData({
        ['game.location']: location
      });
    }

    this.setData({
      exitFromLocationChoose: false
    });
  },

  setTabSelection() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },

  async onPullDownRefresh() {
    console.log('onPullDownRefresh');
    if (this.data.showGameDataView && (!this.data.hasCurrentGame || this.data.isGameInfoEditable)) {
      console.log('正在创建或修改比赛，取消下拉更新');
      wx.stopPullDownRefresh();
      return;
    }
    await this.getCurrentGame();
    wx.stopPullDownRefresh();
  },

  async getPlayerData(isShowLoading = true) {
    const openId = wx.getStorageSync('openId');
    if (!openId) return;

    const player = await request('GET', `/players/${openId}`, null, isShowLoading);
    console.log('player already exist in init?', player);

    if (player) {
      this.setData({
        playerData: player
      });
    }
  },

  async getUserProfile(e) {
    const isDelegate = e.currentTarget.dataset.delegate;
    console.log('isDelegate', isDelegate);
    const status = e.currentTarget.dataset.status;
    console.log('status', status);

    if (!isDelegate && this.data.isUserAlreadyInGame) {
      toast('你已经报过名(或待定、请假)了，如需改变，请先点击报名信息以取消报名', 'none', 4000, false);
      return;
    }

    console.log('this.data.playerData', this.data.playerData);
    if (this.data.playerData) {
      this.setUserProfileAndShowSignUp(this.data.playerData, isDelegate, status);
      return;
    }

    const openId = wx.getStorageSync('openId');
    if (openId) {
      const player = await request('GET', `/players/${openId}`);
      console.log('player already exist?', player);
      this.requestUserProfileAndShowSignUp(isDelegate, status);
      if (player) {
        this.setUserProfileAndShowSignUp(player, isDelegate, status);
      } else {
        this.requestUserProfileAndShowSignUp(isDelegate, status);
      }
    } else {
      this.requestUserProfileAndShowSignUp(isDelegate, status);
    }
  },

  requestUserProfileAndShowSignUp(isDelegate, status) {
    wx.getUserProfile({
      desc: '用于添加报名信息及统计参与次数', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(`res user profile`, res);
        this.setUserProfileAndShowSignUp(res.userInfo, isDelegate, status);
      },
      fail: (res) => {
        console.log('failed when requestUserProfileAndShowSignUp', res);

        if (this.data.getUserProfileTried >= 1) {
          wx.setStorageSync('isDelegateForManualInput', isDelegate);
          wx.setStorageSync('statusForManualInput', status);
          // toast('获取您的用户信息失败，你可以暂时手动填入你的姓名来报名', 'none', 4000, false);

          const me = this;
          wx.showModal({
            title: '获取您的用户信息失败，你可以暂时手动填入你的姓名来报名',
            content: '',
            editable: true,
            success (res) {
              if (res.confirm) {
                if (!res.content) {
                  toast('请输入姓名');
                  return;
                }
                wx.setStorageSync('openId', new Date().getTime());
                me.setUserProfileAndShowSignUp({nickName: res.content}, isDelegate, status);
              } 
            }
          })
          return;
        }

        toast('获取您的用户信息失败，请重试！');
        const tried = this.data.getUserProfileTried + 1;
        this.setData({
          getUserProfileTried: tried
        });
      }
    })
  },

  setUserProfileAndShowSignUp(userInfo, isDelegate, status) {
    this.setData({
      userInfo: userInfo,
      hasUserInfo: true,
    });
    
    this.setData({
      isDelegate: !!isDelegate,
      signUpStatus: status,
      signUpHidden: false
    })
  },

  showLogin(e) {
    const goingTobeEdit = e.currentTarget.dataset.name;
    this.setData({
      goingTobeEdit,
      loginHidden: false,
    });
  },

  beforeShare() {
    this.setData({
      isSharing: true
    });
  },

  onShareTimeline: function (res) {
    this.beforeShare();

    return {
      title: this.getShareInfo(),
      // imageUrl: `https://iti-images.s3.amazonaws.com/events/897195ed-1495-bc59-11e2-28704a1e2a92.webp`,
      // query: "",
    };
  },
  onShareAppMessage: function (res) {
    this.beforeShare();
    
    return {
      title: this.getShareInfo(),
      // imageUrl: `https://iti-images.s3.amazonaws.com/events/897195ed-1495-bc59-11e2-28704a1e2a92.webp`,
      path: "pages/create/create",
    };
  },

  getShareInfo() {
    const game = this.data.game;
    return `${game.title} | ${game.date.dateString} ${game.date.dateWeekday} | ${game.date.timeString} | ${game.location.name} | ${game.type}`;
  },

  showCreateView() {
    console.log('goingTobeEdit', this.data.goingTobeEdit);
    // 为例避免比赛信息改变但还未提交时又更新球员信息，导致比赛信息无法更新
    // 把编辑按钮改成两个，上面那个只负责编辑比赛信息，下面报名情况那个只负责编辑报名信息
    // goingTobeEdit = 'player' | 'game'

    this.resetTimePicker();
    this.getGameTime(true);

    if (this.data.goingTobeEdit === 'game') {
      this.setData({
        showGameDataView: true,
        isGameInfoEditable: true
      });
    } else {
      this.setData({
        showGameDataView: true,
        isPlayerDataEditable: true
      });
    }
  },

  bindDateChange: function (e) {
    const weekDay = getWeekday(e.detail.value);
    this.setData({
      ['game.date.dateString']: e.detail.value,
      ['game.date.dateWeekday']: `${weekDay}`
    })
    // const date = this.getRoundDate(e.detail.value);
    // this.setData({
    //   ['editingRound.date']: date
    // })
  },

  bindTimeChange: function (e) {
    this.setData({
      ['game.date.timeString']: e.detail.value
    })
  },

  bindMultiPickerChange: function (e) {
    // this.setData({
    //   multiIndex: e.detail.value
    // })
  },
  bindMultiPickerColumnChange: function (e) {
    var data = {
      timeArray: this.data.timeArray,
      timeIndex: this.data.timeIndex
    };
    data.timeIndex[e.detail.column] = e.detail.value;
    this.setData(data);
    const isSetData = true;
    this.getGameTime(isSetData);
  },

  resetTimePicker() {
    console.log('this.data.game in resetTimePicker', this.data.game);
    const timeIndexes = this.data.game ? this.getTimeIndex(this.data.game) : [18, 0, 0, 22, 0];
    console.log('timeIndexes', timeIndexes);
    this.setData({
      timeIndex: timeIndexes
    })
  },
  getGameTime: function (setData) {
    // console.log('this.data.isGameInfoEditable in getGameTime', this.data.isGameInfoEditable);
    // if (!this.data.isGameInfoEditable) return;

    let time = `${this.data.timeArray[0][this.data.timeIndex[0]]}:${this.data.timeArray[1][this.data.timeIndex[1]]}${this.data.timeArray[2][this.data.timeIndex[2]]}${this.data.timeArray[3][this.data.timeIndex[3]]}:${this.data.timeArray[4][this.data.timeIndex[4]]}`;

    time = time.replaceAll('时', '').replaceAll('分', '');
    console.log(time);
    if (setData) {
      this.setData({
        ['game.date.timeString']: time
      });
    }
    return time;
  },

  showLocationMap() {
    const key = 'MR5BZ-EISLV-XCHPM-UG62Z-YPYV2-KUBTU'; //使用在腾讯位置服务申请的key
    const referer = '土拨鼠小程序'; //调用插件的app的名称

    let location = '',
      category = ''; //'生活服务,娱乐休闲'
    if (this.data.game?.location) {
      location = JSON.stringify({
        latitude: this.data.game.location.latitude,
        longitude: this.data.game.location.longitude
      });
    }

    // 如果是打开地点选择界面，则关闭后不重新加载current game
    this.setData({
      exitFromLocationChoose: true,
    });
    console.log('exitFromLocationChoose', this.data.exitFromLocationChoose);

    if (this.data.isGameInfoEditable) {
      wx.navigateTo({
        url: `plugin://chooseLocation/index?key=${key}&referer=${referer}&location=${location}&category=${category}`
      });
    } else {
      wx.openLocation({
        latitude: this.data.game.location.latitude,
        longitude: this.data.game.location.longitude,
        scale: 18,
        name: this.data.game.location.name,
        address: this.data.game.location.address,
      });
    }
  },

  bindGameTypeChange: function (e) {
    const index = e.detail.value;
    const type = this.data.gameType.types[index];
    this.setData({
      ['gameType.index']: index,
      ['game.type']: type
    })
  },

  bindASideTypeChange: function (e) {
    const index = e.detail.value;
    const type = this.data.aSideType.types[index];
    this.setData({
      ['aSideType.index']: index,
      ['game.aSide']: type
    })
  },

  bindGameInput: function (e) {
    const field = e.currentTarget.dataset.field;
    const type = e.currentTarget.dataset.type;
    console.log(`bind for: ${field}, ${e.detail.value}, type: ${type}`);
    const value = type === 'digit' ? parseInt(e.detail.value, 10) : e.detail.value;
    this.setData({
      ['game.' + field]: value
    });
  },

  getTotalConfirmed(currentGame) {
    const total = currentGame.participants.confirmed.noTeam.length + currentGame.participants.confirmed.white.length + currentGame.participants.confirmed.blue.length + currentGame.participants.confirmed.red.length;
    return total;
  },

  isRegisteredInGame(currentGame) {
    const openId = wx.getStorageSync('openId');
    if (!openId) return false;

    let isAlreadyJoined = false;

    // 任意一队里有这个人，且不是代报名的，就不能再报了
    for (const key in currentGame.participants.confirmed) {
      if (
        Object.prototype.hasOwnProperty.call(currentGame.participants.confirmed, key)
      ) {
        if (
          currentGame.participants.confirmed[key].some(
            (x) => !x.isDelegate && (x.openId === openId)
          )
        ) {
          isAlreadyJoined = true;
        }
      }
    }

    // 待定了或者请假了
    if (
      currentGame.participants.tbd.some((x) => (x.openId === openId) && !x.isDelegate) ||
      currentGame.participants.leave.some((x) => (x.openId === openId) && !x.isDelegate)
    ) {
      isAlreadyJoined = true;
    }

    return isAlreadyJoined;
  },

  getTimeIndex(currentGame) {
    if (!currentGame) {
      return [18, 2, 0, 22, 2];
    }
    let startHourIndex = 0,
      startMinIndex = 0,
      endHourIndex = 0,
      endMinIndex = 0;
    const startAndEnd = currentGame.date.timeString.split(' - ');
    const startHourAndMin = startAndEnd[0].split(':');
    const endHourAndMin = startAndEnd[1].split(':');
    startHourIndex = this.data.timeArray[0].indexOf(`${startHourAndMin[0]}时`);
    startMinIndex = this.data.timeArray[1].indexOf(`${startHourAndMin[1]}分`);
    endHourIndex = this.data.timeArray[3].indexOf(`${endHourAndMin[0]}时`);
    endMinIndex = this.data.timeArray[4].indexOf(`${endHourAndMin[1]}分`);
    console.log(startHourIndex, startMinIndex, endHourIndex, endMinIndex);

    return [startHourIndex, startMinIndex, 0, endHourIndex, endMinIndex]
  },

  async refresh() {
    loading('请稍等');
    await this.getCurrentGame();
    wx.hideLoading();
  },

  async getCurrentGame() {
    console.log('进入getCurrentGame');

    this.setData({
      signUpHidden: true,
      loginHidden: true,
    });

    const startTime = new Date().getTime();
    let currentGame = await request('GET', `/game/current`, null, false);
    console.log(currentGame);

    const endTime = new Date().getTime();
    let diff = endTime - startTime,
      delay = 0;

    if (currentGame) {
      // 让启动页面至少显示1200ms
      if (diff < 1200) {
        delay = 1200 - diff;
      }

      const weekDay = getWeekday(currentGame.date.dateString);
      currentGame.date.dateWeekday = weekDay;
      const totalConfirmed = this.getTotalConfirmed(currentGame);
      const isAlreadyIn = this.isRegisteredInGame(currentGame);
      console.log('isAlreadyIn', isAlreadyIn);

      const gameTypeIndex = this.data.gameType.types.indexOf(currentGame.type);
      const gameASideIndex = this.data.aSideType.types.indexOf(currentGame.aSide);
      const timeIndexes = this.getTimeIndex(currentGame);

      setTimeout(() => {
        this.setData({
          game: currentGame,
          hasCurrentGame: true,
          showGameDataView: true,
          totalConfirmed,
          isUserAlreadyInGame: isAlreadyIn,
          isLoading: false,
          ['gameType.index']: gameTypeIndex,
          ['aSideType.index']: gameASideIndex,
          timeIndex: timeIndexes
        });
      }, delay);
    } else {
      if (diff < 2200) {
        delay = 2200 - diff;
      }

      this.resetTimePicker();
      const defaultData = this.getGameDefaultData();

      setTimeout(() => {
        this.setData({
          game: defaultData,
          hasCurrentGame: false,
          showGameDataView: false,
          isGameInfoEditable: true,
          isLoading: false,
          totalConfirmed: 0,
          isUserAlreadyInGame: false,
        });
      }, delay);
    }
  },

  async onAdminSuccess() {
    console.log('onAdminSuccess');
    toast('操作成功!', 'none', 3000, false, true);

    await this.getCurrentGame();
    this.setEditable(false, true);
  },

  processTime() {
    console.log('this.data.game.date.timeString', this.data.game.date.timeString);
    let startString = this.data.game.date.dateString + ' ' + this.data.game.date.timeString.split(' - ')[0];
    let endString = this.data.game.date.dateString + ' ' + this.data.game.date.timeString.split(' - ')[1];

    const startTime = new Date(startString.replaceAll('-', '/'));
    const endTime = new Date(endString.replaceAll('-', '/'));

    console.log('processed startTime', startTime);
    console.log('processed endTime', endTime);

    this.setData({
      ['game.date.startTime']: startTime,
      ['game.date.endTime']: endTime,
    });
  },

  async publish() {
    this.processTime();
    console.log(this.data.game);

    const result = await request('POST', `/game`, this.data.game);
    console.log(result);

    toast("比赛已发布，点击右上角按钮分享吧！");

    const isShowLoading = false;
    await this.getCurrentGame(isShowLoading);
    this.setEditable(false, false);
  },

  setEditable(isGameInfoEditable, isPlayerDataEditable) {
    this.setData({
      isGameInfoEditable,
      isPlayerDataEditable
    });
  },

  async updateGame() {
    this.processTime();
    console.log('update', this.data.game);

    const result = await request('PUT', `/game/${this.data.game._id}`, this.data.game);
    console.log(result);

    toast("比赛数据已更新！", 'none', 3000, false);
    await this.getCurrentGame();
    this.setEditable(false, false);
  },

  async deleteGame() {
    const res = await modal('xx', '确定要删除此比赛吗？');

    if (res) {
      const result = await request('DELETE', `/game/${this.data.game._id}`);
      console.log(result);

      toast("比赛已删除！", 'none', 3000, false);
      await this.getCurrentGame();
    }
  },

  cancelEdit() {
    this.setData({
      isGameInfoEditable: false,
      isPlayerDataEditable: false
    });
    this.refresh();
  },

  getGameDefaultData() {
    let dateString, dateWeekday, title;
    const isSetData = false;
    const timeString = this.getGameTime(isSetData);

    const dayOfToday = new Date().getDay();
    if ([1, 2, 3].some(x => x === dayOfToday)) {
      const thisThursday = getThursdayOfCurrentWeek();
      dateString = formatDate(thisThursday);
      dateWeekday = '周四';
      title = '周四走起';
    } else {
      const thisMonday = getMondayOfNextWeek();
      console.log(`thisMonday`, thisMonday);
      dateString = formatDate(thisMonday);
      dateWeekday = '周一';
      title = '周一走起';
    }

    return {
      title: title,
      date: {
        dateString,
        timeString,
        dateWeekday,
        startTime: Date,
        endTime: Date
      },
      type: '对内联赛',
      aSide: '6人制',
      plannedNumberOfPeople: '18人踢三拨',
      location: {
        name: '龙湖西安曲江星悦荟',
        address: '陕西省西安市雁塔区新开门北路888号',
        latitude: 34.216235,
        longitude: 108.992278,
        city: '西安市',
        district: '雁塔区',
        province: '陕西省',
      },
      fee: {
        fixedMember: '固定年费',
        randomMember: '40'
      },
      note: '',
      participants: {
        confirmed: {
          noTeam: [],
          white: [],
          blue: [],
          red: []
        },
        tbd: [],
        leave: []
      }
    };
  }
})