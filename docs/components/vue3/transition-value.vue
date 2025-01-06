<template>
  {{ output.toFixed(0) }}
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { TransitionPresets, useTransition } from '@vueuse/core';

  const source = ref(0);

  const output = useTransition(source, {
    delay: 5000, // 延时 ms
    duration: 1000, // 执行周期 ms
    disabled: false, // 是否启用过渡效果
    onStarted() {
      // called after the transition starts
    },
    onFinished() {
      // called after the transition ends
    },
    transition: TransitionPresets.easeInOutCubic, // 过渡方式
  });
  function init() {
    source.value = Math.floor(Math.random() * 2000);
  }

  onMounted(() => {
    init();
  });
</script>