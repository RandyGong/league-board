import {
  request
} from '../../utils/request';
import {
  GlobalEventEmitter
} from '../../utils/eventEmitter';

Page({
  data: {
    gameList: [],
    isLoading: true,
    refreshTriggered: false
  },

  async onLoad() {
    await this.getGameList();

    GlobalEventEmitter.on('gameListTabDoubleSelected', async () => {
      console.log('gameListTabDoubleSelected');
      if (this.data.refreshTriggered) return;
      await this.onPullDownRefresh();
    });
  },

  onShow() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
  },

  async onPullDownRefresh() {
    console.log('onPullDownRefresh');
    if (this.data.refreshTriggered) return;
    this.setData({
      refreshTriggered: true,
    })
    wx.showNavigationBarLoading();
    await this.getGameList();
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
    this.setData({
      refreshTriggered: false,
    })
  },

  onRestore(e) {
    console.log('onRestore:', e)
  },

  onAbort(e) {
    console.log('onAbort', e)
  },

  async showMore(e) {
    let gameIndex = e.currentTarget.dataset.index;
    let currentStatus = this.data.gameList[gameIndex].isShowMore;
    let isDetailsLoaded = this.data.gameList[gameIndex].isDetailsLoaded;
    let gameId = this.data.gameList[gameIndex]._id;
    const field = `gameList[${gameIndex}].`;

    if (!isDetailsLoaded) {
      const details = await request('GET', '/game/' + gameId);
      console.log('details', details);

      this.setData({
        [field + 'isDetailsLoaded']: true,
        [field + 'participants']: details.participants,
        [field + 'images']: details.images
      });
    }

    this.setData({
      [field + 'isShowMore']: !currentStatus
    })
  },

  async getGameList(isShowLoading = false) {
    const list = await request('GET', `/game`, null, isShowLoading);
    console.log('list', list);
    for (let item of list) {
      item['isShowMore'] = false;
      item['isDetailsLoaded'] = false;
    }

    this.setData({
      gameList: list,
      isLoading: false,
    });
  },

  previewImages(event) {
    const currentUrl = event.currentTarget.dataset.src;
    const images = event.currentTarget.dataset.images;
   
    wx.previewImage({
      current: currentUrl,
      urls: images
    })
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