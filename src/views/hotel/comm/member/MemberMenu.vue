<template>
  <div class="member-menu">
    <dl>
      <dt><a href="../hotel/myInfo.html">会员中心</a></dt>
      <dd :class="{activate: activate=='/hotel/myInfo'}">
        <router-link to="/hotel/myInfo">我的资料</router-link>
      </dd>
      <dd :class="{activate: activate=='/hotel/myReserve'}">
        <router-link to="/hotel/myReserve">我的预定</router-link>
      </dd>
      <dd :class="{activate: activate=='/hotel/payment'}">
        <router-link to="/hotel/payment">充值记录</router-link>
      </dd>
      <dd :class="{activate: activate=='/hotel/updatePwd'}">
        <router-link to="/hotel/updatePwd">修改密码</router-link>
      </dd>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
const activate = ref()
// 获取路由对象
const route = useRoute()
activate.value = route.path

</script>

<style scoped>

.member-menu {
  width: 220px;
  z-index: 100;
  top: -59px;
  background: #fff;
  box-shadow: 0px 1px 5px rgb(0 0 0 / 15%);
}

.member-menu dl dt {
  display: block;
  font-size: 16px;
  background: #5e6eba;
  line-height: 60px;
}

.member-menu dl dt a {
  color: #FFF;
}

.member-menu dl dd {
  display: block;
  width: 100%;
  margin: 0;
  line-height: 60px;
  border: none;
  border-radius: none;
  border-bottom: 1px solid #f0f0f0;
}
.activate {
  background:linear-gradient(to right,#1E90FF,#00BFFF)
}
</style>
