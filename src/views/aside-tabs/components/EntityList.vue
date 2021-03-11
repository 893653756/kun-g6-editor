<template>
  <!-- 实体列表 -->
  <div class="entity">
    <div class="entity-title">
      <span>创建实体</span>
    </div>
    <div
      v-if="listLoading"
      v-loading="listLoading"
      class="entity-loading"
    ></div>
    <el-menu
      class="entity-list"
      :default-openeds="defaultOpeneds"
      @dragend.native="handleDragEnd"
      v-else
    >
      <el-submenu
        v-for="(menu, index) of entitys"
        :key="menu.yjlx"
        :index="`${index + 1}`"
      >
        <template slot="title">
          <span class="entity-list__title">{{ menu.yjlxmc }}</span>
        </template>
        <div :class="['entity-list__body', menu.yjlx]">
          <div v-for="(item, i) of menu.list" :key="item.id + item.icon">
            <img
              :src="`${$baseImagePath}/entityImages/${item.icon}.png`"
              :data-typenum="index"
              :data-listnum="i"
              :draggable="item.draggable"
            />
            <span>{{ item.ypdxMc }}</span>
          </div>
        </div>
      </el-submenu>
    </el-menu>
    <!-- 创建实体弹框录入 -->
    <el-dialog
      title="创建实体"
      :visible.sync="dialogFormVisible"
      :modal-append-to-body="false"
      @closed="handleClose"
      width="500px"
    >
      <el-form :model="entityProperty" :rules="rules" ref="form">
        <el-form-item
          v-for="item of labelList"
          :key="item.label"
          :label="item.label"
          :label-width="formLabelWidth"
          :prop="item.field"
        >
          <el-input
            size="small"
            v-model="entityProperty[item.field]"
            :placeholder="item.placeholder"
            :disabled="!!item.value"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleSure"
          :loading="loading"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { fetchEntityIsExistence } from "@/api/entityList";
import MyMixin from "@/mixin";
export default {
  data() {
    return {
      dialogFormVisible: false,
      entityProperty: {},
      rules: {},
      labelList: [],
      formLabelWidth: "120px",
      loading: false,
    };
  },
  created() {
    this.model = null;
  },
  mixins: [MyMixin],
  computed: {
    ...mapGetters(["editors", "entitys", 'otherInfo']),
    defaultOpeneds() {
      return this.entitys.map((_, i) => `${i + 1}`);
    },
    listLoading() {
      return this.entitys.length === 0;
      // return true;
    },
    // dragDisabled() {
    //   return !this.otherInfo.type;
    // }
  },
  methods: {
    handleDragEnd(evt) {
      const target = evt.target;
      const { typenum, listnum } = target.dataset;
      const item = this.entitys[typenum].list[listnum];
      const { x, y } = this.editors.graph.getPointByClient(evt.x, evt.y);
      if (evt.x < 360) {
        return this.$message({
          type: "info",
          message: "请将节点拖入画布",
        });
      }
      this.model = {
        x,
        y,
        type: "circle-image",
        cellInfo: {
          dxId: item.id,
          label: item.ypdxMc,
          icon: item.icon,
          type: item.icon,
        },
      };
      this.initFormData(item);
    },
    // 获取属性设置验证
    initFormData(item) {
      this.clearData();
      item.cxcsList.forEach((v) => {
        this.labelList.push({
          label: v.cxcsName,
          field: v.cxcsField,
          placeholder: `请输入${v.cxcsName}`,
          value: v.cxcsValue,
          isShow: v.isShow,
        });
        this.$set(
          this.entityProperty,
          v.cxcsField,
          v.cxcsValue ? v.cxcsValue : ""
        );
        const ruleArr = [];
        if (v.isRequired) {
          ruleArr.push({
            required: true,
            message: `请输入${v.cxcsName}`,
            trigger: "blur",
          });
        }
        this.$set(this.rules, v.cxcsField, ruleArr);
      });
      this.dialogFormVisible = true;
    },
    handleSure() {
      // 验证必填项是否已填写
      this.$refs.form.validate((result) => {
        if (result) {
          this.fetchEntity();
        }
      });
    },
    // 后台查询实体
    async fetchEntity() {
      // 后台通讯查询是否有该节点
      const params = {};
      Object.entries(this.entityProperty).forEach((v) => {
        if (v[1]) {
          params[v[0]] = v[1];
        }
      });
      const dxId = this.model.cellInfo.dxId;
      const payload = {
        dxId,
        params,
      };
      this.loading = true;
      const { data } = await fetchEntityIsExistence(payload);
      this.loading = false;
      if (data.code === 0) {
        // 判断是否已有改节点
        if (this.editors.graph.findById(data.content.id)) {
          return this.$message({
            type: 'info',
            message: '节点已存在'
          });
        }
        if (!data.content.notExist) {
          // 保存节点id,
          const cellInfo = this.saveItemId([data.content]);
          this.model.cellInfo = data.content;
          this.editors.addNode(this.model);
        } else {
          const id = data.content.id;
          const info = {
            idMap: params,
            lbProperties: {},
            id: id,
          };
          const properties = {};
          this.labelList.forEach((v) => {
            if (params[v.field] && v.isShow) {
              properties[v.label] = params[v.field];
            }
          });
          info.properties = properties;
          this.model.cellInfo = {
            ...info,
            ...this.model.cellInfo,
            // 前端自定义的一个节点
            custom: true,
          };
          this.model.replace = true;
          this.editors.addNode(this.model);
        }
      } else {
        this.$message({
          type: "warning",
          message: data.msg,
        });
      }
      this.dialogFormVisible = false;
    },
    // 关闭弹框
    handleClose() {
      this.clearData();
    },
    // 清理数据
    clearData() {
      this.entityProperty = {};
      this.rules = {};
      this.labelList = [];
      this.dialogFormVisible = false;
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.entity {
  flex: 1;
  // height: 0;
  padding: 0px 6px;
  font-size: 14px;
  // position: relative;
  &-title {
    margin-left: 8px;
    span {
      line-height: 44px;
      font-size: 16px;
      font-weight: 600;
    }
  }
  &-list {
    border-right: none;
    & > li {
      margin-bottom: 10px;
    }
    /deep/ {
      .el-submenu__title {
        line-height: 28px;
        height: 28px;
        padding: 0px !important;
      }
    }
    &__title {
      line-height: 28px;
      background-color: #f7f7f7;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 14px;
      & span {
        margin-right: 10px;
      }
    }
    &__body {
      margin-top: 12px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      width: 100%;
      & > div {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 65px;
        height: 88px;
        font-size: 12px;
        text-align: center;
        // &:hover {
        //   background: rgba(30, 152, 204, 0.15);
        //   border-radius: 4px;
        // }
        & img {
          cursor: move;
          width: 50px;
          border: 1px dashed #eeeeee;
          &:hover {
            background: rgba(30, 152, 204, 0.15);
            border-radius: 2px;
          }
        }
      }
    }
    &__body.ypdx_ry > div {
      &:nth-child(n + 2) img:hover {
        background: rgba(30, 152, 204, 0);
        border-radius: 0px;
        cursor: no-drop;
      }
    }
  }
  &-loading {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
