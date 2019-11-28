const app=getApp()
 //判断是否通过二维码进入

  
function choice(projectId) { //扫码成功后切换项目

  app.http('post', '/user/userProject/auth0/updProjectForUser',
    { projectId:projectId} )
  .then(res=>{
  })}

module. exports =function scanCode(projectId,_this) {
  app.http('post', '/user/userProject/auth0/addProjectForUser', { projectId: projectId}).then(res => {
   if(res.data.code==0){
     wx.setStorageSync('dataid', projectId),
       _this.getdata() //获取数据
     choice(projectId)  
   }
   else{
     wx.removeStorageSync('scanid')
     wx.showToast({
       title: res.data.msg,
       icon: 'none',
     })
   }
  })
}