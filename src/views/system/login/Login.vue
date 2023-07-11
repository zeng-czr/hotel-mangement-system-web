<template>
<div class="login-container">
  <div class="login-box">
    <!--左边背景图  start-->
    <div class="login-left">
      <!-- <img src="@/assets/login/load_bg.jpg"> -->
    </div>
    <!--左边背景图  end-->
    <!--登录表单 start-->
    <div class="login-form">
      <!--标题和logo start-->
      <div class="login-title">
        <h2 class="title">酒店后台管理系统</h2>
      </div>
      <!--标题和logo end-->
      <!--登录表单组件 start-->
      <LoginForm/>
      <!--登录表单组件 end-->
    </div>
    <!--登录表单 end-->
  </div>

</div>
</template>

<script setup lang="ts">
import LoginForm from "./components/LoginForm.vue"
</script>

<style scoped>
.login-container {
  height: 100%;
  width: 100%;
  margin-top: 100px;
  padding: 25px 25px;
  box-sizing: border-box;
}

.login-box {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form {
  max-width: 480px;
  width: 50%;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 10%);
  box-sizing: border-box;
}
.login-title {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
}

.login-title .title {
  margin: 0;
  font-size: 30px;
  white-space: nowrap;
}

.login-title .icon {
  width: 60px;
}

::v-deep(.el-input__inner){
  height: 40px;
}

</style>
