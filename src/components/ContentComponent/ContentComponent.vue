<template>
  <div class="content">
    <vue-scroll>
      <div class="content_rows" v-for="(val, index) in data" :key="index">
        <div class="content_rows_per">
          <div
            v-for="(flex, index1) in flexs"
            :key="index1"
            :style="{flex: flex}"
            class="content_rows_per_item"
          >
            <template v-if="index1 == 0">
              <span>{{ index + 1 }}</span>
            </template>
            <template v-else-if="attributes[index1-1][1] == 'string'">
              <span v-text="val['name']"></span>
            </template>
            <template v-else>
              <div class="content_rows_per_item_chart" :class="'chart-'+attributes[index1-1][0]">
                <div :style="{background: colorScale[index1-1]}" class="content_rows_per_item_chart_background"></div>
                <svg width="100%" height="100%">
                  <g>
                    <rect
                      x="0"
                      y="20"
                      :width="computedWidth(attributes[index1-1][0], val[attributes[index1-1][0]])"
                      height="20"
                      rx="2px"
                      :fill="colorScale[index1-1]"
                    />
                  </g>
                </svg>
              </div>
            </template>
          </div>
        </div>
      </div>
    </vue-scroll>
  </div>
</template>

<script>
import * as d3 from "d3";
import vuescroll from "vuescroll";
import Vue from "vue";

Vue.use(vuescroll);

export default {
  name: "ContentComponent",
  props: {
    data: {
      type: Array,
      required: true
    },
    flexs: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      attributes: undefined
    };
  },
  computed: {
    colorScale() {
      return d3.schemeCategory10;
    }
  },
  methods: {
    width() {
      const width = {};

      const attributes = this.attributes;
      for (let val of attributes) {
        if (
          val[1] == "number" &&
          Array.from(document.getElementsByClassName("chart-" + val[0]))
            .length != 0
        ) {
          const itemWidth = document.getElementsByClassName(
            "chart-" + val[0]
          )[0].offsetWidth;
          width[val[0]] = itemWidth;
        }
      }

      return width;
    },
    scaleX(key) {
      const width = this.width();
      const itemWidth = width[key];
      return d3
        .scaleLinear()
        .domain([0, 1])
        .range([0, itemWidth]);
    },
    computedWidth(key, value) {
      const scaleX = this.scaleX(key);
      return scaleX(value);
    }
  },
  created() {
    this.attributes = this.$store.state.attributes;
  },
  mounted() {
    this.$forceUpdate();
  }
};
</script>

<style lang="less">
.content {
  width: 100%;
  height: 100%;
  user-select: none;
  .content_rows {
    width: 100%;
    height: 60px;
    .content_rows_per {
      width: 100%;
      height: 100%;
      display: flex;
      display: -webkit-flex;
      .content_rows_per_item {
        display: flex;
        display: -webkit-flex;
        width: 100%;
        height: 100%;
        border: 1px solid black;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        .content_rows_per_item_chart {
          width: 100%;
          height: 100%;
          position: relative;
          .content_rows_per_item_chart_background {
            width: 100%;
            height: 100%;
            z-index: 0;
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0.2;
          }
        }
      }
    }
  }
}
</style>