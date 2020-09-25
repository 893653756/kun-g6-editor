<template>
  <div class="icon-label">
    <span :class="icon"></span>
    <span v-if="label">
      {{label}}
      <slot></slot>
    </span>
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
    }
  }
}
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
  & > span:last-child {
  font-size: 14px;
  font-family: Microsoft YaHei;
  line-height: 19px;
  }
}
</style>
