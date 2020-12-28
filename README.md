# 动态表单组件

## 介绍

动态组件是基于Vue3 和 element-plus的。基于vue2的代码，使用vue3的compositionAPI重构出来的。只要简单传入配置参数，就可以可以使用表单，提高开发效率。


## 设计思路

动态表单组件，很容易知道，表单里的小组件是根据动态配置参数生成。那到底是什么做到的？思路很简单，是这样的： 设计一个动态组件，可以根据动态配置参数生成对应的组件，如，el-input组件、el-select组件。而且设计的动态组件是完全可控的，而vue现有的component不可控的。

### example

```template
<template>
    <Customer element="el-input" />
</template>
```

## 设计动态组件
动态组件选用函数式组件进行设计，vue3的函数式组件和vue2的不一样。<a href="/FormComponent/blob/master/src/views/component/Customer.js">动态组件</a>

### 配置参数

name | introduction  
-|-
element       | 标签名，如div，p，el-input等
options       | 用于el-select组件生成选项，不是select组件可以忽略不写
attrs         | 动态组件的属性，相当于props或vue2的$attrs属性
methods       | 事件处理程序，用于传入自定义事件，用于在组件内部调用$emit
createElement | 相当于render函数，直接返回vnode就可渲染组件，其余参数不用写，因为它的执行优先级最高


## FormComponent
FormComponent组件（动态表单组件）是基于动态组件（Customer组件）构建的，Customer组件用于渲染表单。下面是调用方法，想使用jsx语法，直接调用createElement方法。<a href="/FormComponent/blob/master/src/views/Vue3Compoent/index.vue">动态表单组件</a>
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
        // const customer2 = {
        //     formItem: {
        //         label: '自定义组件',
        //         rules: {required: true, message: '请选择时间', trigger: 'change'}
        //     },
        //     field: {
        //         name: 'customer',
        //         type: 'string'
        //     },
        //     createElement() {//这样直接写jsx也可以
        //         return (
        //             <el-radio-group>
        //                 <el-radio-button value="1" label="自定义组件122"></el-radio-button>
        //                 <el-radio-button value="2" label="自定义组件222"></el-radio-button>
        //             </el-radio-group>
        //         )
        //     }
        // }
        return {
            valid,
            components: [project, use_case, customer, customer2]
        }
    }
}
```

### 配置参数

name | introduction  
-|-
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


- element

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

- formItem

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

- field

定义数据类型和key
```js
 field: {
    name: 'project', // 组件内部动态参数的key
    type: 'string' // 定义数据类型
}
```

- permission

控制是否要显示
```js
permission: () => {
    if(isAfmin) {
        return true
    } else {
        return false
    }
}
```

- methods

配置Customer组件的事件
```js
 methods: {
    change: () => {
      console.log(this)
    }
}
```
- attrs

配置Customer组件props属性
```js
attrs: [
    {
        multiple: true, 
        filterable: true
    }
],
```

- callback(sign, next, param)
<code>sign</code>
<code>next:</code>可以执行其他组价的callback函数，实现联动，如next('project')('async')()
<code>param:</code>获取全部参数
```js
callback: (sign, next, param) => {
    return new Promise((resolve) => { 
        resolve(data)
    })
}
```

### 完整用例
```js
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
const dc_code1 =  {
  formItem: {
      label: '模式一',
      rules: {required: true, message: '请选择活动区域', trigger: 'change'}
  },
  field: {
      name: 'dc_code1',
      type: 'array'
  },
  //第一种方式
  element: [
    'el-select',
    [
      ['el-option-group',
        ['el-option']//这数组存放el-option-group子节点el-option，多个的话就在数组写多个
      ],
      ['el-option-group',
        ['el-option']//这数组存放el-option-group子节点el-option，多个的话就在数组写多个
      ]
    ],
  ],
  attrs: [//和element格式一一对应
    {multiple: true, filterable: true},
    [
      [{label: '广东11'},  [{label: 'guangdong', value: '0'}]],
      [{label: '北京11'},  [{label: 'beijing',   value: '1'}]]
    ]
  ]

}
const dc_code2 = {
    formItem: {
      label: '模式二',
      rules: {required: true, message: '请选择活动区域', trigger: 'change'}
    },
    field: {
      name: 'dc_code2',
      type: 'string'
    },
    element: [//数组内不能写数组
    'el-select',
    'el-option-group', //el-select子节点，根据options的数据生成对应数量
    'el-option'    //el-option-group子节点，根据options的数据生成对应数量
    ],//用于option所选项
    options: [//这种方式也可以
      {
        label: '广东',
        options:[
          {
            label: 'guangdong',
            value: '0'
          }
        ]
      },
      {
        label: '北京',
        options:[
          {
            label: 'beijing',
            value: '1'
          }
        ]
      }
    ]
}

const use_case = {
  element: ['el-radio-group','el-radio-button'],
  field: {
    name: 'use_case',
    type: 'string'
  },
  methods: [{
    change: () => {
      console.log('开光')
    }
  }, {
    change: () => {
      console.log('开光')
    }
  }],
  formItem: {
    label: '用途',
    rules: {required: true, message: '请选择时间', trigger: 'change'}
  },
  options: [
    {
        value: '1',
        label: '正式'
    },
    {
        value: '2',
        label: '测试'
  }]
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

const status =  {
  field: {
      name: 'status',
      type: 'string'
  },
  formItem: {
    label: '状态',
    rules: {required: true, message: '请至少选择一个活动性质', trigger: 'change'}
  },
  element: ['el-radio-group', ['el-radio-button', 'el-radio-button']],
  controlled: 'isOpen',
  attrs: [
    {},
    [{
      value: '3',
      label: 'RUNNING'
    },
    {
      value: '4',
      label: 'PENDING'
    }]
  ]
}

const callback = {
  field: {
      name: 'callback',
      type: 'string'
  },
  formItem: {
    label: '回调函数',
    rules: {required: true, message: '请至少选择一个活动性质', trigger: 'change'}
  },
  element: ['el-select', 'el-option-group', 'el-option'],
  // focus: true,//表示focus时执行callback函数
  // change: true,//表示change时执行callback函数
  async:true,//表示开启初始化执行callback函数
  callback: (sign, c, d) => {
    return new Promise((resolve) => {
      resolve([
        {
          label: '广东22',
          options:[
            {
              label: 'guangdong',
              value: '0'
            }
          ]
        },
        {
          label: '北京33',
          options:[
            {
              label: 'beijing',
              value: '1'
            }
          ]
        }
      ])
    })
  }
}

```
## Vue3和Vue2的差异
我也在自己的博客做了一些总结，链接：<https://sunnychenglang.com/sidebar/vue/vue3.0/Vue3%E9%87%87%E5%9D%91%E7%AC%94%E8%AE%B0.html>。欢迎指正
