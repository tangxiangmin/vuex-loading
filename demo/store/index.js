import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import list from './module/list'


import createVuexLoading from "../../src";
const vuexLoading = createVuexLoading()

const store = new Vuex.Store({
    modules: {
        list
    },
    plugins: [vuexLoading]
})

export default store
