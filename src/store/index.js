import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        attributes: undefined
    },
    getters: {},
    mutations: {
        setAttributes(state, attributes) {
            state.attributes = attributes;
        }
    },
    actions: {},
    modules: {}
})