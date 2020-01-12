<template>
    <div>
        <h1>hello</h1>
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
<style></style>