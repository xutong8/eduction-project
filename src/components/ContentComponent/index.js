import ContentComponent from './ContentComponent.vue'

ContentComponent.install = (Vue) => {
    Vue.component(ContentComponent.name, ContentComponent)
}

export default ContentComponent