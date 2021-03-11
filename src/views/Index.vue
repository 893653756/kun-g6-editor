<template>
  <div class="pages">
    <div class="pages-header">
      <header-tools class="pages-header__tools"></header-tools>
      <div class="pages-header__close" v-if="showClose">
        <span class="el-icon-close" @click="handleClosePage"></span>
      </div>
    </div>
    <div class="pages-body">
      <aside-tabs
        class="pages-body__aside"
        @look-node-detail="lookNodeDetail"
      ></aside-tabs>
      <graph-canvas
        class="pages-body__editors"
        @graph-editors="handleCreateGraph"
        v-loading="loading"
        @look-node-detail="lookNodeDetail"
      ></graph-canvas>
      <!-- <aside-right></aside-right> -->
    </div>
    <!-- 节点详情 -->
    <el-dialog title="对象详情" :visible.sync="dialogBaseInfoDetail">
      <el-table
        :data="baseInfoDetail"
        header-row-class-name="header-hidden"
        height="400"
      >
        <el-table-column prop="field" label=""></el-table-column>
        <el-table-column prop="value" label=""></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { openWebSocket } from "@/utils/webSocket";
import HeaderTools from "./header-tools/Index.vue";
import AsideTabs from "./aside-tabs/Index.vue";
import GraphCanvas from "./graph-canvas/Index.vue";
// import AsideRight from './aside-right/Index.vue';
import * as MutationTypes from "@/store/mutation-types";
import editors from "@/editors";
import {
  getRelationByDxType,
  findBltjrByBlnr,
  getCaseclues,
} from "@/api/headerTools";
// import graphData from '@/utils/graph-data.json';

