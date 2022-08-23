// appId: wx3899bc7f66c891f0
// appSecret: bd8e9cf8fd3e3c9e0082b430298cc7f1

// my openId: oDeKD4sZvCs8tZZYqc36p3K4x4lk

// app.js

import {
  request
} from './utils/request';
import {
  GlobalEventEmitter
} from './utils/eventEmitter';

App({
  onLaunch() {

    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log('check update', res)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            console.log('新的版本已经下载好');
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        }
      });
    });

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
      console.log('新版本下载失败');
    });

    // 登录
    wx.login({
      async success(res) {
        // res.code //登录凭证
        console.log(`login`, res);
        // get OpenId
        // https://api.weixin.qq.com/sns/jscode2session?appid=wx3899bc7f66c891f0&secret=bd8e9cf8fd3e3c9e0082b430298cc7f1&js_code=083j7Zkl2hioF94KDUkl2cBQ522j7ZkR&grant_type=authorization_code

        if (!res || !res.code) {
          console.log('res获取失败');
          return;
        }

        const showLoading = false;
        let openId = await request('GET', '/common/wx-user-openId?code=' + res.code, null, showLoading);
        console.log('openId', openId);
        if (openId && openId.openId) {
          wx.setStorageSync('openId', openId.openId);
          GlobalEventEmitter.emit('openIdGot', openId.openId);
        }
      }
    })
  },
  globalData: {
    userInfo: null,
  },

})

String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};