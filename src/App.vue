<template>
  <div id="app">
    <div id="leftApp">
      <TitleComponent :data="data" :flexs="flexs" class="app_title" @dragstart="dragstart(arguments)" :sumArray="sumArray"/>
      <ContentComponent :data="data" :flexs="flexs" class="app_content" />
    </div>
    <ProcessedComponent
      id="rightApp"
      @drop="drop($event)"
      @dragover.prevent
      :data="sumData"
      :weights="weights"
      :sumArray="sumArray"
      @dblclick="dblclick($event)"
    />
    <a-modal title="确认框" v-model="visible" @ok="handleOk">
      {{ field }}是属于什么类型的字段？
      <a-radio-group name="radioGroup" v-model="radioValue">
        <a-radio :value="1">PC</a-radio>
        <a-radio :value="2">NC</a-radio>
      </a-radio-group>
    </a-modal>
    <a-modal title="Edit attributes weights" v-model="weightVisible" @ok="weightHandleOk">
      <div v-for="(item, index) in sumData.pcs" :key="item" class="weightsLine">
        <span>{{ item }} :</span>
        <input v-model="weights[index]" />
      </div>
      <div v-for="(item, index) in sumData.ncs" :key="item" class="weightsLine">
        <span>{{ item }} :</span>
        <input v-model="weights[index+sumData.pcs.length]" />
      </div>
    </a-modal>
  </div>
</template>

<script>
// 第一步，从data中获取所有的属性名。getAllAttributes()
// 第二步，添加BarChart。
// 第三步，添加多行的Record记录。
// 第四步，添加SUM交互。
// 第五步，编辑权重。

import TitleComponent from "./components/TitleComponent";
import ContentComponent from "./components/ContentComponent";
import ProcessedComponent from "./components/ProcessedComponent";
import "ant-design-vue/dist/antd.css";
import Vue from "vue";
import { Modal, Radio, Input } from "ant-design-vue";
Vue.use(TitleComponent);
Vue.use(ProcessedComponent);
Vue.use(ContentComponent);
Vue.component(Modal.name, Modal);
Vue.use(Radio);
Vue.use(Input);

// 生成数据
const data = [];

for (let i = 1; i <= 50; i++) {
  const item = {};
  item["name"] = "Record" + i;
  item["a"] = Math.random() * 1;
  item["b"] = Math.random() * 1;
  item["c"] = Math.random() * 1;
  item["d"] = Math.random() * 1;
  item["e"] = Math.random() * 1;
  item["f"] = Math.random() * 1;
  item["g"] = Math.random() * 1;
  item["h"] = Math.random() * 1;
  data.push(item);
}

export default {
  name: "app",
  components: {
    TitleComponent,
    ContentComponent
  },
  data() {
    return {
      data,
      // 其中每个item用于指定每列的宽度
      flexs: [1, 1, 2, 2, 2, 2, 2, 2],
      attributes: undefined,
      visible: false, //控制modal是否显示
      field: undefined, //设置当前选中列对应的fieldName
      color: undefined, //保存当前选中列对应的color
      radioValue: 1, //单选框默认值
      sumData: {
        pcs: [],
        ncs: []
      },
      weights: [],
      weightVisible: false, //控制编辑weight的modal是否显示
      sumArray: []
    };
  },
  methods: {
    getAllAttributes() {
      const attributes = [];
      for (let val of Object.entries(this.data[0])) {
        const attribute = [];
        attribute.push(val[0]);
        attribute.push(typeof val[1]);
        const vals = [];
        for (let item of this.data) {
          vals.push(item[val[0]]);
        }
        attribute.push(vals);
        attributes.push(attribute);
      }
      // 将字符串类型的字段向前排序，数字类型的字符向后排序
      return attributes.sort(function(a, b) {
        if (a[1] == "string" && b[1] == "number") {
          return -1;
        } else if (b[1] == "string" && a[1] == "number") {
          return 1;
        } else {
          return 0;
        }
      });
    },
    dragstart(params) {
      const color = params[0];
      const event = params[1];
      if (event) {
        //获取当前选中的列对应的fieldName
        const classList = Array.from(event.target.classList);
        let index = -1;
        for (let val in classList) {
          if (classList[val].indexOf("chart-") != -1) {
            index = val;
            break;
          }
        }
        this.field = classList[index].substr(6);
        this.color = color;
      }
    },
    drop(event) {
      if (event) {
        this.radioValue = 1; // 恢复默认值
        this.visible = true;
      }
    },
    handleOk() {
      this.visible = false;
      const className = 'chart-' + this.field;
      const nodes = Array.from(document.getElementsByClassName(className));
      for(let val of nodes) {
        const parent = val.parentNode;
        parent.parentNode.removeChild(parent);
      }
      if (this.radioValue == 1) {
        this.sumData.pcs.push(this.field);
      } else {
        this.sumData.ncs.push(this.field);
      }
      const length = this.sumData.pcs.length + this.sumData.ncs.length;
      const percent = 100.0 / length;
      this.weights = new Array(length).fill(percent);
      const item = {};
      item.field = this.field;
      item.color = this.color;
      this.sumArray.push(item);
    },
    weightHandleOk() {
      this.weightVisible = false;
    },
    dblclick(event) {
      if (event) {
        this.weightVisible = true;
      }
    }
  },
  created() {
    this.attributes = this.getAllAttributes();
    this.$store.commit("setAttributes", this.attributes);
    this.$store.commit("setData", this.data); //将初始化的数据放入store中
  }
};
</script>

<style lang="less">
#app {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: flex-end;
  #leftApp {
    width: 70%;
    height: calc(100% - 200px);
    .app_title {
      height: 150px;
    }
    .app_content {
      height: calc(100% - 150px);
    }
  }
  #rightApp {
    width: 20%;
    height: 100%;
  }
}
.weightsLine {
  display: flex;
  justify-content: space-between;
  margin: 10px;
}
</style>
