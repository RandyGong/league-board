const { GlobalEventEmitter } = require("../utils/eventEmitter");

Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
      "pagePath": "/pages/game-list/game-list",
      "text": "往期比赛",
      "iconPath": "/images/list.png",
      "selectedIconPath": "/images/list.png",
      "diyClass": "",
      "animation": "heartBeat"
    },
    {
      "pagePath": "/pages/create/create",
      "text": "当前比赛",
      "iconPath": "/images/ball.png",
      "selectedIconPath": "/images/ball.png",
      "diyClass": "diy",
      "animation": "spin",
      "flame": "flame"
    },
    {
      "pagePath": "/pages/index/index",
      "text": "联赛积分",
      "iconPath": "/images/bang.png",
      "selectedIconPath": "/images/bang.png",
      "diyClass": "",
      "animation": "heartBeat"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const fromTab = this.data.selected;

      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      });

      const toTab = this.data.selected

      if (fromTab === 0 && toTab === 0) {
        GlobalEventEmitter.emit('gameListTabDoubleSelected');
      }
      if (fromTab === 1 && toTab === 1) {
        GlobalEventEmitter.emit('currentGameTabDoubleSelected');
      }
      if (fromTab === 2 && toTab === 2) {
        GlobalEventEmitter.emit('boardTabDoubleSelected');
      }
    }
  }
})