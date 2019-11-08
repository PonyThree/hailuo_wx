


function http(method, baseURL, data) {
  console.log()
  return new Promise(function (resolve, reject) {
    let header = {
      'content-type': 'application/json',
      'token':wx.getStorageSync('token') || 0
    };
    wx.request({
      url: getApp().url + baseURL,
      method: method,
      data: method === 'post' ? JSON.stringify(data) : data,
      header: header,
      success(res) {
        //请求成功
        //判断状态码---errCode状态根据后端定义来判断
        if (res.data.code == 0) {
          resolve(res);
        }
        else if (res.data.code == 401 || res.statusCode == 401) {
          wx.redirectTo({
            url: '/pages/project/wx_logoin/wx_logoin',
          })
          return
        }
        else {
          //其他异常
          reject('请求参数有误');
        }
      },
      fail(err) {
        //请求失败
        reject(err)
      }
    })
  })
}

module.exports = http


