import { getPageList,getDimSearch } from '../../utils/db'
Page({
  data: {
    menuList: [],
    page:0,
    pageSize:5,
    id:'',
    isBottom:false
  },
  async onLoad(e) {
    this.data.id = e.id
    this.data.list = e.list
    var {page,pageSize} = this.data
    this.getList(this.data.id,this.data.list,page,pageSize)
  },
  //模糊
    async getList(id,list,page,pageSize){
      if(id){
        var res = await getDimSearch('menu', id,page*pageSize,pageSize)
      }
      else if(list){
        var res = await getPageList('menu',{menuTypeId:list},page*pageSize,pageSize)
      }
      if(!res) return
      this.setData({
        menuList: this.data.menuList.concat(res.data)
      })
      return res
    },
  // 去详情
  toDetail(e) {
    var id = e.currentTarget.id
    wx.navigateTo({
      url: '../recipeDetail/recipeDetail?id=' + id,
    })
  },
  //触底反弹
  async onReachBottom(){
    this.data.page+=1,
    wx.showLoading({
      title:'加载中'
    })
     var res =await  this.getList(this.data.id,this.data.list,this.data.page,this.data.pageSize)
     wx.hideLoading()
     if(res.data.length==0){
       this.setData({
         isBottom:true
       })
     }
  }
})