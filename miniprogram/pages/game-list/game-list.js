import {
  request
} from '../../utils/request';

Page({
  data: {
    gameList: [],
    isLoading: true,
  },

  async onLoad() {
    await this.getGameList();
  },

  async onPullDownRefresh() {
    console.log('onPullDownRefresh');
    wx.showNavigationBarLoading();
    await this.getGameList();
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  showMore(e) {
    let gameIndex = e.currentTarget.dataset.index;
    let currentStatus = this.data.gameList[gameIndex].isShowMore;
    const field = `gameList[${gameIndex}].isShowMore`;

    this.setData({
      [field]: !currentStatus
    })
  },

  async getGameList() {
    const list = await request('GET', `/game`, null, false);
    console.log('list', list);
    for (let item of list) {
      item['isShowMore'] = false;
    }

    this.setData({
      gameList: list,
      isLoading: false,
    });
  },

  showGame(e) {
    const game = e.currentTarget.dataset.game;
    console.log('game', game);

    const query = wx.createSelectorQuery()
    // 组件中：const query = wx.createSelectorQuery().in('组件id')
    const panel = query.select(game._id);
    console.log('panel', panel);
    query.exec(function (res) {
      console.log(res);
      console.log('panel in', panel);
    })
  }
})