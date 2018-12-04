var express = require('express');     //首先先引入各个模块
var app=express();
var fs = require('fs');
var Multiparty = require('multiparty');    //用于文件上传
var ffmpeg = require('fluent-ffmpeg');     //转换音频格式      //本机要配置好ffmpeg的相关环境变量
var AipSpeechServer=require('baidu-aip-sdk').speech;     //百度语音识别的SDK

var APP_ID=15022046;
var API_KEY='3khD29yvgLkZNm4y0ppRwZLU';
var SECRET_KEY='LtrUEGjywqCm1jckoej3Ow4n0RKUsxAk';
var client =new AipSpeechServer(APP_ID, API_KEY, SECRET_KEY);    //新建AipSpeechServer  AipSpeechClient是语音识别的node客户端，为使用语音识别的开发人员提供了一系列的交互方法。

app.use('/recognition',function(req,res){
  var form = new Multiparty.Form({uploadDir:'./public/audio'});    //new一个Multiparty对象，并且设置上传文件的目标路径
  form.parse(req,function(err,fields,files){
    if(err){
      res.json({
        ret:-1,
        data:{},
        msg:'未知错误'
      })
    }else{
      // console.log(files.file[0])
      var inputFile=files.file[0];
      var uploadedPath=inputFile.path;
      var command=ffmpeg();
      command.addInput(uploadedPath).saveToFile('./public/audio/16k.wav').on('error',function(err){   //将上传的文件进行转换格式然后保存到目标文件夹
        console.log(err)
      }).on('end',function(){
        // console.log('success');
        var  voice=fs.readFileSync('./public/audio/16k.wav');  //读取文件
        var voiceBuffer=new Buffer(voice);
        // console.log(voiceBuffer);
        client.recognize(voiceBuffer,'wav',16000).then(function(result){   //调用百度的语音识别接口
          console.log(result);
          if(result.err_no===0){
            data=result.result;
            res.json({
              res:result.err_no,
              data:{
                data:data
              },
              msg:result.err_msg
            })
          }else{
            // console.log('err')
            res.json(result)
          }
        })
        fs.unlink(uploadedPath,function(err){    //删除从前端上传过来的临时音频文件
          if(err){
            console.log(uploadedPath+'文件删除失败',err)
          }else{
            console.log(uploadedPath+'文件删除成功')
          }
        })
      })
    }
  })
})




var server=app.listen(5555,function(){
  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})