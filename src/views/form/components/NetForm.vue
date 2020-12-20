<template>
    <el-form
        ref="form"
        :model="form"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <template
            v-for="({formItem, createElement, element, attrs, methods, change, focus, options, controlled, field}, index) in list"
            :key="field.name+index"
        >
            <Customer
                element="el-form-item"
                :prop="field.name"
                :controlled="true"
                v-bind="formItem"
            >
                <Customer
                    v-slot:children
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
            </Customer>
        </template>
        <slot name="button" :handleSubmit="handleSubmit"></slot>
    </el-form>
</template>
<script>
import Customer from './Customer.js' //函数式组件实现自定义组件
import { watch, ref } from 'vue'
function isPromise(p) {
  return typeof p === 'object' && typeof p.then === 'function' && typeof p.catch === 'function'
}

function dataType(type) {
    switch (true) {
        case type === 'object':
            return {}
        case type === 'array':
            return []
        case type === 'string':
            return ''
    }
}
export default {
    name: 'NetForm',
    provide() {
        return {
            currentInstance: this.$parent
        }
    },
    components: { Customer },
    props: {
        elements: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            form: {},
            list: [],
            asyncOptions: {},
            callbacksMap:{},
            callbacksQueue: []
        }
    },
    created() {

        watch(this.callbacksQueue, (Queue, prevCount) => {
            console.log('watch')
            if (Queue.length === 0) return// 防止死循环
            for (const { field, async } of Queue) {
                if (!async || field.name in this.asyncOptions) continue// 如果之前请求了，使用缓存，不再次请求
                this.matchCallback(field.name)('async')
            }
            this.$nextTick(() => {
                this.callbacksQueue = ref([]).value
            })
        })
        function initData({ name, type }) {
            if (!name) {
                console.error(`组件name属性为 ${name}`)
                return false
            }
            let i = 0
            let obj = this.form
            const keys = name.split('.')
            const length = keys.length

            while (i < length - 1) {
                obj = obj[keys[i]] = {}
                i--
            }
            obj[keys[length - 1]] = dataType(type)
            return true
        }
        // 把标记权限验证的数据（如：身份不是管理员等）进行处理
        this.list = Object.freeze(this.elements.filter(({ field, async, callback, permission }) => {
            this.collectCallbackToMap({field, callback})
            this.callbacksQueue.push({field, async})
            console.log('collect')
            return (permission
                ? (typeof permission === 'function'
                    ? permission() : permission)
                : true) && initData.call(this, field)
        }))
    },
    methods: {
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        handleSubmit() {
            let result = [];
            this.$refs.form.validate(isPass => {
               result = [isPass, { ...this.form }]
            })
            this.callbacksQueue.push({a: 'fuck'})
            console.log('handleSubmit')
            return result
        },
        expression(express) {
            return express && new Function(`
                with(this.form) {
                    return ${express}
                }
           `).call(this)
        },
        attrsConvert: (attrs) => {

            const newAttrs = {}

            if (!attrs) return newAttrs

            const keys = Object.keys(attrs)

            for (let i = 0; i < keys.length; i++) {

              const key = keys[i]

              if (typeof attrs[key] === 'function') {

                newAttrs[key] = attrs[key]()

              } else {

                newAttrs[key] = attrs[key]

              }
            }
            return newAttrs
        },

        collectCallbackToMap({ field, callback }) {
            if (!callback) return
            this.callbacksMap[field.name] = (...params) => callback(...params, key => (...params) => this.matchCallback(key)(...params), { ...this.form })
        },

        matchCallback(key) {
            return async (sign) => {
                const result = this.callbacksMap[key] && this.callbacksMap[key](sign)
                console.log('callfuck', key, this.callbacksMap[key])
                if (isPromise(result)) {
                  const data = await result
                  this.asyncOptions[key] = data
                    return data
                } else {
                    this.asyncOptions[key] = result
                    return result
                }
                return []
            }
        }
    }
}
</script>

