class MyPromise {
  static PENDING = 'PENDING'
  static FULFILLED = 'FULFILLED'
  static REJECTED = 'REJECTED'
  constructor(executor) {
    this.state = MyPromise.PENDING
    this.value = null
    this.reason = null
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []
    try {
      executor(this.resolve.bind(this), this.reject.bind(this))
    } catch (e) {
      this.reject.call(this, e)
    }
  }
  resolve(value) {
    if (this.state === MyPromise.PENDING) {
      setTimeout(() => {
        this.state = MyPromise.FULFILLED
        this.value = value
        this.onFulfilledCallbacks.forEach((cb) => cb(this.value))
      })
    }
  }
  reject(reason) {
    if (this.state === MyPromise.PENDING) {
      setTimeout(() => {
        this.state = MyPromise.REJECTED
        this.reason = reason
        this.onRejectedCallbacks.forEach((cb) => cb(this.reason))
      })
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : (value) => value
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
            throw reason
          }
    let promise2
    if (this.state === MyPromise.FULFILLED) {
      return (promise2 = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value)
            this.resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }))
    }
    if (this.state === MyPromise.REJECTED) {
      return (promise2 = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason)
            this.resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }))
    }
    if (this.state === MyPromise.PENDING) {
      return (promise2 = new MyPromise((resolve, reject) => {
        this.onFulfilledCallbacks.push((value) => {
          try {
            const x = onFulfilled(value)
            this.resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
        this.onRejectedCallbacks.push((reason) => {
          try {
            const x = onRejected(reason)
            this.resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }))
    }
  }
  resolvePromise(promise2, x, resolve, reject) {
    let called
    if (promise2 === x) {
      reject(new TypeError('Chaining cycle detected for promise'))
    }
    if (x instanceof MyPromise) {
      if (x.state === MyPromise.PENDING) {
        x.then((y) => {
          this.resolvePromise(promise2, y, resolve, reject)
        }, reject)
      } else {
        x.then(resolve, reject)
      }
    } else if (
      (typeof x === 'object' && x !== null) ||
      typeof x === 'function'
    ) {
      try {
        const then = x.then
        if (typeof then === 'function') {
          then.call(
            x,
            (y) => {
              if (called) {
                return
              }
              called = true
              this.resolvePromise(promise2, y, resolve, reject)
            },
            (r) => {
              if (called) {
                return
              }
              called = true
              reject(r)
            }
          )
        } else {
          resolve(x)
        }
      } catch (e) {
        if (called) {
          return
        }
        called = true
        reject(e)
      }
    } else {
      resolve(x)
    }
  }
}

MyPromise.defer = MyPromise.deferred = function () {
  const defer = {}
  defer.promise = new MyPromise((resolve, reject) => {
    defer.resolve = resolve
    defer.reject = reject
  })
  return defer
}

module.exports = MyPromise

// npm install -g promises-aplus-tests
// promises-aplus-tests promise.js
