<template>
  <div class="stack-root">
    <svg width="100%" height="100%" ref="svg">
      <g>
        <template>
          <rect v-for="(item, index) in series" :key="index" />
        </template>
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "StackedBarChart",
  props: {
    data: {
      type: Object,
      required: true
    },
    factors: {
      type: Array,
      required: true
    },
    weights: {
      type: Array,
      required: true
    },
    maxData: {
      type: Number
    },
    color: {
      type: String
    },
    right: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      series: undefined
    };
  },
  methods: {
    width() {
      //get svg width
      return this.$refs.svg.getBoundingClientRect().width;
    },
    height() {
      //get svg height
      return this.$refs.svg.getBoundingClientRect().height;
    },
    getRect() {
      //get all rects
      const svg = this.$refs.svg;
      return d3.select(svg).selectAll("rect");
    },
    x() {
      const width = this.width();
      return d3
        .scaleLinear()
        .domain([0, 1])
        .range([0, width]);
    },
    rightX() {
      const width = this.width();
      return d3
        .scaleLinear()
        .domain([0, 1])
        .range([width, 0]);
    },
    updateSeries() {
      const data = this.data;
      const weights = this.weights;
      const factors = this.factors;
      const series = [];
      for (let i = 0, oldVal = 0; i < factors.length; i++) {
        const item = [];
        const factor = factors[i];
        item.push(oldVal);
        item.push((data[factor] * weights[i]) / 100.0 + oldVal);
        series.push(item);
        oldVal += (data[factor] * weights[i]) / 100.0;
      }
      this.series = series;
    },
    drawRect() {
      const series = this.series;
      const rect = this.getRect();
      const height = this.height();
      const x = this.x();
      const rightX = this.rightX();
      const color = this.color;
      const right = this.right;
      rect
        .data(series)
        .attr("x", (d) => {
          if (!right) {
            return x(d[0]);
          } else {
            return rightX(d[1]);
          }
        })
        .attr("y", 0)
        .attr("height", height)
        .attr("width", 0)
        .attr("rx", "2px")
        .attr("fill", color)
        .attr("stroke-width", 1)
        .attr("stroke", "white")
        .transition()
        .duration(500)
        .attr("width", d => {
          if(!right) {
            return x(d[1]) - x(d[0]);
          }
          else {
            return rightX(d[0]) - rightX(d[1]);
          }
        });
    }
  },
  watch: {
    factors: {
      deep: true,
      handler() {
        // data为数据，factors为因素，weights为因素对应的权重
        this.updateSeries();
        this.$nextTick(function() {
          this.drawRect();
        });
      }
    },
    weights() {
      this.updateSeries();
      this.$nextTick(function() {
        this.drawRect();
      });
    }
  }
};
</script>

<style lang="less">
.stack-root {
  width: 100%;
  height: 100%;
  //background: red;
}
</style>