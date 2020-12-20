<template>
    <el-form
        ref="formRef"
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
import { watch, ref, nextTick, reactive, toRefs, provide } from 'vue'
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
    components: { Customer },
    props: {
        elements: {
            type: Array,
            default: () => []
        }
    },
    setup({ elements }) {
        // provide('currentInstance', 'kao')
        const state = reactive({
            form: {},
            list: [],
            asyncOptions: {},
            callbacksMap:{},
            callbacksQueue: []
        })
        const formRef = ref(null)
        const resetForm = (formName) => {
            formRef.value.resetFields()
        }
        const handleSubmit = () => {
            let result = [];
            formRef.value.validate(isPass => {
               result = [isPass, { ...state.form }]
            })
            state.callbacksQueue.push(1)
            return result
        }
        const expression = (express) => {
            return express && new Function(`
                with(this.form) {
                    return ${express}
                }
           `).call(state)
        }
        const attrsConvert = (attrs) => {
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
        }
        const collectCallbackToMap = ({ field, callback }) => {
            if (!callback) return
            state.callbacksMap[field.name] = (...params) => callback(...params, key => (...params) => matchCallback(key)(...params), { ...state.form })
        }
        const matchCallback = (key) => {
            return async (sign) => {
                const result = state.callbacksMap[key] && state.callbacksMap[key](sign)
                if (isPromise(result)) {
                  const data = await result
                  state.asyncOptions[key] = data
                    return data
                } else {
                    state.asyncOptions[key] = result
                    return result
                }
                return []
            }
        }
        watch(state.callbacksQueue, (Queue, prevCount) => {
            if (Queue.length === 0) return// 防止死循环
            for (const { field, async } of Queue) {
                if (!async || field.name in state.asyncOptions) continue// 如果之前请求了，使用缓存，不再次请求
                matchCallback(field.name)('async')
            }
            nextTick(() => {
                //state.callbacksQueue = [] 千万别这么干，会失去数据响应！！！
                state.callbacksQueue.splice(0, state.callbacksQueue.length)
            })
        })
        function initData(field) {
            const { name, type } = field
            if (!name) {
                console.error(`组件name属性为 ${name}`)
                return false
            }
            let i = 0
            let obj = state.form
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
        const list = elements.filter(({ field, async, callback, permission }) => {
            collectCallbackToMap({field, callback})
            state.callbacksQueue.push({field, async})
            return (permission
                ? (typeof permission === 'function'
                    ? permission() : permission)
                : true) && initData.call(state, field)
        })
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
</script>

