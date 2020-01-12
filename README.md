vuex-loading
===

## 背景
为了判断异步操作是否在运行中，往往通过额外的标志量来区分；
```js
function fetchList(){
  if(this.isFetchList) return // 避免重复请求
  this.isFetchList = true
  fetchListApi().then((res)=>{
    // do res
  }).finally(()=>{
    this.isFetchList = false // 重置状态
  })
}
```
当需要判断的操作过多时，需要花费大量的精力来维护这些状态。

`vuex-loading`插件主要用于解决该问题，灵感来源[`dva-loading`](https://github.com/dvajs/dva/tree/master/packages/dva-loading)。

## 使用说明

### 开发环境
```bash
# 项目依赖
npm i
# demo开发环境
cd demo
npm i && npm run dev
# 项目打包 
npm run build
```

### 安装
```bash
npm i https://github.com/tangxiangmin/vuex-loading
```

### 基本使用
```js
// list.js
export default {
    namespaced: true,
    state: {
        list: [1,2,3]
    },
    mutations: {
        updateList(state, list){
            state.list = list
        }
    },
    actions: {
        fetchList({commit, state}, payload){
            // 返回一个promise
            return new Promise((resolve)=>{
                setTimeout(()=>{
                    commit('updateList', [...state.list, Math.random()])
                    resolve(true)
                },500)
            })

        }
    }
}

// store.js
import createVuexLoading from "vuex-loading";
const vuexLoadingConfig = {}
const vuexLoading = createVuexLoading(vuexLoadingConfig)

const store = new Vuex.Store({
    modules: {
        list
    },
    plugins: [vuexLoading]
})
```

在视图文件中
```vue
<template>
    <div>
        <ul>
            <li v-for="item in list" :key="item">{{item}}</li>
        </ul>
        <button @click="fetchList" :disabled="isLoadingList">{{ isLoadingList ? 'fetchList loding': 'fetchList'}}
        </button>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    export default {
        name: 'app',
        computed: {
            ...mapState({
                // 插件会注入一个loading的module，通过state.loading[actionKey]的形式判断对应action是否在执行中
                isLoadingList: (state) => state.loading['list/fetchList'],
                list: (state) => state.list.list
            })
        },
        methods: {
            fetchList() {
                this.$store.dispatch('list/fetchList')
            }
        }
    }
</script>
```

### vuexLoadingConfig

其中`vuexLoadingConfig`为插件构造配置项，目前支持
```js
const defaultConfig = {
    // loading模块的名称，使用方式：this.$store.state[loadingModuleName]
    loadingModuleName: 'loading',
    // 当前触发的action名字，context与payload同原始的dispatch参数
    // 在当前action执行前调用
    before(key, context, payload) {},
    // 在当前action执行后调用
    after() {}
}
```

## TODO

* [ ] 增加常用的逻辑处理API，如接口节流等
* [ ] 增加测试用例