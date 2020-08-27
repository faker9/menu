const db = wx.cloud.database()
import {delMenuType,getTypeList,addType,UpdateMenuType} from '../../utils/db'
Page({
  data:{
    check:0,
    typeList:[]
  },
 onLoad(){
    this.refresh()
  },
  //重新获取列表刷新页面
  async refresh(){
    var res = await getTypeList('menuType')
    this.setData({
      typeList:res.data,
      check:0
    })
  },
  //点击加号弹出添加矿
  addmenu(){
    this.setData({
      check:1
    })
  },
  // 提交按钮
  async submit(e){
    var id = e.detail.target.id
    // 添加
    var data = {
      name:e.detail.value.name
    }
    if(e.detail.value.name==''){
      wx.showToast({
        title: '菜单不能为空',
        icon:'none'
      })
    }
    if(id == 'add'){
      if(this.data.typeList.some(item=>item.name == e.detail.value.name )){
        wx.showToast({
          title: '该名称已存在',
          icon:'none'
        })
       this.setData({
        check:0
       })
        return
      }
      var res =await addType('menuType',data)
      wx.showToast({
        title: '添加成功',
        icon:'success'
      })
      this.refresh()
    }
    // 修改
    else{
      if(this.data.typeList.some(item=>item.name == e.detail.value.name )){
        wx.showToast({
          title: '该名称已存在',
          icon:'none'
        })
       this.setData({
        check:0
       })
        return
      }
      var data = {name:e.detail.value.name}
      
      var res =await UpdateMenuType('menuType',this.data.id,data)
      wx.showToast({
        title: '修改成功',
        icon:'success'
      })
      this.refresh()
    }
  },


  // 修改弹出
  update(e){
    this.setData({
      check:2
    })
    this.setData({
      id:e.target.id
    })
  },
  //删除
  async del(e){
    wx.showModal({
      title: '删除?',
      content: '确认删除该菜单吗?',
      success : async (res)=> {
        if (res.confirm) {
          var res = await delMenuType('menuType',e.target.id)
          wx.showToast({
            title: '删除成功',
            icon:'success'
          })

          this.refresh()
        } 
      }
    })
   
   
  }
})