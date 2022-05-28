<template>
  <el-row :gutter="30" justify="center" style="margin: 30px 0">
    <el-col :span="20">
      <el-input v-model="returnOrderId" placeholder="请输入要查询的订单ID"/>
    </el-col>
    <el-col :span="1.5">
      <el-button @click="handleReturnOrderQuery">查询</el-button>
    </el-col>
  </el-row>
  <el-row v-if="queryOrderInfo" justify="center">
    <el-col :span="10">收银员: {{ queryOrderInfo.stuffId }}</el-col>
    <el-col :span="10">订单时间: {{ queryOrderInfo.orderTime }}</el-col>
  </el-row>
  <el-row v-if="queryOrderInfo" justify="center" style="margin: 30px 0; height: 600px">
    <el-col :span="20" style="height: 100%">
      <el-table :data="queryOrderInfo.detail" border max-height="600">
        <el-table-column label="商品名" prop="name"/>
        <el-table-column label="数量" prop="num"/>
        <el-table-column label="支付金额">
          <template #default="scope">
            <span>{{ (scope.row.price - scope.row.discount) * scope.row.num }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
  <el-row v-if="queryOrderInfo" justify="center">
    <el-col :span="10">状态: {{ queryOrderInfo.state ? '已完成' : '未完成' }}</el-col>
    <el-col :span="10">支付金额: {{ queryOrderInfo.price }}</el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Order } from '@/api/types'
import axios from 'axios'

const queryOrderInfo = ref<Order>()

const returnOrderId = ref<string>('')

function handleReturnOrderQuery () {
  axios.post('/shopping/returnCheck', JSON.stringify({ id: returnOrderId.value }), {
    headers: { 'Content-Type': 'application/json' }
  }).then(response => {
    queryOrderInfo.value = response.data.data
  }).catch(err => console.log(err))
}

</script>

<style scoped>

</style>
