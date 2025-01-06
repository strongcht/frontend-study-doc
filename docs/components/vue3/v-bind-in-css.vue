<template>
  <div 
    class="box" 
    :class="{active: isClick}"
    @click="handleClick" 
  >
    点我
  </div>
</template>

<script setup>
import { ref } from "vue";

const isClick = ref(false);

const handleClick = () => { 
    isClick.value = !isClick.value
}

</script>

<style scoped>
.box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  background-color: red;
  user-select:none;
}
.active {
  background-color: green;
}

</style>