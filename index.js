const getRawBody = require('raw-body');
const request = require('request-promise')

// 登录
const login = (username, password) => {
  const url = 'http://jxglstu.hfut.edu.cn:7070/appservice/home/appLogin/login.action'
  const requestData = {
    username: username,
    password: Buffer.from(password).toString('base64'),
    identity: '0'
  }

  const reqObj = request.post(url).form(requestData)
  return reqObj
}

// 入口函数
module.exports.handler = function (req, resp, context) {

  getRawBody(req, (err, body) => {
    const reqData = body.toString()
    const reqInfo = reqFormit(reqData)
    if (reqInfo.statue) {
      const res = login(reqInfo.username, reqInfo.password)
      res.then((value) => {
        sendResp(value)
      })
    }
    else {
      sendResp(reqInfo.msg)
    }
  });

  // 格式化接受的数据
  reqFormit = (reqData) => {
    if (!reqData) {
      return {
        statue: false,
        msg: '来干哈?'
      }
    }
    const reqList = reqData.split('&')
    const reqInfo = { statue: true }
    reqList.map((value) => {
      reqInfo[value.split('=')[0]] = value.split('=')[1]
    })
    if (!reqInfo.username || !reqInfo.password) {
      return {
        statue: false,
        msg: 'POST表单里缺少username或password'
      }
    }
    return reqInfo

  }

  // 返回
  sendResp = (respData) => {
    resp.setHeader('content-type', 'application/json');
    try {
      resp.send(respData);
    }
    catch (err) {
      resp.send('REEOR: ' + err.message);
    }
  }

}