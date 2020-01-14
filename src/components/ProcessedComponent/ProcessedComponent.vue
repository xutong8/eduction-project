<template>
  <div class="processed" ref="processed">
    <div class="processed_top">
      <span class="processed_top_font">SUM</span>
      <div class="processed_top_content"></div>
    </div>
    <div class="processed_bottom"></div>
    <div
      class="processed_background"
      @drop="drop($event)"
      @dragover.prevent="dragover($event)"
      @dragenter="dragenter($event)"
      @dragleave="dragleave($event)"
    ></div>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "ProcessedComponent",
  methods: {
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
        console.log("dragenter...");
      }
    },
    dragleave(event) {
      if (event) {
        const processed = this.$refs["processed"];
        this.originalState(processed);
        console.log("dragleave...");
      }
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
    }
  }
  .processed_bottom {
    width: 100%;
    height: calc(100% - 202px);
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