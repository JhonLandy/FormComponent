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

