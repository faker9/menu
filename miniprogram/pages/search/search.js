const db = wx.cloud.database()
Page({
  data: {
    arr: [],
    hotList:[],
    value:''
  },
  async onLoad() {
    
  },
  async onShow(){
    //获取近期搜索本地存储
    var res = wx.getStorageSync('arr')
    var hotRes =  await db.collection('menu').limit(6).orderBy('views','desc').get()
    this.setData({
      arr: res,
      hotList:hotRes.data,
      value:''
    })
  },
   //input改变
   changeInput(e) {
    this.data.value = e.detail.value
},
  submit(e) {
    var id = this.data.value
    // 添加到近期搜索本地存储
    if (this.data.arr.length > 0) {
      var reIndex = this.data.arr.findIndex(item=>item==id)
      if(reIndex!=-1){
        this.data.arr.splice(reIndex,1)
      }
      this.data.arr.unshift(id)
      wx.setStorageSync('arr', this.data.arr)

    } else {//第一次时
      var arr = [id]
      this.data.arr = arr
      wx.setStorageSync('arr', arr)
    }
    // 跳转到列表
    wx.navigateTo({
      url: '../recipelist/recipelist?id=' + id,
    })
  },
  //点击热门标签
  toHot(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../recipeDetail/recipeDetail?id=' + id,
  })
  },
  //近期搜索
  into(e) {
    var id = e.currentTarget.id
    // 跳转到列表
    wx.navigateTo({
      url: '../recipelist/recipelist?id=' + id,
    })
  }
})