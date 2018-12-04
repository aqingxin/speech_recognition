# 语音识别

### 通过微信小程序、node、百度语音识别接口实现一个语音转文本的效果

### 前端(小程序端)逻辑：
    小程序端主要的操作是录音，然后将录音的临时音频文件上传到node后端，让node端进一步操作。

### node后端逻辑：
    node端要安装fluent-ffmpeg模块
```javascript
//在你的本机上要安装ffmpeg以及配置相关环境变量

npm install fluent-ffmpeg

var ffmpeg = require('fluent-ffmpeg');   //在JS文件引入
```
    同时也要安装百度语音识别接口的SDK
```javascript
npm install baidu-aip-sdk

var AipSpeechServer=require('baidu-aip-sdk').speech;   //在JS文件中引入
```

后面的主要逻辑：

接收前端上传过来的临时音频文件，通过fluent-ffmpeg模块转码后保存到文件夹中，然后再调用百度语音识别接口，进行语音识别。


### 详细的代码，可以看我的源码，我的源码中都有写了注释。