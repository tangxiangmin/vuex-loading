

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