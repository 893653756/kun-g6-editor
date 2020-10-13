<template>
  <div class="aside-right">
    <div class="aside-right__filter"></div>
    <div class="aside-right__navigator"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.aside-right {
  width: 39px;
  position: relative;
  // background-color: pink;
  border-left: 1px solid #d9d9d9;
  display: flex;
  flex-direction: column;
  &__filter {
    flex: 1;
  }
  &__navigator {
    height: 200px;
    border-top: 1px solid #d9d9d9;
  }
}
</style>
