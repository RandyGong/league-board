export class SocketService {
  static socketOpen = false;
  static socketMsgQueue = [];
  static host = "https://league-board-api.tk";

  static connect() {
    console.log('socket connecting');
    wx.connectSocket({
      // url: SocketService.host,
      url: 'wss://league-board-api.tk',
      header: {
        'content-type': 'application/json'
      },
      protocols: ['TCP', 'UDP']
    });

    wx.onSocketOpen(function (res) {
      console.log('socket connected', res);
      SocketService.socketOpen = true;
      for (let i = 0; i < SocketService.socketMsgQueue.length; i++) {
        SocketService.sendSocketMessage(SocketService.socketMsgQueue[i]);
      }
      SocketService.socketMsgQueue = [];
    })
  }

  static sendSocketMessage(msg) {
    if (SocketService.socketOpen) {
      wx.sendSocketMessage({
        data: msg
      })
    } else {
      SocketService.socketMsgQueue.push(msg)
    }
  }
}