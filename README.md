# 🎉🎉动态表单组件（文章最后一处有彩蛋）

## 介绍

动态组件是基于Vue3 和 <a href="https://github.com/element-plus/element-plus">element-plus组件库</a>.

## 设计思路

动态表单组件，很容易知道，表单里的小组件是根据动态配置参数生成。那到底是什么做到的？思路很简单，是这样的： 设计一个动态组件，可以根据动态配置参数(传入组件名称)生成对应的组件，如，el-input组件、el-select组件。而且设计的动态组件是完全可控的，而vue现有的component不可控的。

### example

```template
<template>
    <Customer element="el-input" />
</template>
```

## 设计动态组件
动态组件选用函数式组件进行设计，vue3的函数式组件和vue2的不一样。<a href="https://github.com/JhonLandy/FormComponent/blob/master/src/views/components/Customer.js" target="_blank">动态组件</a>
### 原理
关键是函数式组件。没有额外的生命周期,钩子函数，this等，占用内存少，性能好，直接渲染。vue3和vue2的函数式组件是有差别的，简单介绍一下：

<strong>🚀vue2:</strong>
```js
export default {

    functional: true,

    inject: ['currentInstance'],

    props: {
        element: {
            required: true,
            type: [String, Array],
            default: ''
        }
    }
    ...
}
```
<strong>🚀vue3:</strong>
<br/>
vue3里的函数式组件,是直接写一个函数返回，props直接在函数（函数也是object）上定义，也不用额外写<code>functional: true</code>配置。
```js
export default function Customer(props, context) {
    //...
}
Customer.props = {
    element: {
        required: true,
        type: [String, Array],
        default: ''
    }
    ...
}
```
函数式组件详细配置请看这里：<a href="https://github.com/JhonLandy/WriteVueOriginalCode/blob/master/src/view/form/components/Customer.js">vue2版</a> 和 <a href="https://github.com/JhonLandy/FormComponent/blob/master/src/views/components/Customer.js">vue3版</a>。好了，介绍到这里，下面重点介绍：

先导入几个重要的函数。
```js
import { h, resolveComponent, inject } from 'vue'
```
h是用来产生虚拟dom，resolveComponent是获取组件vnode，inject就是获取跨组件的数据。下面重要部分来了：
```js
function Customer(props, context) {
    const { element, options, methods, createElement, controlled, attrs, ...other } = props
    const { slots } = context
    ...
    const compose  =
        options //根据options选项来选择模式
            ? composeOptions.bind(null, element, attrs, methods, options, index + 1)
            : composeElements.bind(null, element, attrs, methods, index + 1)
    return h(resolveComponent(_element), { ...other, ..._attrs, ...mapMethods.call(null, _methods) }, slots.default || compose())
}
Customer.props = {
  ...
}
export default Customer
```
首先，通过函数props获取外面挂载的属性：element, options, methods, createElement, controlled, attrs。context指的是上下文，可以获取slots等相关属性。<code>compose()</code>是一个用于递归遍历的子元素标签生成虚拟dom（逻辑有点绕，不要嫌弃，就是递归的逻辑😩）， <code>slots.default</code>就是插槽内容。（<code>slots.default()</code>效果一样）实现原理大概就是这样啦！！
### 配置参数

name | introduction  
:--|:--
element       | 标签名，如div，p，el-input等
options       | 用于el-select组件生成选项，不是select组件可以忽略不写
attrs         | 动态组件的属性，相当于props或vue2的$attrs属性
methods       | 事件处理程序，用于传入自定义事件，用于在组件内部调用$emit
createElement | 相当于render函数，直接返回vnode就可渲染组件，其余参数不用写，因为它的执行优先级最高


## FormComponent
FormComponent组件（动态表单组件）是基于动态组件（Customer组件）构建的，Customer组件用于渲染表单。想使用<a href="https://github.com/vuejs/jsx-next" target="_blank">jsx语法</a>，直接调用createElement方法。<a href="https://github.com/JhonLandy/FormComponent/blob/master/src/views/components/NetForm.vue" target="_blank">动态表单组件</a>和<a href="https://github.com/JhonLandy/FormComponent/blob/master/src/views/Vue3Compoent/index.vue" target="_blank">demo.vue</a>。下面看看是怎么基于动态组件（Customer组件）实现动态表单组件：
### template:
这里定义咱们写好的<code>Customer</code>动态组件。vue3在template使用上和原来的一样，基本没啥太大变化。
```html
<template>
    ....            
    <Customer
        size="small"
        :element="element"
        v-model="form[field.name]"
        :options="asyncOptions[field.name] || options"
        @change="change && matchCallback(field.name)('change')"
        @focus="focus && matchCallback(field.name)('focus')"
        :methods="methods"
        :createElement="createElement"
        :attrs="attrs"
    />
    ...
</template>
```
### script:
在这里我们定义相关逻辑，做一些数据操作，如获取props、代理数据等。在这里vue3使用和vue2就有区别了。vue2的都是OptionAPI,又长又臭，关系不清晰，代码逻辑不能复用，不利于维护。现在vue3建议使用compostionAPI（当然也可以用原来的方式，好像会有坑），这里直接一个setup函数（this为undefind），相当于调用了beforeCreate,Created钩子，最后return 相关变量、方法，以便在templat中使用。
```js
import Customer from './Customer.js' //函数式组件实现自定义组件
import { watch, ref, nextTick, reactive, toRefs, provide } from 'vue'
export default {
    //...
    setup(props, context) {
        const { elements } = props
        const state = reactive({
            form: {},
            list: [],
            asyncOptions: {},
            callbacksMap:{},
            callbacksQueue: []
        })
        const formRef = ref(null)
        //...
        return {
            ...toRefs(state),
            resetForm,
            handleSubmit,
            matchCallback,
            attrsConvert,
            expression,
            list: [...list],
            formRef
        }
    }
}
```
### 配置参数

