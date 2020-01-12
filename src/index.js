
import Vue from 'vue'
const LOADING_NAME = 'loading'
const LOADING_START = 'startLoading'
const LOADING_END = 'endLoading'

// 默认配置
const defaultConfig = {
    // loading模块的名称，使用方式：this.$store.state[loadingModuleName]
    loadingModuleName: LOADING_NAME,
    // 当前触发的action名字，context与payload同原始的dispatch参数
    // 在当前action执行前调用
    before(key, context, payload) {},
    // 在当前action执行后调用
    after() {}
}

// loading模块
const createLoadingModule = () => {
    return {
        namespaced: true,
        state: {},
        mutations: {
            [LOADING_START](state, key) {
                Vue.set(state, key, true) // 动态添加state
            },
            [LOADING_END](state, key) {
                Vue.set(state, key, false)
            }
        },
    }
}

const createVuexLoading = (config) => (store) => {
    config = Object.assign(defaultConfig, config)

    // 注册loadingModule
    const loadingModule = createLoadingModule()
    const {loadingModuleName} = config
    store.registerModule(loadingModuleName, loadingModule)

    // 开始和结束的钩子
    const hooks = {
        before(key, context, payload) {
            config.before(key, context, payload)
            store.commit(`${loadingModuleName}/${LOADING_START}`, key)
        },
        after(key, context, payload) {
            store.commit(`${loadingModuleName}/${LOADING_END}`, key)
            config.after(key, context, payload)
        }
    }

    // 劫持所有的action，需要注意只有返回promise的action会正常触发loading监听
    const {_actions} = store
    Object.keys(_actions).forEach(key => {
        _actions[key] = _actions[key].map(action => {
            return async (context, payload) => {
                hooks.before(key, context, payload)
                try {
                    await action(context, payload)
                } catch (e) {
                    console.log(e)
                } finally {
                    hooks.after(key, context, payload)
                }
            }
        })
    })
}

export default createVuexLoading