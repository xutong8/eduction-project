<template>
  <div class="processed" ref="processed">
    <div class="processed_top">
      <span class="processed_top_font">SUM</span>
      <div class="processed_top_content">
        <div class="processed_top_content_firstline">
          <div
            v-for="(item, index) in data.pcs"
            :key="index"
            class="processed_top_content_firstline_pcs"
            :style="{width: weights[index] + '%'}"
          >{{ item }}</div>
        </div>
        <div class="processed_top_content_secondline">
          <div
            v-for="(item, index) in data.ncs"
            :key="index"
            class="processed_top_content_secondline_ncs"
            :style="{width: weights[index+data.pcs.length] + '%'}"
          >{{ item }}</div>
        </div>
      </div>
    </div>
    <div class="processed_bottom">
      <div class="processed_bottom_firstLine">
        <div
          :style="{flex: 1}"
          v-for="(item, index) in sumArray"
          :key="index"
          class="processed_bottom_firstLine_chart"
        >
          <div
            class="processed_bottom_firstLine_chart_background"
            :style="{background: item.color}"
          ></div>
          <span v-text="item.field"></span>
          <div class="barchart" v-if="show">
            <BarChart :data="computedData(item.field)" :count="count" :color="item.color" />
          </div>
        </div>
      </div>
      <div class="processed_bottom_secondLine">
        <vue-scroll>
          <div
            class="processed_bottom_secondLine_rows"
            v-for="(item, index) in storeData"
            :key="index"
          >
            <div class="processed_bottom_secondLine_rows_firstLine">
              <StackedBarChart :data="item" :factors="data.pcs" :weights="weights" :maxData="maxPCSData" :color="'red'" />
            </div>
            <div class="processed_bottom_secondLine_rows_secondLine">
              <div class="processed_bottom_secondLine_rows_secondLine_item1">
                <StackedBarChart :data="item" :factors="data.ncs" :weights="weights" :maxData="maxNCSData" :color="'green'" :right="true"/>
              </div>
              <div class="processed_bottom_secondLine_rows_secondLine_item2">
                <StackedBarChart :data="item" :factors="data.ncs" :weights="weights" :maxData="maxPCSData" :color="'green'" />
              </div>
            </div>
          </div>
        </vue-scroll>
      </div>
    </div>
    <div
      class="processed_background"
      @drop="drop($event)"
      @dragover.prevent="dragover($event)"
      @dragenter="dragenter($event)"
      @dragleave="dragleave($event)"
      @dblclick="dblclick($event)"
    ></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import Vue from "vue";
import BarChart from "../BarChart";
import vuescroll from "vuescroll";
import StackedBarChart from "../StackedBarChart";
Vue.use(BarChart);
Vue.use(StackedBarChart);
Vue.use(vuescroll);

