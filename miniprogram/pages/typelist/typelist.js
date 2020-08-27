import {getDimSearch,getTypeList}  from '../../utils/db'
Page({
  data:{
    value:''
  },
  //页面加载
  async onLoad(){
    var res =  await getTypeList('menuType')
    this.setData({
      typeList:res.data
    })
  },
    //input改变
    changeInput(e) {
      this.data.value = e.detail.value
  },
  //提交表单
 async submit(){
    var id = this.data.value
    console.log(id)
     // 跳转到搜索列表
     wx.navigateTo({
      url: '../recipelist/recipelist?id=' + id,
  })
  this.setData({
    value:''
  })
   
  },
  //去分类列表
  toSortList(e){
    var id = e.currentTarget.id
    //跳转页面
    wx.navigateTo({
      url: '../recipelist/recipelist?list='+id,
    })
  }
})