import { Random } from 'mockjs'
import { Order, Plan, PurchasePlan, ShoppingItem, Storage, StoreItem, Stuff, Supplier, Vip } from '@/api/types'

export function getShoppingItems (num = 10): Array<ShoppingItem> {
  const data: ShoppingItem[] = []

  for (let i = 0; i < num; i++) {
    data.push({
      id: Random.id(),
      name: Random.cword(3, 10),
      discount: Random.integer(0, 50),
      price: Random.integer(50, 1000),
      num: Random.integer(10, 20)
    })
  }

  return data
}

export function getOrder (): Order {
  const order = {} as Order

  order.orderTime = Random.datetime()
  order.price = Random.integer(300, 10000)
  order.state = 1
  order.detail = getShoppingItems(Random.integer(3, 8))
  order.id = Random.id()
  order.stuffId = Random.id()

  return order
}

export function getAllStorehouseId (num = 5): string[] {
  const id: string[] = []
  for (let i = 0; i < num; i++) {
    id.push(Random.id())
  }
  return id
}

export function getStoreItems (num = 20): StoreItem[] {
  const items: StoreItem[] = []

  for (let i = 0; i < num; i++) {
    items.push({
      id: Random.id(),
      name: Random.cword(),
      inNum: Random.integer(0, 10),
      outNum: Random.integer(3, 8),
      storeNum: Random.integer(20, 50)
    })
  }
  return items
}

export function getStorage (): Storage {
  const storage = {} as Storage
  storage.id = Random.id()
  storage.items = getStoreItems(Random.integer(20, 30))

  return storage
}

export function getPlans (num = 5): Plan[] {
  const plans: Plan[] = []

  for (let i = 0; i < num; i++) {
    plans.push({
      itemId: Random.id(),
      itemName: Random.cword(),
      itemNum: Random.integer(1, 100),
      SupplierName: Random.name()
    })
  }

  return plans
}

export function getPurchasePlan (num = 3): PurchasePlan[] {
  const plans: PurchasePlan[] = []

  for (let i = 0; i < num; i++) {
    plans.push({
      id: Random.id(),
      plans: getPlans(Random.integer(1, 5))
    })
  }

  return plans
}

export function getStuffs (num = 15): Stuff[] {
  const stuffs: Stuff[] = []

  for (let i = 0; i < num; i++) {
    stuffs.push({
      id: Random.id(),
      name: Random.cname(),
      phone: Random.integer(10000000000, 99999999999).toString(),
      title: Random.ctitle()
    })
  }

  return stuffs
}

export function getVips (num = 10): Vip[] {
  const Vip: Vip[] = []

  for (let i = 0; i < num; i++) {
    Vip.push({
      id: Random.id(),
      name: Random.cname(),
      inTime: Random.datetime(),
      address: Random.csentence(20, 30),
      gender: Random.boolean() ? '男' : '女',
      phone: Random.integer(10000000000, 99999999999).toString()
    })
  }

  return Vip
}

export function getSuppliers (num = 5): Supplier[] {
  const suppliers: Supplier[] = []

  for (let i = 0; i < num; i++) {
    suppliers.push({
      id: Random.id(),
      name: Random.cword(),
      address: Random.csentence(15, 30),
      email: Random.email(),
      phone: Random.integer(10000000000, 99999999999).toString()
    })
  }
  return suppliers
}
