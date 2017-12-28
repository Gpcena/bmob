<<<<<<< HEAD
# bmob
破解bmob云模糊查询收费 微信小程序端
=======
----------
今天做小程序后台用的bmob云后台发现<br>
bmob云可以条件查询 却不能模糊条件查询 需要收费<br>
WTF于是...你懂的<br>
大概思路：把要查询的数据全部获取到本地 在本地模糊查询<br>
改的bmob的demo 在index.js里面加了一个getLike方法：<br>
/*<br>
* 模糊查询数据方法代码<br>
*/<br>
function getLike(t, k) {<br>
    that = t;><br>
    var Diary = Bmob.Object.extend("diary");<br>
    var query = new Bmob.Query(Diary);<br>
    query.select("title");<br>
    query.find().then(function (results) {<br>
        // 返回成功<br>
        var i;<br>
        var test=[];<br>
        for (i = 0; i < results.length; i++) {<br>
            if (results[i].attributes.title.indexOf(k) >= 0) {<br>
                console.log("成功");<br>
                // console.log(results[i]);<br>
                test[test.length] = results[i]<br>
                that.setData({<br>
                    diaryList:null,<br>
                    diaryList:test,<br>
                })
            };
        }
    });
}


![](http://bmob-cdn-15848.b0.upaiyun.com/2017/12/28/0bbc0965400e0687802916dbdd0d3593.gif)

运行demo需要在app.js里配置id详见官网 <br>
**欢迎star**<br>
个别开发者还未申请小程序，这里提供一个一些账户
1. appkey：wx77d6b7031c1e4763
2. 登录演示应用账号 `zhongguovu@gmail.com` 密码：`123456`


----------

> **Tip:** 更多信息请查看[官方文档](http://docs.bmob.cn/data/wechatApp/a_faststart/doc/index.html "官方使用文档")  
