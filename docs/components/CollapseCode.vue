<template>
  <div class="collapse-code">
    <div @click="handleToggle" class="toggle">{{ isOpen ? 'Hide' : 'Show' }}</div>
    <div v-if="isOpen" class="code">
      <div class="copy" :class="{ 'copied': isCopyed }" title="Copy Code" @click="handleCopy">
        <div v-if="isCopyed" class="is-copied">copied</div>
      </div>
      <pre v-html="highlightedCode"></pre>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';  // 引入 Prism 的 CSS 样式

export default {
  props: {
    code: {
      type: String,
      required: true
    },
    lang: {
      type: String,
      default: 'text'
    }
  },
  setup(props) {
    const isOpen = ref(false);
    const isCopyed = ref(false);

    const highlightedCode = computed(() => {
      return Prism.highlight(props.code, Prism.languages[props.lang], props.lang);
    });

    const handleToggle = () => {
      isOpen.value = !isOpen.value;
    };

    const handleCopy = () => {
      isCopyed.value = true;
      setTimeout(() => {
        isCopyed.value = false;
      }, 1500);
      navigator.clipboard.writeText(props.code);
    };

    return {
      isOpen,
      isCopyed,
      highlightedCode,
      handleToggle,
      handleCopy
    };
  }
};
</script>

<style scoped lang="less">
.collapse-code {
  position: relative;
  border: 1px solid #eaeaea;
  padding: 10px;
  min-height: 58px;
  border-radius: 10px;
}

.toggle {
  position: absolute;
  top: 15px;
  right: 10px;
  width: 60px;
  height: 28px;
  line-height: 28px;
  background: var(--vp-c-indigo-3);
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  text-align: center;
  user-select: none;

  &:hover {
    cursor: pointer;
  }
}

.code {
  position: relative;
  transition: all .3s linear;

  &:hover {
    .copy {
      opacity: 1;
    }
  }
}

.copy {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 3;
  border: 1px solid var(--vp-code-copy-code-border-color);
  border-radius: 4px;
  width: 40px;
  height: 40px;
  background-color: var(--vp-code-copy-code-bg);
  opacity: 0;
  cursor: pointer;
  background-image: var(--vp-icon-copy);
  background-position: 50%;
  background-size: 20px;
  background-repeat: no-repeat;
  transition: border-color 0.25s, background-color 0.25s, opacity 0.25s;
}

.is-copied {
  transform: translate(-60px, 5px);
}

.copied {
  background-image: var(--vp-icon-copied);
}

pre {
  margin-top: 36px;
  background: transparent;
  padding: 1em;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
