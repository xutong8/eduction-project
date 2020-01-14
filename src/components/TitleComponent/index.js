import TitleComponent from './TitleComponent.vue'

TitleComponent.install = (Vue) =>  {
    Vue.component(TitleComponent.name, TitleComponent)
}

export default TitleComponent