name | introduction  
:--|:--
element       | 标签名，如div，p，el-input等
options       | 用于el-select组件生成选项，不是select组件可以忽略不写
attrs         | 动态组件的属性，相当于props或vue2的$attrs属性
methods       | 事件处理程序，用于传入自定义事件，用于在组件内部调用$emit
createElement | 相当于render函数，直接返回vnode就可渲染组件，其余参数不用写，因为它的执行优先级最高
formItem      | 动态表单中有el-form-item组件生成，这里动态配置它的参数
field         | 用于动态生成表单组件内部的参数，每个参数指的表单里的组件对应的v-model。执行表单提交时可获取对应的值。
permission    | 用于权限认证
callback      | 用于给el-select组件异步请求获取数据
focus         | true,表示focus时执行callback函数
change        | true,表示change时执行callback函数
async         | true,表示开启初始化执行callback函数

### element
```js
//第一种方式
element: ['el-select', 'el-option']

//第二种方式
element: [ 'el-select', [
      ['el-option-group',
        ['el-option']//这数组存放el-option-group子节点el-option，多个的话就在数组写多个
      ],
      ['el-option-group',
        ['el-option']//这数组存放el-option-group子节点el-option，多个的话就在数组写多个
      ]
    ],
  ],
```

### formItem
定义el-form-item属性
```js
formItem: {
    label: '项目',
    rules: [
      {required: true, message: '请输入活动名称', trigger: 'blur'},
      {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
    ]
}
```

### field
定义数据类型和key
```js
 field: {
    name: 'project', // 组件内部动态参数的key
    type: 'string' // 定义数据类型
}
```

### permission
控制是否要显示
```js
permission: () => {
    if(isAdmin) {
        return true
    } else {
        return false
    }
}
```

### methods
配置Customer组件的事件
```js
 methods: {
    change: () => {
      console.log(this)
    }
}
```
### attrs
配置Customer组件props属性
```js
attrs: [
    {
        multiple: true, 
        filterable: true
    }
],
```

### callback(sign, next, param)
<code>sign:</code>参数值有async/focus/change/remote, 表示在不同事件处理程序下执行<br/>
<code>next:</code>可以执行其他组件的callback函数，实现联动，如next('project')('async')()<br/>
<code>param:</code>获取全部参数
```js
callback: (sign, next, param) => {
    return new Promise((resolve) => { 
        resolve(data)
    })
}
```

### createElement
和render函数用法是一样的，直接返回虚拟dom。
```js
createElement() {//这样直接写jsx也可以
    return (
        <el-radio-group>
            <el-radio-button value="1" label="自定义组件122"></el-radio-button>
            <el-radio-button value="2" label="自定义组件222"></el-radio-button>             
        </el-radio-group>
    )
}
```

### 使用例子
```js
<template>
    <net-form ref="from" name="form" :elements="components" label-width="100px">
        <template v-slot:button="{handleSubmit}">
          <el-button @click="valid(handleSubmit)">提交</el-button>
          <el-button @click="doCount">{{ index }}</el-button>
       </template>
    </net-form>
</template>
```
```js
import NetForm from "./index"
import { project, use_case, customer } from '../components/config.js'
export default {
    name: 'demo',
    components: { NetForm },
    setup() {
        const valid = handleSubmit => {
            const [isPass, fields] = handleSubmit()
        }
        const customer2 = {
             formItem: {
                 label: '自定义组件',
                 rules: {required: true, message: '请选择时间', trigger: 'change'}
            },
            field: {
                name: 'customer',
                type: 'string'
            },
            createElement() {//这样直接写jsx也可以
                return (
                    <el-radio-group>
                        <el-radio-button value="1" label="自定义组件122"></el-radio-button>
                        <el-radio-button value="2" label="自定义组件222"></el-radio-button>
                    </el-radio-group>
                )
            }
        }
        return {
            valid,
            components: [project, use_case, customer, customer2]
        }
    }
}
```
### 配置组件
```js
// config.js
import { h, resolveComponent } from 'vue'
const project =  {
    field: {
        name: 'project',
        type: 'string'
    },
    formItem: {
        label: '项目',
        rules: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ]
    },
    element: ['el-select', 'el-option'],
    attrs: [{multiple: true, filterable: true}],
    options: [
        { label: '大湾区', value: 0 },
        { label: '海珠区', value: 1 },
    ],
    permission: () => {
        return true
    }
}
const isOpen = {
    field: {
        name: 'isOpen',
        type: 'string'
    },
    element: 'el-switch',
    formItem: { label: '控制实例ID'},
    methods: {
        change: () => {
          console.log(this)
        }
    }
}

const customer = {
  formItem: {
    label: '自定义组件',
    rules: {required: true, message: '请选择时间', trigger: 'change'}
  },
  field: {
    name: 'customer',
    type: 'string'
  },
  createElement() {
    return h(resolveComponent('el-radio-group'), {
          size: 'small'
    },
    [
        h(resolveComponent('el-radio-button'), {
              value: '1',
              label: '自定义组件1'
        }),
        h(resolveComponent('el-radio-button'), {
              value: '2',
              label: '自定义组件2'
        })
    ]
    )
  }
}

```
### 总结
我也在这里做了一些总结，关于Vue3和Vue2的差异，<a href="https://sunnychenglang.com/sidebar/vue/vue3.0/Vue3%E9%87%87%E5%9D%91%E7%AC%94%E8%AE%B0.html" target="_blank">点击友情链接</a>。欢迎指正！！！🌹🌹
