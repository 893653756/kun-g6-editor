<template>
  <div class="icon-label">
    <span :class="icon" :style="{ color: color }"></span>
    <div v-if="label">
      <span>{{ label }}</span>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true,
    },
    label: {
      type: String,
    },
    color: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
.icon-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #555555;
  font-weight: 400;
  & > span:first-child {
    font-size: 24px;
    line-height: 31px;
  }
  & > div {
    font-size: 14px;
    font-family: Microsoft YaHei;
    line-height: 19px;
  }
  &:hover > span:last-child {
    color: #409eff;
  }
}
</style>
