<template>
    <net-form ref="from" name="form" :elements="components" label-width="100px">
        <template v-slot:button="{handleSubmit}">
          <el-button @click="valid(handleSubmit)">提交</el-button>
          <el-button @click="doCount">{{ index }}</el-button>
       </template>
    </net-form>
</template>

<script>
import NetForm, { freeze } from "./index"
import { resolveComponent, h, watch, computed } from 'vue'
export default {
  name: 'demo',
  data() {
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
    const id =  {
        field: {name: 'id', type: 'string'},
        formItem: {label: '实例ID'},
        element: 'el-input',
        controlled: 'isOpen'
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
          type: 'array'
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
      console.log('fuck11')
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
    return {
        foo: '',
      components: freeze([project, dc_code1, dc_code2, id, isOpen, use_case, status, customer, callback]),
    }
  },

  components: {
      NetForm
  },
    watch: {
        index(val) {
            //不会执行，不推荐
            console.log(val,'shit')
        }
    },
    // computed: {
    //   index1() {
    //       //不会执行，但是计算属性还是能计算，不推荐
    //       console.log('计算')
    //       return this.index
    //   }
    // },

    created() {
        watch(this.index, function (count, prevCount) {
            console.log(prevCount)
            console.log('执行了')
        })
        computed(() => {
            console.log('计算')
            return this.index
        })
      },
    methods: {
      valid(handleSubmit) {
        const [isPass, fields] = handleSubmit()
        console.log(isPass, fields)
      },
      doCount() {
          for (let i = 0;i < 100;i++) {
              this.index.push(i)
              console.log(i)
          }
      }
  }
}
</script>
<style>
    div, input, select {
        margin: 0;
        padding: 0;
    }
</style>

