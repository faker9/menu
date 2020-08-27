const db = wx.cloud.database()
// 查询list
async function getTypeList (_collect,data={}){
    return await db.collection(_collect).where(data).get()
}
//分页查询
async function getPageList (_collect,data={},skip,pageSize){
    return await db.collection(_collect).where(data).skip(skip).limit(pageSize).get()
}
async function getPageList2 (_collect,skip,pageSize){
    return await db.collection(_collect).orderBy('views','desc').skip(skip).limit(pageSize).get()
}
// 模糊菜谱名字搜索
async function getDimSearch(_collect,key,skip,page,){
    return await db.collection(_collect).where( db.command.or([{
        menuName: db.RegExp({
          regexp: '.*' + key,
          options: 'i',
        })
      }
    ])).skip(skip).limit(page).get()
}
// 删除
async function delMenuType(_collect,_id){
    return await  db.collection(_collect).doc(_id).remove()
}
// 修改
async function UpdateMenuType(_collect,_id,_data){
    return await  db.collection(_collect).doc(_id).update({
        data:_data
    })
}
//添加,
async function addType(_collect,_data){
    return await  db.collection(_collect).add({
        data:_data
      })
}
export {delMenuType,getTypeList,addType,UpdateMenuType,getDimSearch,getPageList,getPageList2} 