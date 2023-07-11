<template>
  <!--顶部 start-->
  <TopHeader/>
  <!--顶部 end-->
  <!--搜索 start-->
  <div class="hotel-room-nav">
    <Search/>
  </div>
  <!--搜索 end-->

  <!--内容 start-->
  <div class="hotel-container hotel-data">
    <el-card class="hotel-data-intro">
      <div class=" login-content">
        <!--登录 start-->
        <div class="login-bg">
          <div class="login-cont w1200">
            <div class="form-box">
              <el-form ref="formRef" :rules="rules" :model="memberForm">
                <legend>手机号登录</legend>
                <el-form-item prop="phone">
                  <el-input v-model="memberForm.phone" placeholder="请输入手机号">
                    <template #prefix>
                      <el-icon><Iphone /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input type="password" v-model="memberForm.password" placeholder="请输入登录密码">
                    <template #prefix>
                      <el-icon><Lock /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>

                <el-form-item>
                  <el-button :loading="subLoading" color="#5e6eba" @click="login(formRef)" style="width: 100%;">立即登入</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <!--登录 end-->

      </div>

    </el-card>
  </div>
  <!--内容 end-->
  <!--底部 start-->
  <Footer/>
  <!--底部 end-->
</template>

<script setup lang="ts">
import TopHeader from "../comm/header/TopHeader.vue"
import Search from "../comm/search/Search.vue"
import Footer from "../comm/footer/Footer.vue"
import { FormInstance,FormRules,ElMessage  } from 'element-plus'
import {ref,reactive} from 'vue'
import {addRoleApi} from "@/api/system/role/role"
import {loginApi, registerApi} from "@/api/hotel"
import { useRouter } from 'vue-router'
import {useMemberStore} from "@/store/modules/member"
// 获取路由对象
const router = useRouter()
// 获取会员在pinia对象
const memberStore = useMemberStore()
// 提交按钮状态
const subLoading = ref(false)
// 表单实例对象
const formRef = ref<FormInstance>()
const memberForm = reactive({
  phone: '',
  password: ''
})
// 定义表单约束规则对象
const rules = reactive<FormRules>({
  phone: [{ required: true,message: '手机号不能为空',trigger: 'blur' }],
  password: [{ required: true,message: '密码不能为空',trigger: 'blur' }]
})

// 提交登录表单
const login = async (formEl: FormInstance | undefined)=> {
  if(!formEl)return
  await formEl.validate(async (valid,fields)=> {
    subLoading.value = true
    if(valid){
      const { data } = await loginApi(memberForm)
      if(data.status===200){

        // 设置会员token
        memberStore.setMemberToken(data.result.memberToken)
        // 登录会员信息
        memberStore.setMemberInfo({
          memberIcon: data.result.memberIcon,
          nickname: data.result.nickname
        })


        ElMessage.success(data.message)
        // 跳转到首页
        router.push({
          path: '/index',
        })
      }else {
        ElMessage.error(data.message)
      }
    }else {
      ElMessage.error('提交失败，你还有未填写的项')
      console.log('提交失败',fields)
    }
    subLoading.value = false
  })
}

</script>

<style scoped>
.hotel-container {
  width: 1350px;
  padding: 0;
  position: relative;
  margin: 0 auto;
  box-sizing: border-box;
}

.hotel-data-intro {
  margin: 30px 0;
  background-color: #fff;
}

.login-content .login-bg {
  width: 100%;
  background: url(@/assets/hotel/images/load_bg.jpg) no-repeat;
  background-size: cover;
}

.login-content .login-bg .login-cont {
  height: 772px;
  position: relative;
}

.login-content .login-bg .login-cont .form-box {
  width: 300px;
  height: 390px;
  border: 1px solid #d9dadc;
  background: #fff;
  position: absolute;
  top: 196px;
  right: 90px;
  padding: 0 30px;
}
.login-content .login-bg .login-cont .form-box legend {
  font-size: 20px;
  color: #323232;
  text-align: center;
  padding: 50px 0;
}

</style>
