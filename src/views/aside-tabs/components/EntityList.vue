<template>
  <!-- 实体列表 -->
  <div class="entity">
    <div class="entity-title">
      <span>创建实体</span>
    </div>
    <el-menu
      class="entity-list"
      :default-openeds="['1', '2']"
      @dragend.native="handleDragEnd"
    >
      <el-submenu
        v-for="(menu, index) of entitys"
        :key="menu.yjlx"
        :index="`${index + 1}`"
      >
        <template slot="title">
          <span class="entity-list__title">{{ menu.yjlxmc }}</span>
        </template>
        <div class="entity-list__body">
          <div v-for="(item, i) of menu.list" :key="item.id">
            <img
              :src="`${$baseImagePath}/entityImages/${item.dxtbCode}.png`"
              :data-typenum="index"
              :data-listnum="i"
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
      @closed="handleClose"
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
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { fetchEntityIsExistence } from '@/api/entityList';
export default {
  data() {
    return {
      dialogFormVisible: false,
      entityProperty: {},
      rules: {},
      labelList: [],
      formLabelWidth: '120px',
    };
  },
  created() {
    this.model = null;
  },
  computed: {
    ...mapGetters(['editors', 'entitys']),
  },
  methods: {
    handleDragEnd(evt) {
      const target = evt.target;
      const { typenum, listnum } = target.dataset;
      const item = this.entitys[typenum].list[listnum];
      const { x, y } = this.editors.graph.getPointByClient(evt.x, evt.y);
      this.model = {
        x,
        y,
        type: 'circle-image',
        cellInfo: {
          dxId: item.id,
          label: item.ypdxMc,
          type: item.dxtbCode,
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
        });
        this.$set(this.entityProperty, v.cxcsField, '');
        const ruleArr = [];
        if (v.isRequired) {
          ruleArr.push({
            required: true,
            message: `请输入${v.cxcsName}`,
            trigger: 'blur',
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
      const { data } = await fetchEntityIsExistence(payload);
      if (data.code === 0) {
        if (data.content) {
          // 直接添加节点
          this.model.cellInfo = data.content;
          this.editors.addNode(this.model);
        } else {
          const id = `circle-image-${Date.now()}`;
          const info = {
            idMap: params,
            lbProperties: {},
            id: id,
          };
          const properties = {};
          this.labelList.forEach((v) => {
            if (params[v.field]) {
              properties[v.label] = params[v.field];
            }
          });
          info.properties = properties;
          this.model.cellInfo = {
            ...info,
            ...this.model.cellInfo,
          };
          this.editors.addNode(this.model);
        }
      } else {
        this.$message({
          type: 'warning',
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
    },
  },
};
</script>

<style lang="scss" scoped>
.entity {
  flex: 1;
  height: 0;
  padding: 0px 6px;
  font-size: 14px;
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
        justify-content: center;
        flex-direction: column;
        align-items: center;
        width: 76px;
        height: 74px;
        margin-right: 4px;
        cursor: move;
        &:hover {
          background: rgba(30, 152, 204, 0.15);
          border-radius: 4px;
        }
        & img {
          width: 50px;
          border: 1px dashed #eeeeee;
        }
      }
    }
  }
}
</style>
