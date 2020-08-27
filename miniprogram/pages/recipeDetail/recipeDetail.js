import { getTypeList, addType ,delMenuType, UpdateMenuType} from '../../utils/db'
const app = getApp()
Page({
  data: {
    menuInfo: {},
    isLove: false
  },
  async onLoad(e) {
    //分享
    wx.showShareMenu({
      withShareTicket:true, 
      menus:['shareAppMessage','shareTimeline']     
      })
      
    //判断是否关注
    if(!e.id) return
    var openid = app.globalData.openid
    var res2 =await getTypeList('loves',{menuid: e.id,_openid:openid})
    this.data.isLove=res2.data.length>0?true:false
    if(res2.data[0])
    this.data.loveid = res2.data[0]._id
    //获取menu信息
    var res = await getTypeList('menu', { _id: e.id })
    res.data[0].views++
    this.setData({
      ...this.data,
      menuInfo: res.data[0]
    })
    wx.setNavigationBarTitle({
      title: this.data.menuInfo.menuName,
    })
  //浏览量加一放入数据库
  await UpdateMenuType('menu',e.id,{views:res.data[0].views})
  
  
  },
  //分享朋友圈
  onShareTimeline(res){
   /*  return {
      title: '测试小程序分享至朋友圈',
      path: '../test/test',
    } */
  },

  onShareAppMessage: function(ops) {
    /* return {
      title: "八珍玉食、垂涎三尺",
      // path: '../recipeDetail/recipeDetail',
      }  */
  },
  //点击放大
  scale(e){
    var src = e.currentTarget.id
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: this.data.menuInfo.img // 需要预览的图片http链接列表
    })
  },
  //点击关注
  async love() {
    this.setData({
      isLove: !this.data.isLove
    })
    var menuid = this.data.menuInfo._id
    //  添加到loves数据库
    if(this.data.isLove){
      // 添加关注
      wx.showToast({
        title: '关注成功',
        duration:2000,
        mask:true
      })
      var res = await addType('loves', {menuid})
      var rev = await UpdateMenuType('menu',menuid,{loves:this.data.menuInfo.loves+1})
      this.setData({
        ...this.data,
        menuInfo:{
          ...this.data.menuInfo,
          loves:this.data.menuInfo.loves+1
        }
      })
      this.data.loveid = res._id
      
    }
    else{//取消关注
      wx.showToast({
        title: '已取消关注',
        duration:2000,
        mask:true,
        icon:'none'
      })
      var res = await delMenuType('loves',this.data.loveid)
      var rev = await UpdateMenuType('menu',menuid,{loves:this.data.menuInfo.loves+1})
      this.setData({
        ...this.data,
        menuInfo:{
          ...this.data.menuInfo,
          loves:this.data.menuInfo.loves-1
        }
      })
     
    }
  },
  // 分享
  share(){
    wx.showToast({
      title: '请点击右上角分享',
      icon:'none'
    })
  }
})