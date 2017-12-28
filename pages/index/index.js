//index.js
//获取应用实例
var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');
var app = getApp();
var that;
Page({
  data: {
    writeDiary: false,
    loading: false,
    windowHeight: 0,
    windowWidth: 0,
    limit: 10,
    diaryList: [],
    list:[],
    modifyDiarys: false
  },
  onLoad: function (e) {


  },
  noneWindows:function(){
    that.setData({
          writeDiary: "",
          modifyDiarys: ""
        })
  },
  onShow: function (e) {
    getList(this);
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },
  pullUpLoad: function (e) {
    var limit = that.data.limit + 2
    this.setData({
      limit: limit
    })
    this.onShow()
  },
  toAddDiary: function () {
    that.setData({
      writeDiary: true
    })
  },
  addDiary: function (event) {
    var title = event.detail.value.title;
    var content = event.detail.value.content;
    if (!title) {
      common.showTip("标题不能为空", "loading");
    }
    else if (!content) {
      common.showTip("内容不能为空", "loading");
    }
    else {
      that.setData({
        loading: true
      })
      var currentUser = Bmob.User.current();

      var User = Bmob.Object.extend("_User");
      var UserModel = new User();

      // var post = Bmob.Object.createWithoutData("_User", "594fdde53c");

      //增加日记
      var Diary = Bmob.Object.extend("diary");
      var diary = new Diary();
      diary.set("title", title);
      diary.set("content", content);
      if (currentUser) {
        UserModel.id = currentUser.id;
        diary.set("own", UserModel);
      }
      //添加数据，第一个入口参数是null
      diary.save(null, {
        success: function (result) {
          // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
          common.showTip('添加日记成功');
          that.setData({
            writeDiary: false,
            loading: false
          })
          that.onShow()
        },
        error: function (result, error) {
          // 添加失败
          common.showTip('添加日记失败，请重新发布', 'loading');

        }
      });
    }

  },
  closeLayer: function () {
    that.setData({
      writeDiary: false
    })
  },
  deleteDiary: function (event) {
    var objectId = event.target.dataset.id;
    wx.showModal({
      title: '操作提示',
      content: '确定要删除要日记？',
      success: function (res) {
        if (res.confirm) {
          //删除日记
          var Diary = Bmob.Object.extend("diary");
          //创建查询对象，入口参数是对象类的实例
          var query = new Bmob.Query(Diary);
          query.equalTo("objectId", objectId);
          query.destroyAll({
            success: function () {
              common.showTip('删除日记成功');
              that.onShow();
            },
            error: function (err) {
              common.showTip('删除日记失败', 'loading');
            }
          });
        }
      }
    })
  },
  toModifyDiary: function (event) {
    var nowTile = event.target.dataset.title;
    var nowContent = event.target.dataset.content;
    var nowId = event.target.dataset.id;
    that.setData({
      modifyDiarys: true,
      nowTitle: nowTile,
      nowContent: nowContent,
      nowId: nowId
    })
  },
  modifyDiary: function (e) {
    var t=this;
    modify(t,e)
  },
  showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
        getList(this);
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
        getList(this);
    },
    inputTyping: function (e) {
      //搜索数据
      //模糊查询免收费
        getLike(this,e.detail.value);
        this.setData({
            inputVal: e.detail.value
        });
        
    },
  closeAddLayer: function () {
    that.setData({
      modifyDiarys: false
    })
  }

})


/*
* 获取数据
*/
function getList(t,k){
   that = t;
    var Diary = Bmob.Object.extend("diary");
    var query = new Bmob.Query(Diary);

    //会员模糊查询  付费
    // if(k){
    //   query.equalTo("title", {"$regex":""+k+".*"});
    //   }
   

     //普通会员匹配查询
    query.equalTo("title", k);


    query.descending('createdAt');
    query.include("own")
    // 查询所有数据
    query.limit(that.data.limit);
    query.find({
      success: function (results) {
        // 循环处理查询到的数据
        // console.log(results[2]);
        that.setData({
          diaryList: results
        })
        // console.log(diaryList[0]);
        
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
    
    // query.select("title");
    // query.find().then(function (results) {
    //     // 返回成功
    //     console.log(results);

    // });
}

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


function modify(t,e){
  var that=t;
//修改日记
    var modyTitle = e.detail.value.title;
    var modyContent = e.detail.value.content;
    var objectId = e.detail.value.content;
    var thatTitle = that.data.nowTitle;
    var thatContent = that.data.nowContent;
    if ((modyTitle != thatTitle || modyContent != thatContent)) {
      if (modyTitle == "" || modyContent == "") {
        common.showTip('标题或内容不能为空', 'loading');
      }
      else {
        console.log(modyContent)
        var Diary = Bmob.Object.extend("diary");
        var query = new Bmob.Query(Diary);
        // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
        query.get(that.data.nowId, {
          success: function (result) {

            // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
            result.set('title', modyTitle);
            result.set('content', modyContent);
            result.save();
            common.showTip('日记修改成功', 'success', function () {
              that.onShow();
              that.setData({
                modifyDiarys: false
              })
            });

            // The object was retrieved successfully.
          },
          error: function (object, error) {

          }
        });
      }
    }
    else if (modyTitle == "" || modyContent == "") {
      common.showTip('标题或内容不能为空', 'loading');
    }
    else {
      that.setData({
        modifyDiarys: false
      })
      common.showTip('修改成功', 'loading');
    }
}