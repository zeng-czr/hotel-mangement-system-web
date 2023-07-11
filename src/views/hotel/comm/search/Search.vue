<template>
  <!--搜索 start-->
  <div  style="height: auto;">
    <el-form>
      <div class="input-search">
        <div class="search-room">
          <el-input placeholder="搜索你需要的房间" v-model="keywords"></el-input>
          <el-button  color="#00BFFF" class="hotel-btn" :icon="Search" size="large" @click="searchKeyWord">
          </el-button>
        </div>
      </div>
    </el-form>
  </div>
  <!--搜索 end-->
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ref} from 'vue'

// 获取路由对象
const router = useRouter()
// 根据关键字搜索
const keywords = ref('')

const searchKeyWord = ()=> {
  // 跳转到列表页
  router.push({
    path: '/hotel/list',
    query: {
      keywords: keywords.value
    }
  })
}
</script>

<style scoped>

.hotel-room-nav .input-search {
  width: 100%;
  padding: 30px 0 10px;
  text-align: center;
  background-color: #FFF;
}
.hotel-room-nav .input-search .el-input {
  vertical-align: middle;
  width: 500px;
  height: 40px;
  margin-right: 10px;
  background: #d9dfe0;
  border: none;
  outline: none;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
}
</style>
