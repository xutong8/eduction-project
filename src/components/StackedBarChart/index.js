import StackedBarChart from './StackedBarChart.vue'

StackedBarChart.install = (Vue) => {
    Vue.component(StackedBarChart.name, StackedBarChart);
}

export default StackedBarChart;