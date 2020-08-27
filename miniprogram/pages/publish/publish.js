//获取云端数据库
const db = wx.cloud.database()
const app = getApp()
import { addType, getTypeList } from '../../utils/db'
import {multiUp} from '../../utils/imgUp'
Page({
    data: {
        tempFilePath: [],
        num: 0,
        menu: {},
        canSub:true
    },
    //页面加载,获取菜单分类列表
    async onLoad() {
        var res = await getTypeList('menuType')
        this.setData({
            typeList: res.data
        })
        const { nickName, avatarUrl } = app.globalData.userInfo
        this.setData({
            menu: {
                nickName,
                avatarUrl
            }
        })
    },
    //选择菜单分类时,获取菜单id
    menuType(e){
        this.setData({
           menu:{
               ...this.data.menu,
            menuTypeId:e.currentTarget.id
           }
        })
    },
    //图片上传到临时路径,统计进数组
    upload() {
        // 判断数组长度,最多传5张图片
        if (this.data.tempFilePath.length >= 5) {
            wx.showToast({
                title: '最多上传5张图片',
                image: '../../images/warn.png'
            })
            return
        }
        // 图片选择
        wx.chooseImage({
            count: 5,
            success: (result) => {
                if (this.data.tempFilePath.length + result.tempFilePaths.length <= 5) {
                    this.data.tempFilePath.push(...result.tempFilePaths)
                    this.setData({
                        tempFilePath: this.data.tempFilePath,
                        num: this.data.tempFilePath.length
                    })
                }
                else {
                    wx.showToast({
                        title: '最多上传5张图片',
                        image: '../../images/warn.png'
                    })
                }
            },
        })
    },
    //菜谱上传,多张上传
    async submit(e) {
        // 上传存储
        this.setData({
            canSub:false
        })
        //   wx.showLoading()
        wx.showToast({
            title: '上传成功',
            duration:2000
        })
        var cloudSrc =  await multiUp(this.data.tempFilePath)
        //上传数据库
        
        var time = new Date().getTime()//时间戳
        this.setData({
            menu: {
                ...this.data.menu,
                ...e.detail.value,
                img: cloudSrc,
                time,
                views:0,
                loves:0
            }
        })    
        await addType('menu', this.data.menu)
       
        wx.reLaunch({
            url: '../index/index',
        })
    }
})