<template>
    <net-form :elements="components" label-width="100px">
    </net-form>
</template>

<script>
import NetForm from "./index"
import { project, use_case, customer, callback, dc_code2, dc_code1, isOpen, id, status } from './components/config'
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
            components: [project, dc_code1, dc_code2, id, isOpen, use_case, status, customer, callback]
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

