# 动态表单组件

## 介绍

动态组件是基于Vue3 和 element-plus的。基于vue2的代码，使用vue3的compositionAPI重构出来的。


## 设计思路

动态表单组件，很容易知道，表单里的小组件是根据动态配置参数生成。那到底是什么做到的？思路很简单，是这样的： 设计一个动态组件，可以根据动态配置参数生成对应的组件，如，el-input组件、el-select组件。而且设计的动态组件是完全可控的，而vue现有的component不可控的。
example:
```template
<template>
    <Customer element="el-input" />
</template>
```

## 设计动态组件
动态组件选用函数式组件进行设计，vue3的函数式组件和vue2的不一样。<a href="#">动态组件</a>

配置参数:

name | introduction  
- | -
element       | 标签名，如div，p，el-input等
options       | 用于el-select组件生成选项，不是select组件可以忽略不写
attrs         | 动态组件的属性，相当于props或vue2的$attrs属性
methods       | 事件处理程序，用于传入自定义事件，用于在组件内部调用$emit
createElement | 相当于render函数，直接返回vnode就可渲染组件，其余参数不用写，因为它的执行优先级最高


### Compiles and hot-reloads for development
```
yarn serve
```

参考资料：<https://sunnychenglang.com/sidebar/vue/vue3.0/Vue3%E9%87%87%E5%9D%91%E7%AC%94%E8%AE%B0.html>
