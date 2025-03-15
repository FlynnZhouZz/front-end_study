# Vue面试

## vue3.5版本更新了什么

1、响应式属性解构
> 以前defineProps解构出来的值并不是响应式，需要通过toRef这种工具来变成响应式，现在vue3.5更新了这方面的不足，现在可以直接从defineProps解构出来的值就是响应式的了。

2、新增useId()
> useId() 是一个 API，用于生成在服务器和客户端渲染之间保持稳定的唯一应用程序 ID。这些 ID 可用于生成表单元素和无障碍属性的 ID，并且可以在 SSR 应用程序中使用而不会导致水化不匹配

3、新增onEffectCleanup函数
> 在组件卸载之前或者下一次watchEffect回调执行之前会自动调用onEffectCleanup函数，有了这个函数后你就不需要在组件的beforeUnmount钩子函数去统一清理一些timer了。

4、新增base watch函数

5、新增onWatcherCleanup函数
> 在组件卸载之前或者下一次watch回调执行之前会自动调用onWatcherCleanup函数，同样有了这个函数后你就不需要在组件的beforeUnmount钩子函数去统一清理一些timer了

6、新增pause和resume方法
> 有的场景中我们可能想在“一段时间中暂停一下”，不去执行watch或者watchEffect中的回调。等业务条件满足后再去恢复执行watch或者watchEffect中的回调。在这种场景中pause和resume方法就能派上用场啦。

7、watch的deep选项支持传入数字
> 在以前deep选项的值要么是false，要么是true，表明是否深度监听一个对象。在3.5中deep选项支持传入数字了，表明监控对象的深度。

### SSR服务端渲染
1、useTemplateRef()
> 以前我们在获取dom元素都是用的ref属性，现在官方引出来这个函数来操作我们的dom

2、Lazy Hydration  懒加载水合
> 异步组件现在可以通过 defineAsyncComponent() API 的 hydrate 选项来控制何时进行水合。（普通开发者用不上）

3、data-allow-mismatch
> SSR中有的时候确实在服务端和客户端生成的html不一致，比如在DOM上面渲染当前时间，这种情况是避免不了会出现前面useId例子中的那种警告，此时我们可以使用data-allow-mismatch属性来干掉警告

5、Teleport组件新增defer延迟属性
> Teleport组件的作用是将children中的内容传送到指定的位置去

4、内存改进（优化了响应速度）
> 实际上，Vue 团队特别优化了许多常见的数组方法，使得遍历数组的速度提高了很多，渲染速度变快了。