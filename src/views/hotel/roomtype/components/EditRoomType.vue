<template>
<el-form ref="ruleFormRef" :rules="rules" :model="formRoomType" label-width="80px">
  <el-row>
    <el-col :span="12">
      <el-form-item label="类型名称" prop="typeName">
        <el-input v-model="formRoomType.typeName" placeholder="请输入房间类型名称"/>
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="类型排序" prop="typeSort">
        <el-input-number v-model="formRoomType.typeSort" placeholder="请输入类型排序"/>
      </el-form-item>
    </el-col>

    <el-col :span="24">
      <el-form-item label="备注">
        <el-input v-model="formRoomType.remarks" :rows="2" type="textarea" placeholder="请输入备注" />
      </el-form-item>
    </el-col>

  </el-row>
</el-form>

  <div class="dialog-button-wrap">
    <el-button @click="close">取消</el-button>
    <el-button @click="editRoomType(ruleFormRef)" type="success" :loading="subLoading" color="#00BFFF">保存</el-button>
  </div>

</template>

<script setup lang="ts">
import { ref,reactive } from 'vue'
import { ElMessage,FormInstance,FormRules } from 'element-plus'
import {editRoomTypeApi} from "@/api/hotel/roomtype/roomType";
// 表单实例对象
const ruleFormRef = ref<FormInstance>()
// 表单约束规则对象
const rules = reactive<FormRules>({
  typeName: [{ required: true,message: '房间类型名称不能为空',trigger: 'blur' }],
  typeSort: [{ required: true,message: '房间类型排序不能为空',trigger: 'blur' }]
})
// 定义事件
const emit = defineEmits(['closeEditRoomTypeForm','success'])
// 获取父组件传过来的roomTypeInfo对象
const props = defineProps(['roomTypeInfo'])
const roomTypeInfo = ref(props.roomTypeInfo)
// 按钮状态
const subLoading = ref(false)
// 表单数据对象
const formRoomType = reactive({
  id: 0,
  typeName: '',
  typeSort: 0,
  remarks: ''
})

// 给表单填充数据
for (const key in formRoomType) {
  formRoomType[key] = roomTypeInfo.value[key]
}
// 更新房间类型信息
const editRoomType = async (formEl: FormInstance | undefined)=> {
  if(!formEl)return
  await formEl.validate(async (valid,fields)=>{
    subLoading.value = true
    if(valid){
      const { data } = await editRoomTypeApi(formRoomType)
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
  emit('closeEditRoomTypeForm')
}
</script>

<style scoped>
.dialog-button-wrap {
  text-align: center;
  margin-top: 20px;
}
</style>
