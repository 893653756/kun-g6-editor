let socket = ''
let reLinkNum = 0
let reLinking = false

export function openWebSocket(path, functiononopen, functionnomessage) { // 分别传入ws路径，监听ws连接的方法
  if (typeof (WebSocket) === "undefined") {
    console.log("您的浏览器不支持socket")
  } else {
    // 实例化socket
    socket = new WebSocket(path);
    // 监听socket连接
    socket.onopen = functiononopen
    // 监听socket错误信息
    socket.onerror = socketError;
    socket.onclose = closeSocket;
    // 监听socket消息
    socket.onmessage = functionnomessage
  }
  webSocketHeart(path, functiononopen, functionnomessage)
}

function webSocketHeart(path, functiononopen, functionnomessage) {
  if (reLinking) {
    return this
  }
  let heartCheck = {    //比Nginx中的配置时间小一点就可以了
    timeout: 30*1000, // 半分钟发一次心跳，比server端设置的连接时间稍微小一点，在接近断开的情况下以通信的方式去
    serverTimeoutObj: null,
    reset() {
      // clearTimeout(this.timeoutObj);
      clearTimeout(heartCheck.serverTimeoutObj)
      return this;
    },
    start() {
      heartCheck.serverTimeoutObj = setInterval(() => {
        if (socket.readyState === 1) {
          socket.send("ping");
          reLinkNum = 0
          heartCheck.reset().start(); // 如果获取到消息，说明连接是正常的，重置心跳检测
        } else {
          reLinkNum += 1
          if (reLinkNum > 10) {
            console.log("以达尝试重连次数上限！");
            return this
          } else {
            console.log("断开状态，尝试重连");
            reLinking = true
            openWebSocket(path, functiononopen, functionnomessage)
          }
        }
        reLinking = false
      }, this.timeout)
    }
  }
  heartCheck.start()
}

function socketError(res) {
  console.log("连接错误", res)
}

function closeSocket() {
  console.log("socket已经关闭")
}

// function socketDestroyed() {
//   // 销毁监听
//   socket.onclose = closeSocket()
// }
