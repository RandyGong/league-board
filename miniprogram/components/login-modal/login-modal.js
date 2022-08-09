import {
  toast
} from '../../utils/util'

Component({
  properties: {
    hidden: {
      type: Boolean,
      value: true
    },
  },

  data: {
    userInputLoginPwd: ''
  },

  methods: {
    // 点击modal的回调函数
    clickMask() {
      // 点击modal背景关闭遮罩层，如果不需要注释掉即可
      this.setData({
        // show: false
      })
    },
    // 点击取消按钮的回调函数
    cancel() {
      this.setData({
        show: false
      })
      this.triggerEvent('cancel') //triggerEvent触发事件
    },
    // 点击确定按钮的回调函数
    confirm() {
      this.setData({
        show: false
      })
      this.triggerEvent('confirm')
    },

    showLogin() {
      console.log('enter login');
      this.setData({
        hidden: false
      });
    },
  
    cancelLogin() {
      this.setData({
        hidden: true,
      });
    },
  
    loginInput: function (e) {
      this.setData({
        userInputLoginPwd: e.detail.value
      })
    },
  
    login() {
      if (this.data.userInputLoginPwd === 'nb') {
        this.setData({
          hidden: true
        });
        this.triggerEvent('OnLoginSuccess');
      } else {
        toast('密码错', 'none', 3000, false);
      }
    },
  }
})