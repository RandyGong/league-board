// appId: wx3899bc7f66c891f0
// appSecret: bd8e9cf8fd3e3c9e0082b430298cc7f1

// my openId: oDeKD4sZvCs8tZZYqc36p3K4x4lk

// app.js

App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success(res) {
        // res.code //登录凭证
        console.log(`login`, res);
        // get OpenId
        // https://api.weixin.qq.com/sns/jscode2session?appid=wx3899bc7f66c891f0&secret=bd8e9cf8fd3e3c9e0082b430298cc7f1&js_code=083j7Zkl2hioF94KDUkl2cBQ522j7ZkR&grant_type=authorization_code

        // wx.request({
        //   url: 'http://localhost:3210/common/wx-user-openId?code=' + res.code,
        //   method: 'GET',
        //   success(result) {
        //     console.log(result);
        //   },
        //   fail(result) { //请求失败
        //   },
        // });
      }
    })
  },
  globalData: {
    userInfo: null
  }
})

String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};