import ProcessedComponent from './ProcessedComponent.vue'

ProcessedComponent.install = (Vue) => {
    Vue.component(ProcessedComponent.name, ProcessedComponent)
}

export default ProcessedComponent