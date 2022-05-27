import Mock, { Random } from 'mockjs'
import {
  getAllStorehouseId,
  getOrder,
  getPurchasePlan,
  getShoppingItems,
  getStorage,
  getStuffs,
  getSuppliers,
  getVips
} from '@/mock/data'
import { MyResponse } from '@/api/types'

Mock.mock('/shopping/items', 'get', {
  status: 0,
  msg: '',
  data: getShoppingItems(Random.integer(10, 20))
} as MyResponse)

// Mock.mock('/shopping/showOrder', 'get', {
//   status: 0,
//   msg: '',
//   data: getOrder()
// } as MyResponse)

Mock.mock('/shopping/isVip/:id', 'get', {
  status: 0,
  msg: '',
  data: { isVip: Random.boolean() }
} as MyResponse)

Mock.mock('/store/getStorage', 'get', {
  status: 0,
  msg: '',
  data: getStorage()
} as MyResponse)

Mock.mock('/store/plan/show', 'get', {
  status: 0,
  msg: '',
  data: getPurchasePlan(Random.integer(2, 5))
} as MyResponse)

Mock.mock('/manage/employee/show', 'get', {
  status: 0,
  msg: '',
  data: getStuffs(Random.integer(20, 30))
} as MyResponse)

Mock.mock('/manage/vip/show', 'get', {
  status: 0,
  msg: '',
  data: getVips(Random.integer(5, 15))
} as MyResponse)

Mock.mock('/manage/supplier/show', 'get', {
  status: 0,
  msg: '',
  data: getSuppliers(Random.integer(3, 10))
} as MyResponse)

Mock.mock('/shopping/checkOrder', 'post', {
  status: 0,
  msg: '',
  data: getOrder()
} as MyResponse)

Mock.mock('/shopping/returnCheck', 'post', {
  status: 0,
  msg: '',
  data: getOrder()
} as MyResponse)

Mock.mock('/shopping/return', 'post', {
  status: 0,
  msg: '',
  data: null
} as MyResponse)

Mock.mock('/store/getStorageID', 'get', {
  status: 0,
  msg: '',
  data: getAllStorehouseId(Random.integer(3, 6))
} as MyResponse)

Mock.mock(/\/store\/getStorage\/\?id=.*/, 'get', {
  status: 0,
  msg: '',
  data: getStorage()
} as MyResponse)

Mock.mock(/\/manage\/employee\/update/, 'post', {
  status: 0,
  msg: '',
  data: getStuffs(Random.integer(20, 30))
} as MyResponse)

Mock.mock(/\/manage\/employee\/del/, 'post', {
  status: 0,
  msg: '',
  data: getStuffs(Random.integer(20, 30))
} as MyResponse)

Mock.mock(/\/manage\/vip\/show/, 'get', {
  status: 0,
  msg: '',
  data: getVips(Random.integer(10, 20))
} as MyResponse)

Mock.mock(/\/manage\/vip\/(del)|(add)|(update)/, 'post', {
  status: 0,
  msg: '',
  data: getVips(Random.integer(10, 20))
} as MyResponse)
export default Mock
