var Crawler = require("crawler");
var fs = require("fs");
var colors = require("colors");



const host = 'http://images.lancaier.com/';
// todo
const filePath = '/Users/qiu/pictures/yrzx/';
const startIndex = 259;
const endIndex = 303; // 可以打开网站看一下，303 对应 284话


var downloadImgC = new Crawler({
    maxConnections : 2,
    rateLimit: 5000,
    encoding:null,
    jQuery:false,// set false to suppress warning message.
    callback:function(err, res, done){
        if(err){
            console.error(err.stack.error);
        }else{
            fs.createWriteStream(res.options.fileName).write(res.body);
            console.log(`文件存储在${res.options.fileName}`.green)
        }

        done();
    }
});
 // downloadImgC.queue({"fileName": filePath + "一人之下235-16.jpg","uri":"http://img21.mtime.cn/CMS/Gallery/2011/07/02/170837.97014036_160X160.jpg"});

var c = new Crawler({
    maxConnections : 1,
    rateLimit: 10000,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.error(error);
        }else{
          try {
            // 这几步比较关键，需要分析网页如何动态生成图片地址。如果理解了原理就能明白下面几行代码
            const $ = res.$;
            const script = $('#pager').parent().siblings('script')[0].children[0].data.match(/eval.*/)[0];
            eval(script);

            const imgs = cInfo.fs
            const picName = $("title").text().split('-')[0];

            imgs.forEach((item, index)=>{
              const matchList = item.match(/\/(\d+).jpg/) // 屏蔽每章节的广告图片
              if(!matchList || isNaN(Number(matchList[1]))) return
              var img = { fileName: `${filePath}${picName}-${index + 1}.jpg`, uri: `${host}${item}`}

              console.log(`开始下载：${JSON.stringify(img)}`.green);
              downloadImgC.queue(img);
            })
          }catch(e){
            console.log(e.red)
          }
        }

        done();
    }
});

// 网站URL 259后缀 对应 235话，我看到 235，所以就从这边开始了
for(let i = startIndex; i < endIndex; i++ ){
  const index = `0${i}`
  c.queue([{
      uri: `http://www.57mh.com/27885/${index}.html`,
      jQuery: true
  }]);
}
