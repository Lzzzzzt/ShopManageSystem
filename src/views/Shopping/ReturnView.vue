<template>
  <el-row :gutter="30" justify="center" style="margin: 30px 0">
    <el-col :span="20">
      <el-input v-model="returnOrderId" placeholder="请输入要退款的订单ID"/>
    </el-col>
    <el-col :span="1.5">
      <el-button @click="handleReturnOrderQuery">查询</el-button>
    </el-col>
  </el-row>
  <el-row v-if="queryOrderInfo" justify="center" style="margin: 30px 0; height: 600px">
    <el-col :span="11" style="height: 100%">
      <el-table :data="queryOrderInfo.detail" max-height="600">
        <el-table-column label="商品名" prop="name"/>
        <el-table-column label="数量" prop="num"/>
        <el-table-column label="支付金额">
          <template #default="scope">
            <span>{{ (scope.row.price - scope.row.discount) * scope.row.num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button :disabled="scope.row.num === 0" plain type="warning" @click="handleItemReturn(scope.row.id)">
              退货
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-divider direction="vertical" style="height: auto"></el-divider>
    <el-col :span="11" style="height: 100%">
      <el-table :data="returnItems" max-height="600">
        <el-table-column label="商品名" prop="name"/>
        <el-table-column label="数量" prop="num"/>
        <el-table-column label="返还金额">
          <template #default="scope">
            <span>{{ (scope.row.price - scope.row.discount) * scope.row.num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button plain type="success" @click="handleCancelItemReturn(scope.row.id)">取消</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
  <el-row v-if="queryOrderInfo" justify="center">
    <el-col :span="1.5">
      <el-button :disabled="returnItems.length === 0" size="large" type="primary" @click="handleReturnSettlement">
        提交
      </el-button>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Order, ShoppingItem } from '@/api/types'
import axios from 'axios'

const queryOrderInfo = ref<Order>()

const orderItemInfoMap = computed<Map<string, ShoppingItem>>(() => {
  const map = new Map<string, ShoppingItem>()
  queryOrderInfo.value?.detail.forEach(value => map.set(value.id, value))
  return map
})

const returnItems = ref<ShoppingItem[]>([])

const returnOrderId = ref<string>('')

function handleReturnOrderQuery () {
  axios.post('/shopping/returnCheck', JSON.stringify({ id: returnOrderId.value }), {
    headers: { 'Content-Type': 'application/json' }
  }).then(response => {
    queryOrderInfo.value = response.data.data
  }).catch(err => console.log(err))
}

function handleItemReturn (id: string) {
  let cnt = 0
  returnItems.value.forEach(value => {
    if (value.id === id) {
      value.num++
      return
    }
    cnt++
  })
  if (cnt === returnItems.value.length) {
    returnItems.value.push({
      ...orderItemInfoMap.value.get(id) as ShoppingItem,
      num: 1
    })
  }
  queryOrderInfo.value?.detail.forEach(value => value.id === id ? value.num-- : '')
}

function handleCancelItemReturn (id: string) {
  returnItems.value.forEach((value, index) => {
    if (value.id === id) {
      value.num--
    }
    if (value.num === 0) {
      returnItems.value.splice(index, 1)
    }
  })
  queryOrderInfo.value?.detail.forEach(value => value.id === id ? value.num++ : '')
}

function handleReturnSettlement () {
  axios.post('/shopping/return', JSON.stringify({
    orderId: returnOrderId.value,
    items: returnItems.value
  }), {
    headers: { 'Content-Type': 'application/json' }
  }).then(response => {
    console.log(response)
    returnOrderId.value = ''
    returnItems.value = []
    queryOrderInfo.value = undefined
  })
    .catch(err => console.log(err))
}
</script>

<style scoped>

</style>
