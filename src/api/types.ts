// 购物
export interface ShoppingItem {
  id: string,
  name: string,
  discount: number,
  price: number,
  stock: number
}

export interface CheckOrderItem {
  id: string,
  num: number,
}

export interface Order {
  orderTime: string,
  price: number,
  state: number,
  detail: Array<ShoppingItem>
}

export interface ReturnedItem {
  orderId: string,
  items: Array<ShoppingItem>
}

// 仓库
export interface StoreItem {
  id: string,
  name: string,
  inNum: number,
  outNum: number,
  storeNum: number,
}

export interface Storage {
  id: string,
  items: Array<StoreItem>
}

export interface PurchaseItem {
  storeHouseId: string,
  itemId: string,
  itemNum: number,
}

// 进货计划
export interface Plan {
  itemId: string,
  itemName: string,
  itemNum: number,
  SupplierName: string,
}

export interface PurchasePlan {
  id: string,
  plans: Array<Plan>
}

// 管理
// 员工
export interface Stuff {
  id: string,
  name: string,
  phone: string,
  title: string,
}

// VIP
export interface Vip {
  id: string,
  name: string,
  inTime: string,
  address: string | null,
  gender: string | null,
  phone: string | null,
}

// 供应商
export interface Supplier {
  id: string,
  name: string,
  address: string,
  email: string,
  phone: string,
}

export interface SuppliedItem {
  id: string,
  price: number,
  num: number,
}

export type ResData = Array<ShoppingItem> |
  Array<number> |
  boolean |
  Array<SuppliedItem> |
  Array<Vip> |
  Array<Stuff> |
  PurchasePlan[] |
  Storage |
  Order |
  ShoppingItem |
  null |
  { isVip: boolean } |
  Supplier[]

export interface MyResponse {
  status: number,
  msg: string,
  data: ResData
}
