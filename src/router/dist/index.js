"use strict";
exports.__esModule = true;
var vue_router_1 = require("vue-router");
var routes = [
    {
        path: '/Vue2Compoent',
        name: 'Vue2Compoent',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: function () { return Promise.resolve().then(function () { return require(/* webpackChunkName: "about" */ '../views/Vue2Compoent/index.vue'); }); }
    },
    {
        path: '/Vue3Compoent',
        name: 'Vue3Compoent',
        component: function () { return Promise.resolve().then(function () { return require(/* webpackChunkName: "about" */ '../views/Vue3Compoent/index.vue'); }); }
    }
];
var router = vue_router_1.createRouter({
    history: vue_router_1.createWebHistory(process.env.BASE_URL),
    routes: routes
});
exports["default"] = router;
