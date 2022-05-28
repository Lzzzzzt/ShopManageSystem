import { customRef } from 'vue'
// 自定义一个ref
export default function (value: any) {
  let timer: NodeJS.Timeout
  return customRef((track, trigger) => {
    // 调track决定什么时候收集我们的依赖
    // 调trigger决定什么时候触发我们的依赖来进行更新
    return {
      get () {
        // 拿到message意味着调用了一次getter
        // 一旦调用了get我们就收集一下依赖(即拿到value)
        track()// 收集依赖函数
        return value// 展示我们的value
      },
      set (newValue) {
        // 调用newValue的时候，一般是传进来了一个新的值
        // value = newValue;//把我们的新值赋值过来
        // trigger();//所有的依赖发生更新

        //* ****************************** */
        // 想在更新的时候延迟操作，意味着debounce防抖
        clearTimeout(timer)
        timer = setTimeout(() => {
          value = newValue
          trigger()
        }, 100)
      }
    }
  })
}
