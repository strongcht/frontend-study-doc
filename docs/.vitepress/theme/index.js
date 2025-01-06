// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import CollapseCode from '../../components/CollapseCode.vue'; // 修改路径以指向你的组件

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('CollapseCode', CollapseCode);
  }
}