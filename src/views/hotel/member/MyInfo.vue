<template>
  <!--顶部 start-->
  <TopHeader/>
  <!--顶部 end-->

  <!--搜索 start-->
  <div class="hotel-room-nav">
    <Search/>
  </div>
  <!--搜索 end-->
  <!--详情内容 start-->
  <div class="hotel-banner" style="background: #f2f2f2;">

    <div class="hotel-container">
      <el-space alignment="flex-start">
        <el-card>
          <!--会员菜单 start-->
          <MemberMenu/>
          <!--会员菜单 end-->
        </el-card>
        <el-card style="height: 344px">
          <template #header>
            <div class="card-header">
              <span>个人信息</span>
            </div>
          </template>

          <!--内容 start-->
          <!--我的资料 start-->
          <div class="set">
            <el-row :gutter="20">
              <el-col :span="15">
                <el-form ref="memberFormRef" :rules="rules" status-icon :model="formMember" label-width="100px">
                  <el-row :gutter="20">
                    <!--会员真实姓名-->
                    <el-col :span="12">
                      <el-form-item prop="realName" label="真实姓名" style="width: 100%">
                        <el-input v-model="formMember.realName" placeholder="请输入真实姓名" />
                      </el-form-item>
                    </el-col>
                    <!--会员昵称-->
                    <el-col :span="12">
                      <el-form-item prop="nickname" label="昵称" style="width: 100%">
                        <el-input v-model="formMember.nickname" placeholder="请输入昵称" />
                      </el-form-item>
                    </el-col>
                    <!--会员手机号-->
                    <el-col :span="12">
                      <el-form-item prop="phone" label="手机号" style="width: 100%">
                        <el-input v-model="formMember.phone" placeholder="请输入手机号" />
                      </el-form-item>
                    </el-col>
                    <!--会员邮箱-->
                    <el-col :span="12">
                      <el-form-item prop="phone" label="邮箱" style="width: 100%">
                        <el-input v-model="formMember.email" placeholder="请输入邮箱" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-col>

              <el-col :span="5">
                <!--头像-->
                  <el-form-item label="头像" style="margin: auto;" prop="memberIcon">
                    <el-upload class="avatar-uploader" :action="uploadURL" name="fileResource" :show-file-list="false" :on-success="handleAvatarSuccess">
                      <img v-if="formMember.memberIcon" :src="url+'uploadFile/'+formMember.memberIcon" style="width: 50px;border-radius: 50px;"/>
                      <img v-else src="../../../assets/default_avatar.png" style="width: 50px;border-radius: 50px;"/>
                      <span style="margin-left: 1px;font-size: 10px;text-decoration: underline;line-height: 20px">点击更换</span>
                    </el-upload>
                  </el-form-item>
               </el-col>

              <el-col :span="4">
                <!--余额-->
                <el-form-item label="余额">
                  <span style="font-size: 26px;color: darkblue;">{{formMember.balance}}元</span>
                  <span style="font-size: 10px;text-decoration: underline;line-height: 20px;cursor: pointer;" @click="open">联系客服充值</span>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <div class="submit-form">
                  <el-button plain color="#2fa7b9" :loading="subLoading" @click="onMemberSubmit(memberFormRef)" style="margin-left: 50px;">确认修改</el-button>
                </div>
              </el-col>

            </el-row>

          </div>
          <!--我的资料 end-->

          <!--内容 end-->
      </el-card>
      </el-space>
    </div>

  </div>
  <!--详情内容 end-->
  <!--底部 start-->
  <Footer/>
  <!--底部 end-->
</template>

<script setup lang="ts">
import TopHeader from "../comm/header/TopHeader.vue"
import Search from "../comm/search/Search.vue"
import Footer from "../comm/footer/Footer.vue"
import MemberMenu from "../comm/member/MemberMenu.vue"
import { FormInstance,FormRules,ElMessage,ElMessageBox } from 'element-plus'
import { ref,reactive,onMounted } from 'vue'
import {getLoginMemberInfoApi, updateMemberApi} from "@/api/hotel/member/member"

// 按钮状态
const subLoading = ref(false)
// 服务器路径
const url = import.meta.env.VITE_APP_BASE_API
// 图片上传到服务器的路径
const uploadURL = url+"user/userIcon"

// 定义表单实例对象
const memberFormRef = ref<FormInstance>()
// 定义表单数据对象
const formMember = reactive({
  id: 0,
  nickname: '',
  realName: '',
  phone: '',
  email: '',
  memberIcon: '',
  balance: 0
})
// 定义表单验证规则
const rules = reactive<FormRules>({
  realName: [{required: true,message: '请输入真实姓名' ,trigger: 'blur'}],
  nickname: [{ required: true,message: '请输入昵称',trigger: 'blur' }],
  phone: [{required: true,message: '请输入手机号' ,trigger: 'blur'}],
  email: [{ required: true,message: '请输入邮箱',trigger: 'blur' }],
  memberIcon: [{ required: true,message: '请上传头像',trigger: 'blur' }]
})

// 图片上传成功执行的函数
const handleAvatarSuccess = (res: {status:number;result: {userIcon:string}})=> {
  if(res.status === 200){
    formMember.memberIcon = res.result.userIcon
  }
}

// 获取会员信息
const getLoginMemberInfo = async ()=> {
  const { data } = await getLoginMemberInfoApi()
  // 给表单填充数据
  for (const key in formMember) {
    formMember[key] = data.result[key]
  }

}

// 更新会员信息
const onMemberSubmit = async (formEl: FormInstance | undefined)=> {
  if (!formEl)return
  await formEl.validate(async (valid,fields)=>{
    subLoading.value = true
    if(valid){
      const { data } = await updateMemberApi(formMember)
      if(data.status === 200){
        ElMessage.success(data.message)
        await getLoginMemberInfo()
      }else {
        ElMessage.error(data.message)
      }
    }else {
      ElMessage.error('提交失败，你还有未填写的项！')
      console.log('error submit!',fields)
    }
  })
  subLoading.value = false
}

// 打开客服联系信息
const open = ()=> {
  ElMessageBox.alert('微信号：111******88 手机号：138****007', '客服联系方式', {
    confirmButtonText: 'OK',
  })
}

onMounted(()=> {
  getLoginMemberInfo()
})
</script>

<style scoped>
.hotel-banner{
  margin-top: 60px;
  text-align: center;
  margin-bottom: 300px;
}
.hotel-container {
  display: flex;
  width: 1350px;
  margin: 0 auto;
  padding: 0 15px;
  box-sizing: border-box;
}


/*按钮样式*/
.submit-form {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
