<template>
  <el-row justify="center" style="margin-top: 50px">
    <el-col :span="20">
      <el-table :data="[...stuffInfoIdMap.values()]" border max-height="800" stripe>
        <el-table-column label="员工ID" prop="id"/>
        <el-table-column label="姓名" prop="name"/>
        <el-table-column label="电话" prop="phone"/>
        <el-table-column label="职称" prop="title"/>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button plain type="primary" @click="handleChangeStuffInfo(scope.row.id)">修改信息</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
  <el-dialog v-model="changeDialogActive">
    <el-row align="middle" style="margin-top: 20px">
      <el-col :span="4">员工ID</el-col>
      <el-col :span="20">
        <el-input v-model="currentChangingStuff.id" disabled/>
      </el-col>
    </el-row>
    <el-row align="middle" style="margin-top: 20px">
      <el-col :span="4">姓名</el-col>
      <el-col :span="20">
        <el-input v-model="currentChangingStuff.name"/>
      </el-col>
    </el-row>
    <el-row align="middle" style="margin-top: 20px">
      <el-col :span="4">电话</el-col>
      <el-col :span="20">
        <el-input v-model="currentChangingStuff.phone"/>
      </el-col>
    </el-row>
    <el-row align="middle" style="margin-top: 20px">
      <el-col :span="4">职称</el-col>
      <el-col :span="20">
        <el-input v-model="currentChangingStuff.title"/>
      </el-col>
    </el-row>
    <el-row justify="space-between" style="margin-top: 20px">
      <el-button size="large" type="danger" @click="handleDelStuff">删除</el-button>
      <el-button size="large" type="warning" @click="handleSaveChange">保存</el-button>
    </el-row>
  </el-dialog>
  <el-dialog v-model="addStuffDialogActive">
    <el-row align="middle" style="margin-top: 20px">
      <el-col :span="4">员工ID</el-col>
      <el-col :span="20">
        <el-input v-model="addingStuff.id"/>
      </el-col>
    </el-row>
    <el-row align="middle" style="margin-top: 20px">
      <el-col :span="4">姓名</el-col>
      <el-col :span="20">
        <el-input v-model="addingStuff.name"/>
      </el-col>
    </el-row>
    <el-row align="middle" style="margin-top: 20px">
      <el-col :span="4">电话</el-col>
      <el-col :span="20">
        <el-input v-model="addingStuff.phone"/>
      </el-col>
    </el-row>
    <el-row align="middle" style="margin-top: 20px">
      <el-col :span="4">职称</el-col>
      <el-col :span="20">
        <el-input v-model="addingStuff.title"/>
      </el-col>
    </el-row>
    <el-row justify="end" style="margin-top: 20px">
      <el-button size="large" type="warning" @click="handleAddStuffSave">保存</el-button>
    </el-row>
  </el-dialog>
  <el-button :icon="Plus" circle class="add" size="large" type="primary" @click="addStuffDialogActive = true"/>
  <el-alert v-show="errMsg !== ''" :title="errMsg" class="alert" type="error"/>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import { Stuff } from '@/api/types'
import { Plus } from '@element-plus/icons-vue'

const stuffInfo = ref<Stuff[]>([])

const stuffInfoIdMap = computed<Map<string, Stuff>>(() => {
  const map = new Map<string, Stuff>()
  stuffInfo.value.forEach(value => map.set(value.id, value))
  return map
})

const changeDialogActive = ref<boolean>(false)

const currentChangingStuff = ref<Stuff>({} as Stuff)

const addStuffDialogActive = ref<boolean>(false)

const addingStuff = ref<Stuff>({
  name: '',
  id: '',
  title: '',
  phone: ''
} as Stuff)

const errMsg = ref<string>('')

function handleAddStuffSave () {
  if ([...stuffInfoIdMap.value.keys()].indexOf(addingStuff.value.id) !== -1) {
    errMsg.value = '重复ID'
  } else {
    axios.post('/manage/employee/add', JSON.stringify(addingStuff.value), {
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      stuffInfo.value = response.data.data
    }).catch(err => console.log(err))

    errMsg.value = ''
    addingStuff.value = {
      name: '',
      id: '',
      title: '',
      phone: ''
    } as Stuff
    addStuffDialogActive.value = false
  }
}

function handleChangeStuffInfo (id: string) {
  currentChangingStuff.value = stuffInfoIdMap.value.get(id) as Stuff
  changeDialogActive.value = true
}

function handleSaveChange () {
  axios.post('/manage/employee/update', JSON.stringify(currentChangingStuff.value), {
    headers: { 'Content-Type': 'application/json' }
  }).then(response => {
    stuffInfo.value = response.data.data
  }).catch(err => console.log(err))

  currentChangingStuff.value = {} as Stuff
  changeDialogActive.value = false
}

function handleDelStuff () {
  axios.post('/manage/employee/del', JSON.stringify({ id: currentChangingStuff.value.id }), {
    headers: { 'Content-Type': 'application/json' }
  }).then(response => {
    stuffInfo.value = response.data.data
  }).catch(err => console.log(err))

  currentChangingStuff.value = {} as Stuff
  changeDialogActive.value = false
}

onMounted(() => {
  axios.get('/manage/employee/show')
    .then(response => {
      console.log(response.data.data)
      stuffInfo.value = response.data.data as Stuff[]
    })
    .catch(err => console.log(err))
})

</script>

<style scoped>
.add {
  position: absolute;
  top: 90%;
  left: 95%;
}

.alert {
  z-index: 9999;
  position: absolute;
  width: 30%;
  top: 5%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