export default {
  components: {
    HeaderTools,
    AsideTabs,
    GraphCanvas,
    // AsideRight,
  },
  data() {
    return {
      showClose: false,
      loading: false,
      dialogBaseInfoDetail: false,
      baseInfoDetail: [],
    };
  },
  created() {
    this.editors = editors;
    this.isCreate = false;
  },
  methods: {
    lookNodeDetail(cellInfo) {
      const arr = [];
      // const cellInfo = model.cellInfo;
      const mxProperties = cellInfo.mxProperties || {};
      const propOrders = cellInfo.propOrders || [];
      propOrders.forEach((key) => {
        if (mxProperties.hasOwnProperty(key)) {
          arr.push({
            field: key,
            value: mxProperties[key] || "—",
          });
        }
      });
      this.baseInfoDetail = arr;
      this.dialogBaseInfoDetail = true;
    },
    handleCreateGraph(graph) {
      this.editors.saveGraph(graph);
      // 保存到 store
      this.$store.commit(MutationTypes.SET_EDITORS, this.editors);
      this.$nextTick(() => {
        this.createWs();
        // this.getRelationByDxType();
      });
    },
    // 创建 ws
    createWs() {
      openWebSocket(
        window.elypWss + window.access_token,
        () => {
          if (this.isCreate) {
            return;
          }
          this.isCreate = true;
          // 连接创建成功
          this.getRelationByDxType();
        },
        ({ data }) => {
          if (data.includes("entities")) {
            try {
              // console.warn(Date.now());
              const dataList = JSON.parse(data);
              // console.warn('dataList', dataList);
              this.editors.batchProcessing(dataList);
            } catch (error) {
              console.warn("解析数据失败", error);
            }
          }
        }
      );
    },
    // 关闭页面
    handleClosePage() {
      window.parent && window.parent.vm && window.parent.vm.cancelCallBack();
    },
    // 解析参数
    analyticParameter(search) {
      console.warn("AAAA");
      const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
      const base = search.split("&")[0];
      let eqIndex = base.indexOf("=");
      var value = base.substring(eqIndex + 1);
      let judgeParam = [];
      // judgeParam = [
      //   {
      //     params: {
      //       idMaps: [{ sfzhm: "610123197110118778" }],
      //       gxIds: "",
      //       linkParams: {},
      //       multiNe: false,
      //       countNextNodeNum: true,
      //     },
      //     dxType: "ry_ry",
      //   },
      // ];
      if (base64regex.test(value)) {
        judgeParam = JSON.parse(atob(value));
      } else {
        const frames =
          window.parent.document.getElementsByClassName("t_page") || [];
        for (let i = 0; i < frames.length; i++) {
          const frame = frames[i];
          const active = frame.dataset.active === "true";
          if (active) {
            judgeParam = frame.contentWindow.vm.judgeParam;
            // console.log('judgeParam', judgeParam);
          }
        }
      }
      return judgeParam;
    },
    // 更加url配置获取数据
    getRelationByDxType() {
      // 解析 url
      const search = window.location.href.split("?")[1];
      if (!search) {
        this.editors.graph && this.editors.graph.render();
        return;
      }
      this.showClose = true;
      // 案件线索
      if (search.indexOf("type=xsTeam") !== -1) {
        const obj = {};
        search.replace(/([a-zA-Z]+)=([A-Za-z0-9]+)/g, (...arg) => {
          obj[arg[1]] = arg[2];
          return "";
        });
        this.fetchCaseclues(obj);
        return;
      }
      this.fetchJudgeData(search);
    },
    // 一键研判数据请求
    async fetchJudgeData(search) {
      const judgeParam = this.analyticParameter(search);
      this.loading = true;
      const blnrArr = [];
      console.warn("judgeParam", judgeParam);
      judgeParam.forEach((payload) => {
        blnrArr.push(findBltjrByBlnr(payload));
      });
      try {
        await Promise.all(blnrArr);
      } catch (error) {}
      const arr = [];
      judgeParam.forEach((payload) => {
        arr.push(
          getRelationByDxType({ wsType: window.access_token, ...payload })
        );
      });
      // 记录是从一件研判进来
      // this.$store.commit(MutationTypes.ENTER_BY_JUDGMENT, true);
      const result = await Promise.all(arr);
      this.loading = false;
      // this.editors.graph.read(graphData);
    },
    // 案件线索数据请求
    async fetchCaseclues({ str, ...otherInfo }) {
      // 解析参数
      str = atob(str);
      str = decodeURIComponent(str);
      const { clues: xsbhs } = JSON.parse(str);
      this.loading = true;
      let currentLoginUser = {};
      try {
        currentLoginUser =
          JSON.parse(sessionStorage.getItem("currentLoginUser")) || {};
      } catch (error) {}
      const userAndDept = {
        createUser: currentLoginUser.loginName || "",
        createUserCn: currentLoginUser.name || "",
        createDept: currentLoginUser.topDept?.id || "",
        createDeptCn: currentLoginUser.topDept?.fullName || "",
      };
      this.$store.commit(MutationTypes.SET_XSBH, xsbhs);
      this.$store.commit(MutationTypes.SET_OTHER_INFO, otherInfo);
      this.$store.commit(MutationTypes.SET_USER_DEPT, userAndDept);
      const fetchArr = [];
      xsbhs.forEach((v) => {
        fetchArr.push(
          getCaseclues({
            ...userAndDept,
            xsbh: v.xsbh,
            queryStatus: otherInfo.queryStatus || "",
          })
        );
      });
      try {
        const result = await Promise.all(fetchArr);
        console.warn("result", result);
        const entities = [];
        const relations = [];
        result.forEach(({ data }) => {
          data.entities.forEach((v) => {
            const item = entities.find((item) => item.id === v.id);
            if (!item) {
              return entities.push(v);
            }
            if (v.hidden) {
              item.hidden = true;
            }
          });
          data.relations.forEach((v) => {
            const item = relations.find((item) => item.instanceIdForMerge === v.instanceIdForMerge);
            if (!item) {
              relations.push(v);
            }
          });
        });
        this.editors.extendRelation({ entities, relations });
        // xsbhs.forEach(async (v) => {
        //   const { data } = await getCaseclues({
        //     ...userAndDept,
        //     xsbh: v.xsbh,
        //     queryStatus: otherInfo.queryStatus || "",
        //   });
        //   this.editors.extendRelation(data);
        // });
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pages {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  &-header {
    height: 82px;
    display: flex;
    &__tools {
      flex: 1;
    }
    &__close {
      width: 82px;
      height: 82px;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 0px;
      right: 0px;
      cursor: pointer;
      span {
        font-size: 32px;
        color: rgba(0, 0, 0, 0.4);
        transition: all linear 0.3;
      }
      span:hover {
        color: rgba(0, 0, 0, 0.8);
        transform: scale(1.1);
      }
    }
  }

  &-body {
    flex: 1;
    display: flex;
    border-top: 1px solid #d9d9d9;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    &__aside {
      // width: 340px;
      // z-index: 20;
      position: absolute;
      height: 100%;
      z-index: 20;
    }
    &__editors {
      flex: 1;
      position: relative;
      width: 0px;
      margin-left: 60px;
    }
  }
}
</style>