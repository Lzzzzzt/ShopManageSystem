<template>
  <el-row :gutter="20" justify="center" style="width: 90%; margin: 5% 5%; height: calc(95vh * 0.84);">
    <el-col :span="22">
      <el-card shadow="hover" style="height: 100%">
        <template #header>
          <div style="display:flex; justify-content: space-between">
            <span>商品</span>
            <el-button plain type="success" @click="vipDialogActive = true">会员</el-button>
          </div>
        </template>
        <el-table height="600px" :data="items" stripe>
          <el-table-column label="商品名" prop="name"/>
          <el-table-column label="会员优惠" prop="discount"/>
          <el-table-column label="价格" prop="price"/>
          <el-table-column label="库存" prop="num"/>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button :disabled="scope.row.num <= 0" plain type="primary" @click="addItemToCart(scope.row.id)">
                购买
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
  </el-row>
  <el-button circle type="primary" class="cart" :icon="ShoppingCartFull" @click="cartDialogActive = true"/>
  <el-dialog v-model="cartDialogActive" destroy-on-close>
    <template #header>购物车</template>
    <el-table :data="itemsInCart" height="500px" show-summary :summary-method="getCartSummary" ref="cartDialogRef">
      <el-table-column label="商品名">
        <template #default="scope">
          {{ itemNameMap.get(scope.row.id) }}
        </template>
      </el-table-column>
      <el-table-column label="折扣">
        <template #default="scope">
          {{ itemDiscountMap.get(scope.row.id) }}
        </template>
      </el-table-column>
      <el-table-column label="价格">
        <template #default="scope">
          {{ itemPriceMap.get(scope.row.id) }}
        </template>
      </el-table-column>
      <el-table-column prop="num" label="数量"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button plain type="danger" @click="removeItemFromCart(scope.row.id)">
            减少
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" style="margin: 10px 0 10px 100%; transform: translateX(-100%)"
               :disabled="itemsInCart.length === 0" @click="handleOrderSettlementCheck">
      结算
    </el-button>
  </el-dialog>
  <el-dialog v-model="orderDialogActive">
    <template #header>订单</template>
    <el-row style="margin: 20px 0">
      <el-col :span="12">ID: {{ orderInfo.id }}</el-col>
      <el-col :span="12">{{ orderInfo.orderTime }}</el-col>
    </el-row>
    <el-row style="margin: 20px 0">
      <el-table :data="orderInfo.detail" max-height="500" border>
        <el-table-column prop="name" label="商品名"/>
        <el-table-column label="数量" prop="num"/>
        <el-table-column label="支付金额">
          <template #default="scope">
            <span>{{ (scope.row.price - scope.row.discount) * scope.row.num }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row style="margin: 20px 0">
      <el-col :span="6">{{ orderInfo.state ? '已完成' : '未完成' }}</el-col>
      <el-col :span="12">收银员: {{ orderInfo.stuffId }}</el-col>
      <el-col :span="6">总支付金额: {{ orderInfo.price }}</el-col>
    </el-row>
  </el-dialog>
  <el-dialog v-model="vipDialogActive">
    <el-row style="margin-top: 30px">
      <el-col>{{ isVip ? '您是VIP' : '您不是VIP' }}</el-col>
    </el-row>
    <el-row style="margin-top: 30px">
      <el-col>
        <el-input v-model="vipId"/>
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px">
      <el-col>
        <el-button @click="isVipQuery">提交</el-button>
      </el-col>
    </el-row>
  </el-dialog>
  <el-dialog v-model="stuffDialogActive" top="20vh" width="40%">
    <template #header>
      <span>员工</span>
    </template>
    <el-select v-model="selectedStuffId">
      <el-option v-for="id in allStuffId" :key="id" :label="id" :value="id"/>
    </el-select>
    <el-button :disabled="selectedStuffId === ''" style="margin: 10px 0 10px 100%; transform: translateX(-100%)"
               type="primary" @click="handleOrderSettlement">
      结算
    </el-button>
  </el-dialog>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { CheckOrderItem, Order, ShoppingItem } from '@/api/types'
import { ShoppingCartFull } from '@element-plus/icons-vue'
import { ElDialog } from 'element-plus'
// Shopping

const items = ref<ShoppingItem[]>([])

let itemsInCart = reactive<CheckOrderItem[]>([])

const itemNameMap = computed<Map<string, string>>(() => {
  const im = new Map<string, string>()
  items.value.forEach(value => im.set(value.id, value.name))
  return im
})

const itemPriceMap = computed<Map<string, number>>(() => {
  const map = new Map<string, number>()
  items.value.forEach(value => map.set(value.id, value.price))
  return map
})

const itemDiscountMap = computed<Map<string, number>>(() => {
  const map = new Map<string, number>()
  items.value.forEach(value => map.set(value.id, value.discount))
  return map
})

const cartDialogActive = ref<boolean>(false)

const orderDialogActive = ref<boolean>(false)

const orderInfo = ref<Order>()

const vipDialogActive = ref<boolean>(false)

const isVip = ref<boolean>(false)

const vipId = ref<string>('')

const stuffDialogActive = ref<boolean>(false)

const allStuffId = ref<string[]>([])

const selectedStuffId = ref<string>('')

const isVipQuery = () => {
  axios.get('/shopping/isVip/', {
    params: {
      id: vipId.value
    }
  }).then(res => {
    isVip.value = res.data.data
  }).catch(err => console.log(err))
}

function getCartSummary () {
  if (itemsInCart.length !== 0) {
    const res: string[] = []

    res.push('合计')

    const discount = itemsInCart.map((value, index) => {
      return itemDiscountMap.value.get(value.id) as number * itemsInCart[index].num
    }).reduce((pre, cur) => pre + cur)

    const price = itemsInCart.map((value, index) => {
      return itemPriceMap.value.get(value.id) as number * itemsInCart[index].num
    }).reduce((pre, cur) => pre + cur)

    const num = itemsInCart.map(value => value.num).reduce((pre, cur) => pre + cur)

    res.push(isVip.value ? discount.toString() : '0')
    res.push(price.toString())
    res.push(num.toString())
    res.push(`¥${price - (isVip.value ? discount : 0)}`)

    return res
  } else {
    return new Array<string>(5).fill('')
  }
}

function addItemToCart (id: string) {
  let cnt = 0
  itemsInCart.forEach(value => {
    if (value.id === id) {
      value.num++
      return
    }
    cnt++
  })
  if (cnt === itemsInCart.length) {
    itemsInCart.push({
      id,
      num: 1
    })
  }
  items.value.forEach(value => value.id === id ? value.num-- : '')
}

function removeItemFromCart (id: string) {
  itemsInCart.forEach((value, index) => {
    if (value.id === id) {
      value.num--
    }
    if (value.num === 0) {
      itemsInCart.splice(index, 1)
    }
  })
  items.value.forEach(value => value.id === id ? value.num++ : '')
}

function handleOrderSettlementCheck () {
  stuffDialogActive.value = true
}

function handleOrderSettlement () {
  axios.post('/shopping/checkOrder', JSON.stringify({
    isVip: isVip.value,
    stuffId: selectedStuffId.value,
    items: itemsInCart
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    if (response.data.status === 0) {
      orderInfo.value = response.data.data
      orderDialogActive.value = true
    } else {
      console.log(response.data.msg)
    }
  }).catch(err => console.log(err))
  nextTick(() => {
    cartDialogActive.value = false
    stuffDialogActive.value = false
    selectedStuffId.value = ''
    itemsInCart = []
  })
}

onMounted(() => {
  axios.get('/shopping/items')
    .then(response => {
      items.value = response.data.data
    })
    .catch(err => {
      console.log(err)
    })

  axios.get('/manage/employee/id')
    .then(res => {
      allStuffId.value = res.data.data
    })
})
</script>

<style scoped>
.cart {
  position: absolute;
  top: 94%;
  left: 95%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
}
</style>
