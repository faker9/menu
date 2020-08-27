import { getTypeList, getDimSearch, getPageList2 } from '../../utils/db'
Page({
    data: {
        menuTap: [
            {
                "iconPath": '/static/index/yangsheng.png',
            },
            {
                "iconPath": '/static/index/ertong.png',
            },
            {
                "iconPath": '/static/index/tuijian.png',
            },
        ],
        menuList: [],
        value: '',
        page: 0,
        pageSize: 4
    },
    // 页面加载时
    async onLoad() {
        //渲染菜谱分类
        var res = await getTypeList('menuType')
        var arr = res.data.filter((item, index) => index < 3)
        arr.forEach((item, index) => {
            item.iconPath = this.data.menuTap[index].iconPath
        })
        this.setData({
            menuTap: arr
        })
    },
    // 页面显示时
    onShow() {
        // 获取菜谱
        this.refresh()
    },
    //下拉刷新
    onPullDownRefresh() {
        // 获取菜谱
        this.refresh(true)
    },
    // 刷新重置菜单r
    async refresh(key) {
        this.data.page = 0
        const { page, pageSize } = this.data
        var res = await getPageList2('menu', pageSize * page, pageSize)
        console.log(res)
        if(key){
            if(res.data.length>0){
                wx.stopPullDownRefresh()
                wx.showToast({title:'刷新成功'})
            }
            console.log(res)
        }
        this.setData({
            menuList: res.data,
            value: ''
        })
    },
    // 比较
    compare(property) {
        return function (a, b) {
            return (b[property] - a[property])
        }
    },
    // 去详情
    toDetail(e) {
        var id = e.currentTarget.id
        wx.navigateTo({
            url: '../recipeDetail/recipeDetail?id=' + id,
        })
    },
    //触底
    async onReachBottom() {
        this.data.page += 1
        wx.showLoading({
            title: '加载中'
        })

        var res = await getPageList2('menu', this.data.page * this.data.pageSize, this.data.pageSize)
        this.setData({
            menuList: this.data.menuList.concat(res.data)
        })
        wx.hideLoading()
        if (res.data.length == 0) {
            wx.showToast({
                title: '已经到底了',
                icon: 'none'
            })
        }
    },
    //input改变
    changeInput(e) {
        this.data.value = e.detail.value
    },
    //搜索
    search() {
        var id = this.data.value
        // 跳转到搜索列表
        wx.navigateTo({
            url: '../recipelist/recipelist?id=' + id,
        })
        this.setData({
            ...this.data,
            value: ''
        })
    },
    //导航栏菜谱分类跳转
    go() {
        wx.navigateTo({
            url: '../typelist/typelist',
        })
    },
    //导航栏其他三个跳转
    gofor(e) {
        var id = e.currentTarget.id
        //跳转页面
        wx.navigateTo({
            url: '../recipelist/recipelist?list=' + id,
        })
    },

})