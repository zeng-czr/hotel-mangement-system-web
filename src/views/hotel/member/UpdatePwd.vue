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
        <el-card style="height: 344px;width: 1024px;">
          <template #header>
            <div class="card-header">
              <span>修改密码</span>
            </div>
          </template>

          <!--内容 start-->
          <!--修改密码 start-->
          <div class="set">
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form ref="updatePwdFormRef" :rules="rules" status-icon :model="formPwd" label-width="100px">
                  <el-row :gutter="20">
                    <!--旧密码-->
                    <el-col :span="24">
                      <el-form-item prop="oldPassword" label="旧密码" style="width: 100%">
                        <el-input v-model="formPwd.oldPassword" placeholder="请输入旧密码" />
                      </el-form-item>
                    </el-col>
                    <!--新密码-->
                    <el-col :span="24">
                      <el-form-item prop="newPassword" label="新密码" style="width: 100%">
                        <el-input v-model="formPwd.newPassword" placeholder="请输入新密码" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-col>
              <el-col :span="24">
                <div class="submit-form">
                  <el-button plain color="#2fa7b9" :loading="subLoading" @click="onUpdatePwdSubmit(updatePwdFormRef)" style="margin-left: 50px;">确认修改</el-button>
                </div>
              </el-col>

            </el-row>

          </div>
          <!--修改密码 end-->

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
import { reactive,ref } from 'vue'
import { FormInstance,FormRules,ElMessage,ElMessageBox } from 'element-plus'
import {updateMemberPwdApi} from "@/api/hotel/member/member";
// 按钮状态
const subLoading = ref(false)
// 定义表单实例对象
const updatePwdFormRef = ref<FormInstance>()
const formPwd = reactive({
  oldPassword: '',
  newPassword: ''
})
// 定义表单验证规则
const rules = reactive<FormRules>({
  oldPassword: [{required: true,message: '请输入旧密码' ,trigger: 'blur'}],
  newPassword: [{ required: true,message: '请输入新密码',trigger: 'blur' }]
})
// 更新会员密码
const onUpdatePwdSubmit = async (formEl: FormInstance | undefined)=> {
  if (!formEl)return
  await formEl.validate(async (valid,fields)=>{
    subLoading.value = true
    if(valid){
      const { data } = await updateMemberPwdApi(formPwd)
      if(data.status === 200){
        ElMessage.success(data.message)
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
