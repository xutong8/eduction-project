<template>
  <div class="title">
    <div v-for="(val, index) in flexs" :key="index" :style="{flex: val}" class="title_content">
      <template v-if="index == 0">ID</template>
      <template v-else-if="attributes[index-1][1] == 'string'">
        <span v-text="attributes[index-1][0]"></span>
      </template>
      <template v-else>
        <div
          class="title_content_chart"
          :class="'chart-' + attributes[index-1][0]"
          draggable="true"
          @dragstart="dragstart(colorScale[index-1], $event)"
        >
          <div class="title_content_chart_background" :style="{background: colorScale[index-1]}"></div>
          <span v-text="attributes[index-1][0]"></span>
          <div class="barchart">
            <BarChart
              :data="attributes[index-1][2].slice(0, count)"
              :count="count"
              :color="colorScale[index-1]"
              v-if="show"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import BarChart from "../BarChart";
import Vue from "vue";
import * as d3 from "d3";
Vue.use(BarChart);

export default {
  name: "TitleComponent",
  props: {
    data: {
      type: Array,
      required: true
    },
    flexs: {
      type: Array,
      required: true
    },
    sumArray: {
      type: Array,
      required: true
    }
  },
  components: {
    BarChart
  },
  data() {
    return {
      attributes: undefined,
      maps: undefined,
      count: 10,
      show: true
    };
  },
  computed: {
    colorScale() {
      return d3.schemeCategory10;
    }
  },
  created() {
    this.attributes = this.$store.state.attributes;
  },
  methods: {
    dragstart(color, event) {
      if (event) {
        this.$emit("dragstart", color, event);
      }
    }
  },
  watch: {
    sumArray() {
      this.show = false;
      this.$nextTick(function() {
        this.show = true;
      });
    }
  }
};
</script>

<style lang="less">
.title {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  display: -webkit-flex;
  user-select: none;
  .title_content {
    width: 100%;
    height: 100%;
    border: 1px solid black;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    align-items: flex-start;
    font-size: 20px;
    .title_content_chart {
      width: 100%;
      height: 100%;
      display: flex;
      display: -webkit-flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column;
      cursor: pointer;
      position: relative;
      .title_content_chart_background {
        opacity: 0.2;
        width: 100%;
        height: 100%;
        z-index: 0;
        position: absolute;
        left: 0;
        top: 0;
      }
      .barchart {
        width: 100%;
        height: calc(100% - 30px);
      }
    }
  }
}
</style>