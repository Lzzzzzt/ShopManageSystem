<template>
  <el-row justify="center" style="margin: 50px 0;">
    <el-col :span="16">
      <el-select v-model="selectedId" placeholder="仓库ID">
        <el-option v-for="id in storehouseIds" :key="id" :label="id" :value="id" @click="getStorehouseInfo"/>
      </el-select>
    </el-col>
  </el-row>
  <el-row justify="center" style="margin: 50px 0;">
    <el-col :span="16">
      <el-table v-if="storehouseInfo" :data="storehouseInfo.items" border max-height="600" stripe>
        <el-table-column label="ID" prop="id"/>
        <el-table-column label="商品名" prop="name"/>
        <el-table-column label="库存" prop="storeNum"/>
      </el-table>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { Storage } from '@/api/types'

const storehouseIds = ref<string[]>([])

const storehouseInfo = ref<Storage>()

const selectedId = ref<string>('')

function getStorehouseInfo () {
  axios.get('/store/getStorage/', {
    params: {
      id: selectedId.value
    }
  }).then(response => {
    storehouseInfo.value = response.data.data
    console.log(response.data.data)
  }).catch(err => console.log(err))
}

onMounted(() => {
  axios.get('/store/getStorageID')
    .then(response => {
      storehouseIds.value = response.data.data
    })
    .catch(err => console.log(err))
})
</script>

<style scoped>

</style>
