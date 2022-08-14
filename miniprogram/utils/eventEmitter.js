export class GlobalEventEmitter {
  static _handlers = {};

  // constructor() {
  //     this._handlers = {};
  // }

  static on(eventName, callback) {
      let callbacks = this._handlers[eventName] || [];
      callbacks.push(callback);
      this._handlers[eventName] = callbacks;
      return this;
  }

  // static off(eventName, callback) {
  //     let callbacks = this._handlers[eventName];
  //     this._handlers[eventName] = callbacks && callbacks.filter(fn => fn !== callback);
  //     return this;
  // }
  static off(eventName) {
      this._handlers[eventName] && (delete this._handlers[eventName]);
      return this;
  }

  static emit(eventName, ...args) {
      const callbacks = this._handlers[eventName];
      callbacks && callbacks.forEach(fn => fn.apply(args));
      return this;
  }

  static once(eventName, callback) {
      let wrapFunc = (...args) => {
          callback.apply(args);
          // this.off(eventName, wrapFunc);
          this.off(eventName);
      };
      this.on(eventName, wrapFunc);
      return this;
  }
}
