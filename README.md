<<<<<<< HEAD
# bmob
破解bmob云模糊查询收费 微信小程序端
=======

===================

### 增删改，登录，注册，图片上传演示
----------
今天做小程序后台用的bmob云后台发现
bmob云可以条件查询 却不能模糊条件查询 需要收费
WTF于是...你懂的
大概思路：把要查询的数据全部获取到本地 在本地模糊查询
改的bmob的demo 在index.js里面加了一个getLike方法：
/*
* 模糊查询数据0.0
*/
function getLike(t, k) {
    that = t;
    var Diary = Bmob.Object.extend("diary");
    var query = new Bmob.Query(Diary);
    query.select("title");
    query.find().then(function (results) {
        // 返回成功
        var i;
        var test=[];
        for (i = 0; i < results.length; i++) {
            if (results[i].attributes.title.indexOf(k) >= 0) {
                console.log("成功");
                // console.log(results[i]);
                test[test.length] = results[i]
                that.setData({
                    diaryList:null,
                    diaryList:test,
                })
            };
        }
    });
}


![](http://bmob-cdn-15848.b0.upaiyun.com/2017/12/28/0bbc0965400e0687802916dbdd0d3593.gif)

运行demo需要在app.js里配置id详见官网 欢迎star
##个别开发者还未申请小程序，这里提供一个一些账户
1. appkey：wx77d6b7031c1e4763
![](http://i.imgur.com/UxKDqme.png)
2. 登录演示应用账号 `zhongguovu@gmail.com` 密码：`123456`


----------

> **Tip:** 更多信息请查看[官方文档](http://docs.bmob.cn/data/wechatApp/a_faststart/doc/index.html "官方使用文档")  
>>>>>>> d72b4d8c34c6528d3dd7484056d6a4ad54ab0402
