<template>
  <el-form ref="ruleFormRef" :rules="rules" :model="formFloor" label-width="80px">
    <el-row>

      <el-col :span="12">
        <el-form-item label="楼层号" style="width: 100%;" prop="floorNo">
          <el-input-number v-model="formFloor.floorNo" placeholder="请输入楼层号" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="楼层名称" prop="floorName">
          <el-input v-model="formFloor.floorName" placeholder="请输入楼层名称" />
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item label="备注">
          <el-input v-model="formFloor.remarks" :rows="2" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-col>

    </el-row>
  </el-form>

  <div class="dialog-button-wrap">
    <el-button @click="close">取消</el-button>
    <el-button @click="editFloor(ruleFormRef)" type="success" :loading="subLoading" color="#178557">保存</el-button>
  </div>

</template>

<script setup lang="ts">
import { ref,reactive } from 'vue'
import { ElMessage,FormInstance,FormRules } from 'element-plus'
import {editFloorApi} from "@/api/hotel/floor/floor"
// 定义事件
const emit = defineEmits(['closeEditFloorForm','success'])
// 按钮状态
const subLoading = ref(false)
// 表单数据对象
const formFloor = reactive({
  id: 0,
  floorNo: 1,
  floorName: '',
  remarks: ''
})
// 表单实例对象
const ruleFormRef = ref<FormInstance>()
// 表单约束规则对象
const rules = reactive<FormRules>({
  floorNo: [{required: true,message: '楼层号不能为空',trigger: 'blur'}],
  floorName: [{ required: true,message: '楼层名称不能为空',trigger: 'blur' }]
})


// 获取父组件传过来的floorInfo对象
const props = defineProps(['floorInfo'])
const floorInfo = ref(props.floorInfo)
// 给表单填充数据
for (const key in formFloor) {
  formFloor[key] = floorInfo.value[key]
}

// 更新楼层信息
const editFloor = async (formEl: FormInstance | undefined)=> {
  if(!formEl)return
  await formEl.validate(async (valid,fields)=>{
    subLoading.value = true
    if(valid){
      const { data } = await editFloorApi(formFloor)
      if(data.status === 200){
        ElMessage.success(data.message)
        emit('success')
      }else {
        ElMessage.error(data.message)
      }
    }else {
      ElMessage.error('提交失败，你还有未填写的项')
    }
  })
  subLoading.value = false
}

// 取消表单
const close = ()=>{
  emit('closeEditFloorForm')
}

</script>

<style scoped>
.dialog-button-wrap {
  text-align: center;
  margin-top: 20px;
}
</style>
