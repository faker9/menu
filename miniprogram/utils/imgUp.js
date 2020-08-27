
async function multiUp(tempFilePath){
        var arr = []
        tempFilePath.forEach(item => {
        var time = new Date().getTime()//随机时间
        var ext = item.split('.').pop()//扩展名
        //一张上传
        var item1 = wx.cloud.uploadFile({
            filePath: item,
            cloudPath: 'menu/' + time + '.' + ext
        })
        // 结果添加到数组里
        arr.push(item1)
    })
    //等待数组里的promise全部执行完毕
    var result = await Promise.all(arr)
    //提取fileID
    var cloudSrc = result.map(item => {
        return item.fileID
    })
    return cloudSrc
}
//删除图片
async function delImg(tempFilePath){
   return await wx.cloud.deleteFile({
        fileList:tempFilePath
    })
    /* tempFilePath.forEach(item=>{
        wx.cloud.deleteFile({
            fileList:[item]
        })
    }) */
    
}
export {multiUp,delImg}