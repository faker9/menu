//获取app实例
const app = getApp()
const db = wx.cloud.database()
import { getTypeList, delMenuType } from '../../utils/db'
import { delImg } from '../../utils/imgUp'
Page({
    data: {
        info: null,
        arr: ['菜谱', '分类', '关注'],
        activeId: 0,
        typeList: [],
        menuList: []

    },
    //获取用户信息
    getuserinfo(e) {
        app.globalData.userInfo = e.detail.userInfo
        app.globalData.isLogin = true
        this.setData({
            info: e.detail.userInfo,
        })
    },
    //页面加载
    onLoad() {
        if (app.globalData.userInfo) {
            this.setData({
                info: app.globalData.userInfo,
                openid: app.globalData.openid
            })
        } else//回调函数
        {
            app.userInfoReadyCallback = res => {
                this.setData({
                    info: res.userInfo,
                    openid: app.globalData.openid
                })
            }
        }
        //列表渲染
        this.retypeList()
        this.getMenu()
    },
    //分类列表渲染
    async retypeList() {
        var res = await getTypeList('menuType', { _openid: this.data.openid })
        this.setData({
            typeList: res.data
        })

    },
    // 选项卡选择
    async choose(e) {
        var id = e.currentTarget.id
        this.setData({
            activeId: id
        })

        //选择关注的时候
        var res = await getTypeList('loves', { _openid: this.data.openid })
        // 多条数据查询
        var arr = res.data.map(item => item.menuid)
        var res2 = await db.collection('menu').where({ _id: db.command.in(arr) }).get()
        this.setData({
            loveList: res2.data
        })
    },
    //获取菜单
    async getMenu() {
        var res = await getTypeList('menu', { _openid: this.data.openid })
        this.setData({
            menuList: res.data
        })
    },

    //到添加类型页面
    toType() {
        // 我才能进菜单管理
        if(this.data.openid=='oewK35Np7jdbo_tCFAHlv9xQ-Xh4'){
            wx.navigateTo({
                url: '../pbmenutype/pbmenutype',
            })
        }
       
    },
    //到添加详细信息页
    toPublish() {
        wx.navigateTo({
            url: '../publish/publish',
        })
    },
    // 删除菜单列表
    async delCdlb(e) {
        wx.showModal({
            title: '删除',
            content: '确认删除吗?',
            success:async res=> {
                if (res.confirm) {
                    wx.showToast({
                        title: '删除成功'
                    })
                    var id = e.currentTarget.id
                    await delMenuType('menu', id)
                    //删除图片
                    var index = e.currentTarget.dataset.index
                    var arr = this.data.menuList[index].img
                    var resImg =  await delImg(arr)
                    console.log(resImg)
                    //刷新页面
                    this.data.menuList.splice(index, 1)
                    this.setData({
                        menuList: this.data.menuList
                    })
                    //删除关注中的menuid
                    wx.cloud.callFunction({
                        name: "batchDel",
                        data:{menuid:id}
                      })
                }
            }
        })

    },
    // 去详情
    toDetail(e) {
        var id = e.currentTarget.id
        wx.navigateTo({
            url: '../recipeDetail/recipeDetail?id=' + id,
        })
    },
    //去分类列表
    toSortList(e) {
        var id = e.currentTarget.id

        //跳转页面
        wx.navigateTo({
            url: '../recipelist/recipelist?list=' + id,
        })
    }
})