<template>
  <div class="root">
    <svg width="100%" height="100%" ref="svg">
      <g>
        <template>
          <rect v-for="(value, index) in data" :key="index" />
        </template>
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "BarChart",
  props: {
    data: {
      type: Array,
      required: true
    },
    count: {
      type: Number,
      required: true
    },
    color: {
        type: String,
        required: true
    }
  },
  computed: {
    width() {
      //get svg width

      return this.$refs.svg.getBoundingClientRect().width;
    },
    height() {
      //get svg height

      return this.$refs.svg.getBoundingClientRect().height;
    },
    barWidth() {
      const width = this.width;
      const count = this.count;
      return width / count;
    },
    scaleX() {
      const width = this.width;
      const count = this.count;
      return d3
        .scaleLinear()
        .domain([0, count])
        .range([0, width]);
    },
    getRect() {
      //get all rects
      const svg = this.$refs.svg;
      return d3.select(svg).selectAll("rect");
    },
    scaleY() {
      const height = this.height;
      return d3
        .scaleLinear()
        .domain([1, 0])
        .range([0, height]);
    }
  },
  methods: {
    drawRect() {
      const data = this.data;
      const scaleX = this.scaleX;
      const scaleY = this.scaleY;
      const rect = this.getRect;
      const width = this.barWidth;
      const color = this.color;
      
      rect
        .data(data)
        .attr("x", (d, i) => scaleX(i))
        .attr("y", d => scaleY(d))
        .attr("width", width)
        .attr("height", d => scaleY(0) - scaleY(d))
        .attr("fill", color)
        .attr('rx', '2px');
    }
  },
  mounted() {
    this.drawRect();
  }
};
</script>

<style lang="less">
.root {
  width: 100%;
  height: 100%;
}
</style>