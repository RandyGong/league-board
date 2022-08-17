const util = require('./util.js');

const baseURL = "https://league-board-api.tk";

function request(method, url, data, showLoading = true) {
  return new Promise(function (resolve, reject) {
    const header = {
      "content-type": "application/json",
    };
    const requestData = data;//method == "POST" ? JSON.stringify(data) : data;

    showLoading && util.loading('请稍等');

    wx.request({
      url: baseURL + url,
      method: method,
      data: requestData,
      header: header,
      success(result) {

        if (result.statusCode === 200) {
          resolve(result.data);
        } else {
          const msg = result.data.msg || '请求异常，请联系那个帅帅的管理员';
          util.toast(msg, 'none', 3000, false, true);
        }
        // else if (result.data.code == 201)
        // {
        //   // 登录失效
        //   app.userLogin();
        // }
      },
      fail(result) { //请求失败
        wx.hideLoading();
        util.toast('请求异常了，请下拉重试', 'none', 3000, false, true);
        resolve(result);
      },
      complete: () => {
        // setTimeout(() => {
          showLoading && wx.hideLoading();
        // }, 100);
      },
    });
  });
};

module.exports = {
  request,
}