export default {
  name: "ProcessedComponent",
  props: {
    data: {
      //对应App中的sumData
      type: Object,
      required: true
    },
    weights: {
      type: Array,
      required: true
    },
    sumArray: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      attributes: undefined,
      count: 10,
      show: true, //用于刷新barchart
      storeData: undefined,
      maxPCSData: undefined, //PCS factors中的最大值
      maxNCSData: undefined //NCS factors中的最大值
    };
  },
  created() {
    this.attributes = this.$store.state.attributes;
    this.storeData = this.$store.state.data;
  },
  methods: {
    computedData(field) {
      const attributes = this.attributes;
      for (let attribute of attributes) {
        if (attribute[0] == field) {
          return attribute[2];
        }
      }
    },
    originalState(processed) {
      d3.select(processed)
        .transition()
        .duration(1500)
        .style("border-style", "solid")
        .style("border-color", "black");
    },
    changedState(processed) {
      d3.select(processed)
        .transition()
        .duration(1500)
        .style("border-style", "dotted")
        .style("border-color", "goldenrod");
    },
    drop(event) {
      if (event) {
        this.$emit("drop", event);
        const processed = this.$refs["processed"];
        this.originalState(processed);
      }
    },
    dragover(event) {
      if (event) {
        this.$emit("dragover", event);
      }
    },
    dragenter(event) {
      if (event) {
        const processed = this.$refs["processed"];
        this.changedState(processed);
      }
    },
    dragleave(event) {
      if (event) {
        const processed = this.$refs["processed"];
        this.originalState(processed);
      }
    },
    dblclick(event) {
      if (event) {
        this.$emit("dblclick", event);
      }
    },
    updateMaxData(factors) {
      const series = [];
      const keys = factors;
      const weights = this.weights;
      const data = this.storeData;
      for (let i = 0, oldValue = 0; i < keys.length; i++) {
        const lines = [];
        for (let j = 0; j < data.length; j++) {
          const line = [];
          if (i == 0) {
            oldValue = 0;
          } else {
            oldValue = series[i - 1][j][1];
          }
          line.push(oldValue);
          line.push(oldValue + (data[j][keys[i]] * weights[i]) / 100.0);
          lines.push(line);
        }
        series.push(lines);
      }
      return d3.max(series, d => d3.max(d, d => d[1]));
    }
  },
  watch: {
    "data.pcs"() {
      // positive factors changed
      const factors = this.data.pcs;
      this.maxPCSData = this.updateMaxData(factors);
    },
    "data.ncs"() {
      //negative factors changed
      const factors = this.data.ncs;
      this.maxNCSData = this.updateMaxData(factors);
    },
    weights(val) {
      console.log("weights", val);
    },
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
.dot {
  border-style: dotted !important;
  border-color: goldenrod;
}
.processed {
  width: 100%;
  height: 100%;
  border: 1px solid black;
  position: relative;
  user-select: none;
  .processed_top {
    width: 100%;
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-color: black;
    .processed_top_font {
      font-size: 20px;
    }
    .processed_top_content {
      width: 100%;
      height: calc(100% - 26px);
      display: flex;
      flex-direction: column;
      .processed_top_content_firstline {
        width: 100%;
        flex: 1;
        .processed_top_content_firstline_pcs {
          float: right;
          background: red;
          opacity: 0.4;
          font-size: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          height: 100%;
          border: 1px solid white;
        }
      }
      .processed_top_content_secondline {
        width: 100%;
        flex: 1;
        display: flex;
        flex-direction: row;
        .processed_top_content_secondline_ncs {
          float: left;
          background: green;
          opacity: 0.4;
          font-size: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          height: 100%;
          border: 1px solid white;
        }
      }
    }
  }
  .processed_bottom {
    width: 100%;
    height: calc(100% - 202px);
    .processed_bottom_firstLine {
      width: 100%;
      height: 150px;
      border: none;
      border-bottom-width: 1px;
      border-bottom-style: solid;
      border-bottom-color: black;
      display: flex;
      flex-direction: row;
      .processed_bottom_firstLine_chart {
        flex: 1;
        height: 100%;
        display: flex;
        display: -webkit-flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;
        font-size: 20px;
        position: relative;
        .processed_bottom_firstLine_chart_background {
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
    .processed_bottom_secondLine {
      width: 100%;
      height: calc(100% - 150px);
      .processed_bottom_secondLine_rows {
        width: 100%;
        height: 60px;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: black;
        .processed_bottom_secondLine_rows_firstLine {
          width: 50%;
          height: 50%;
          float: right;
        }
        .processed_bottom_secondLine_rows_secondLine {
          width: 100%;
          height: 50%;
          clear: both;
          .processed_bottom_secondLine_rows_secondLine_item1 {
            width: 50%;
            height: 100%;
            float: left;
          }
          .processed_bottom_secondLine_rows_secondLine_item2 {
            width: 50%;
            height: 100%;
            float: left;
          }
        }
      }
    }
  }
  .processed_background {
    background: salmon;
    opacity: 0.2;
    width: 100%;
    height: 100%;
    z-index: 0;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>