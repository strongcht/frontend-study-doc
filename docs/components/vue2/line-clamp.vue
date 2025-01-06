<template>
 <div class="ellipsis-contanier">
  <h2>超过指定行显示省略号</h2>

  <p>单行省略</p>
  <div class="singe-line box" :title="content">
    {{ content }}
  </div>
  <p>三行省略</p>
  <div class="box">
    <div class="three-line" :title="content">
      {{ content }}
    </div>
  </div>
 </div>
</template>

<script>

export default {
  data () {
    return {
      content: `这是一段 CSS 样式代码，通常用于控制文本的显示方式。具体解释如下这段代码通常用于实现文本溢出省略的效果，例如在新闻摘要、卡片标题等场景中常见。请注意，这些样式属性在不同的浏览器和设备上可能会有不同的兼容性问题，您需要根据具体情况进行测试和调整。`,
    }
  }
}
</script>


<style lang="less" scoped>
.ellipsis-contanier {
  .box {
    width: 500px;
    border: 1px solid red;
    padding: 10px;
    line-height: 24px;
  }

  .singe-line {
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    white-space: nowrap;
  }
  .three-line {
    word-break: break-all;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
}
</style>