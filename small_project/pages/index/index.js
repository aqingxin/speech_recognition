//index.js
//获取应用实例
const app = getApp()
const recorderManager = wx.getRecorderManager()
const options = {
  duration: 10000,
  sampleRate: 16000,
  numberOfChannels: 1,
  encodeBitRate: 48000,
  format: 'mp3',
  // frameSize: 50
}
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    audioResult:'无'
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  startAudio(){   //开始录音
    recorderManager.start(options)
    recorderManager.onStart(() => {
      console.log('recorder start')
    })
    wx.showLoading({
      title: '录音中',
    })
  },
  stopAudio(){    //停止录音时
    let that=this;
    recorderManager.stop();
    recorderManager.onStop((res)=>{   //停止录音时将录音的音频文件发送给后端，让后端进一步操作
      // console.log(res)
      wx.hideLoading();
      wx.showLoading({
        title: '语音识别中',
      })
      const { tempFilePath } = res;
      let _this=this;
      wx.uploadFile({   //向后端发起请求，
        url: 'http://10.21.40.155:5555/recognition',
        filePath: tempFilePath,   
        name: 'file',
        success(res){
          wx.hideLoading()
          let result=JSON.parse(res.data);
          console.log(result,result.data.data[0]);
          if(result.res==0){    //语音识别成功
            _this.setData({
              audioResult: result.data.data[0]
            })
            wx.showToast({
              title: '语音识别成功',
              icon: 'success'
            })
          }else{     //语音识别失败
            wx.showToast({
              title: '语音识别失败',
              image: '../../static/images/error.png'
            })
            console.log(result.err_msg);
          }
        },
        fail(err){
          wx.showToast({
            title: '请求失败失败',
            image: '../../static/images/error.png'
          })
        }
      })
    })
  }
})
