<template>
  <div class="collapse-code">
    <button @click="toggle">{{ isOpen ? 'Hide' : 'Show' }} Code</button>
    <div v-if="isOpen">
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

    const highlightedCode = computed(() => {
      return Prism.highlight(props.code, Prism.languages[props.lang], props.lang);
    });

    const toggle = () => {
      isOpen.value = !isOpen.value;
    };

    return {
      isOpen,
      highlightedCode,
      toggle
    };
  }
};
</script>

<style scoped>
.collapse-code {
  border: 1px solid #eaeaea;
  padding: 1em;
  margin-bottom: 1em;
}

button {
  background: #007acc;
  border: none;
  color: white;
  padding: 0.5em 1em;
  cursor: pointer;
}

button:hover {
  background: #005f99;
}

pre {
  background: #f5f5f5;
  padding: 1em;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
