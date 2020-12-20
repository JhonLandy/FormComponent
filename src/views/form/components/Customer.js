import { h, resolveComponent } from 'vue'

function mapMethods(methods) {
    if (!methods) return
    const _methods = {}
    const keys = Object.keys(methods)
    for (let i = 0;i< keys.length;i++) {
        const key = keys[i]
        _methods[key] = methods[key].bind(this)
    }
    return _methods
}

const adapter = (value, index) => value ? isArray(value) ? value[index]  : value  : []

const adapterMaster = (elements, attrs, methods, index) =>  [adapter(elements, index), adapter(attrs, index), adapter(methods, index)]

function composeOptions(elements, attrs, methods, options, index) {//用于options写法

    const [_element, _attrs, _methods] = adapterMaster(elements, attrs, methods, index)
    if (!_element || !options) return
    return options.map(({
        label, 
        value, 
        options: _options
    }) => h(
        resolveComponent(_element),
        {..._attrs, label, value, ...mapMethods.call(this, _methods)},
        composeOptions(elements, attrs, methods, _options, index + 1)
    ))
}

function composeElements(elements, attrs, methods, index) {//用于数组内嵌数组写法

    const [_element, _attrs, _methods] = adapterMaster(elements, attrs, methods, index)

    if (!_element) return

    if (isArray(_element)) {//判断孩子层级是否有多元素组合在一起
        return _element.map((_$element, _$index) => composeElements(_$element, _attrs[_$index],  _methods[_$index], 0))
    } else {
        return h(
            resolveComponent(_element),
            {..._attrs, ...mapMethods.call(this, _methods)},
            isArray(elements) //是数组的话说明他有孩子，继续递归；没有孩子就给 void 0(undefind)
            ? composeElements(elements, attrs, methods, index + 1)
            : void 0
        )
    }
}

function Error(element, msg) {
    const error = console.error
    error(`警告：${element}元素${msg}`)
}

function isArray(value) {
    return Array.isArray(value)
}
function Customer(props, context) {
    const { element, options, methods, createElement, controlled, currentInstance, attrs, ...other } = props
    const { slots } = context
    if (!controlled) return//是否显示
    const _this = currentInstance
    if (createElement) {//自定义组件的话直接返回vnode
        return createElement.call(_this)
    }
    if (!element) return//元素标签不能为空
    const index = 0//用于同层获取属性，0表示第一层
    const [_element, _attrs, _methods] = adapterMaster(element, attrs, methods, index)

    if (isArray(_element)) {//顶层元素不能嵌套子元素，没意义。
        Error(_element, '第一个元素不能为数组！')
        return
    }
    const compose  =
        options //根据options选项来选择模式
            ? composeOptions.bind(_this, element, attrs, methods, options, index + 1)
            : composeElements.bind(_this, element, attrs, methods, index + 1)
    return h(resolveComponent(_element), { ...other, ..._attrs, ...mapMethods.call(_this, _methods)}, slots.default || compose())
}
Customer.props = {
    element: {
        required: true,
        type: [String, Array],
        default: ''
    },
    options: {
        type: [Array],
        default: void 0
    },
    controlled: {
        type: Boolean,
        default: true
    },
    attrs: {
        type: [Object, Array],
        default:() => {}
    },
    methods: {
        type: [Object, Array],
        default:() => {}
    },
    createElement: {
        type: Function,
        default: null
    }
}
export default Customer

