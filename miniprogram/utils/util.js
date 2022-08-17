const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatDate = dateValue => {
  let date = dateValue ? new Date(dateValue) : new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  console.log('day', day);
  return `${year}-${makeTwoDigits(month)}-${makeTwoDigits(day)}`;
}

const makeTwoDigits = dateValue => {
  if (dateValue < 10) {
    return `0${dateValue}`;
  }
  return dateValue;
}

const getMondayOfNextWeek = () => {
  const today = new Date();
  const first = today.getDate() - today.getDay() + 1;
  const fifth = first + 6;
  const friday = new Date(today.setDate(fifth));
  return friday;
}
const getThursdayOfCurrentWeek = () => {
  const today = new Date();
  const first = today.getDate() - today.getDay() + 1;
  const fifth = first + 2;
  const friday = new Date(today.setDate(fifth));
  return friday;
}

const getWeekday = dateValue => {
  const date = new Date(dateValue);
  const day = date.getDay();
  console.log('day in getWeekday', day);
  return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][day];
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

function loading(title = '加载中...') {
  wx.showLoading({
    title
  });
}
function toast(title, icon = 'none', duration = 3000, isShowMask = false, isAsync = false) {
  if (isAsync) {
    setTimeout(() => {
      wx.showToast({
        title,
        icon,
        duration,
        mask: isShowMask
      });
    }, 200);
  } else {
    wx.showToast({
      title,
      icon,
      duration,
      mask: isShowMask
    });
  }
}

function modal(title, content) {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: '提示',
      content,
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          resolve(true)
        } else if (res.cancel) {
          console.log('用户点击取消')
          resolve(false)
        }
      }
    })
  })
  
}

module.exports = {
  formatTime,
  formatDate,
  loading,
  toast,
  modal,
  getMondayOfNextWeek,
  getThursdayOfCurrentWeek,
  getWeekday
}
