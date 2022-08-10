import {
  formatDate,
  toast,
  getThursdayOfCurrentWeek,
  getMondayOfCurrentWeek,
  getWeekday,
  modal
} from '../../utils/util';
import {
  request
} from '../../utils/request';
const chooseLocation = requirePlugin('chooseLocation');

Page({
  data: {
    isLoading: true,
    hasCurrentGame: false,
    showGameDataView: false,
    isEditable: true,
    loginHidden: true,
    signUpHidden: true,

    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    timeArray: [
      ['1时', '2时', '3时', '4时', '5时', '6时', '7时', '8时', '9时', '10时', '11时', '12时', '13时', '14时', '15时', '16时', '17时', '18时', '19时', '20时', '21时', '22时', '23时', '24时'],
      ['00分', '15分', '30分', '45分'],
      [' - '],
      ['1时', '2时', '3时', '4时', '5时', '6时', '7时', '8时', '9时', '10时', '11时', '12时', '13时', '14时', '15时', '16时', '17时', '18时', '19时', '20时', '21时', '22时', '23时', '24时'],
      ['00分', '15分', '30分', '45分']
    ],
    timeIndex: [17, 0, 0, 21, 0],
    gameType: {
      types: ['对内联赛', '友谊赛', '对抗赛'],
      index: 0
    },
    aSideType: {
      types: ['5人制', '6人制', '7人制', '8人制', '9人制', '11人制'],
      index: 1
    },
    game: null,
    totalConfirmed: 0
  },

  async onLoad() {
    let data = this.getGameDefaultData();

    this.setData({
      game: data
    })

    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      });
    }

    await this.getCurrentGame();
  },

  onShow() {
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    console.log({
      location
    });
    if (location && location.name) {
      this.setData({
        ['game.location']: location
      });
    }
  },

  getUserProfile(e) {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(`res user profile`, res);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          signUpHidden: false
        });
      }
    })
  },

  showLogin() {
    this.setData({
      loginHidden: false,
    });
  },

  showCreateView() {
    this.setData({
      showGameDataView: true,
      isEditable: true
    });
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
    this.setData({
      multiIndex: e.detail.value
    })
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
  getGameTime: function (setData) {
    let time = `${this.data.timeArray[0][this.data.timeIndex[0]]}:${this.data.timeArray[1][this.data.timeIndex[1]]}${this.data.timeArray[2][this.data.timeIndex[2]]}${this.data.timeArray[3][this.data.timeIndex[3]]}:${this.data.timeArray[4][this.data.timeIndex[4]]}`;

    time = time.replaceAll('时', '').replaceAll('分', '');
    console.log(time);
    if (setData) {
      this.setData({
        ['game.date.timeString']: time
      });
    }
    return time;

    // return timeArray[0][timeIndex[0]]}}:{{timeArray[1][timeIndex[1]]}}{{timeArray[2][timeIndex[2]]}}{{timeArray[3][timeIndex[3]]}}:{{timeArray[4][timeIndex[4]]
  },

  showLocationMap() {
    const key = 'MR5BZ-EISLV-XCHPM-UG62Z-YPYV2-KUBTU'; //使用在腾讯位置服务申请的key
    const referer = '土拨鼠小程序'; //调用插件的app的名称
    const location = '';
    // const location = JSON.stringify({
    //   latitude: 39.89631551,
    //   longitude: 116.323459711
    // });
    const category = ''; //'生活服务,娱乐休闲';

    wx.navigateTo({
      url: `plugin://chooseLocation/index?key=${key}&referer=${referer}&location=${location}&category=${category}`
    });
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
    console.log('totalConfirmed', total);
    return total;
  },

  async getCurrentGame(showLoading = false) {
    let currentGame = await request('GET', `/game/current`, null, showLoading);
    console.log(currentGame);

    this.setData({
      isLoading: false,
    });

    if (currentGame) {
      const weekDay = getWeekday(currentGame.date.dateString);
      currentGame.date.dateWeekday = weekDay;
      const totalConfirmed = this.getTotalConfirmed(currentGame);

      this.setData({
        game: currentGame,
        hasCurrentGame: true,
        showGameDataView: true,
        isEditable: false,
        totalConfirmed
      });
    } else {
      this.setData({
        game: this.getGameDefaultData(),
        hasCurrentGame: false,
        showGameDataView: false,
        isEditable: true,
        totalConfirmed: 0
      });
    }
  },

  processTime() {
    const startTime = new Date(this.data.game.date.dateString + ' ' + this.data.game.date.timeString.split(' - ')[0]);
    const endTime = new Date(this.data.game.date.dateString + ' ' + this.data.game.date.timeString.split(' - ')[1]);
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

    toast("比赛已发布！", 'none', 3000, false);

    const isShowLoading = false;
    await this.getCurrentGame(isShowLoading);
  },

  async updateGame() {
    this.processTime();
    console.log(this.data.game);

    const result = await request('PUT', `/game/${this.data.game._id}`, this.data.game);
    console.log(result);

    toast("比赛数据已更新！", 'none', 3000, false);
    const isShowLoading = false;
    await this.getCurrentGame(isShowLoading);
  },

  async deleteGame() {
    const res = await modal('xx', '确定要删除此比赛吗？');

    if (res) {
      const result = await request('DELETE', `/game/${this.data.game._id}`);
      console.log(result);

      toast("比赛已删除！", 'none', 3000, false);
      const isShowLoading = false;
      await this.getCurrentGame(isShowLoading);
    }
  },

  async signUp() {
    const openId = wx.setStorageSync('openId');

    if (this.data.game.type === '对内联赛') {

    }
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
      const thisMonday = getMondayOfCurrentWeek();
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