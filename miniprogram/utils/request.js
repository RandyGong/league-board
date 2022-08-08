const util = require('./util.js');

const baseURL = "https://league-board-api.tk";

function request(method, url, data) {
  return new Promise(function (resolve, reject) {
    const header = {
      "content-type": "application/json",
    };
    const requestData = data;//method == "POST" ? JSON.stringify(data) : data;

    util.loading();

    wx.request({
      url: baseURL + url,
      method: method,
      data: requestData,
      header: header,
      success(result) {
        console.log(result);

        if (result.statusCode === 200) {
          resolve(result.data);
        } else {
          util.toast('请求异常', 'warn', 3000, false);
        }
        // else if (result.data.code == 201)
        // {
        //   // 登录失效
        //   app.userLogin();
        // }
      },
      fail(result) { //请求失败
        wx.hideLoading();
        util.toast('请求异常了', 'warn', 3000, false);
        resolve(result);
      },
      complete: () => {
        // setTimeout(() => {
          wx.hideLoading();
        // }, 100);
      },
    });
  });
};

module.exports = {
  request,
}