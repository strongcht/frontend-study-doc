<script>
import { h, defineComponent } from 'vue';
export default defineComponent({
  props: {
    default: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: 0,
    },
    /**
     * 数字的长度，默认是-1，表示数字是什么，给到插槽的内容就是什么
     * 如果有对数字做格式化处理的话，则长度还需要包括格式化后的其他字符
     */
    length: {
      type: Number,
      default: -1,
    },
    /**
     * 如果数字的长度小于leng时，要显示的前缀
     */
    padStart: {
      type: String,
      default: "0",
    },
    dataType: {
      type: String,
      // string array 传递给插槽的值是字符串还是数组
      default: "array",
    },
    format: {
      type: String,
      // thousandSeparated 按千位分隔
      // 默认是无
      default: "",
    },
  },
  data() {
    return {
      currentValue: "",
    };
  },
  methods: {
    startPlay(from, to) {
      from = parseFloat(from);
      if (isNaN(from)) {
        from = 0;
      }

      to = parseFloat(to);
      if (isNaN(to)) {
        to = 0;
      }

      // 第一次计算，则从默认值开始算
      if (!from) {
        from = this.default;
      }

      // 如果正在倒计时，突然值又变化，则从当前值开始变化
      if (this.countInter != undefined && this.countInter != -1) {
        clearInterval(this.countInter);
        this.currentValue = from;
      }

      if (from === to) {
        this.currentValue = to;
        return;
      }

      // 计算2个值的差值
      const interTotalValue = to - from;

      // 区间值，默认是1
      let interValue = 1;

      const INTER_CHANGE_COUNT = 30;

      // 如果大于10，则区间值向下取整
      if (Math.abs(interTotalValue) >= INTER_CHANGE_COUNT) {
        interValue = Math.floor(interTotalValue / INTER_CHANGE_COUNT);
      }

      if (parseInt(interValue) != interValue) {
        interValue = parseFloat(interValue.toFixed(2));
      }

      let interCount = 0;

      if (this.currentValue === "") {
        this.currentValue = 0;
      }

      this.countInter = setInterval(() => {
        interCount++;

        if (interCount >= INTER_CHANGE_COUNT - 1) {
          this.currentValue = to;
        } else {
          this.currentValue += interValue;
        }

        if (parseInt(this.currentValue) != this.currentValue) {
          this.currentValue = parseFloat(this.currentValue.toFixed(2));
        }

        if (this.currentValue == to) {
          clearInterval(this.countInter);
          this.countInter = -1;
        }
      }, 30);
    },
  },
  watch: {
    value: {
      handler(newValue, oldValue) {
        this.startPlay(oldValue, newValue);
      },
      immediate: true,
    },
  },
  render() {
    let currentValueStr = this.currentValue + "";

    if (this.format === "thousandSeparated") {
      const numberFormat = (number) => {
        let res = number.toString().replace(/\d+/, (n) => {
          return n.replace(/(\d)(?=(\d{3})+$)/g, ($1) => {
            return $1 + ",";
          });
        });
        return res;
      };

      currentValueStr = numberFormat(currentValueStr);
    }

    // 如果不足要求的长度，则按照规则前面补0
    if (currentValueStr.length < this.length) {
      currentValueStr = currentValueStr.padStart(this.length, this.padStart);
    }

    if (this.$scopedSlots?.default) {
      if (this.dataType === "array") {
        return this.$scopedSlots.default(currentValueStr.split(""));
      }
    }

    return h(
      "div",
      {
        class: "number-ani-label",
      },
      currentValueStr.split("").map((item) => {
        return h(
          "span",
          {
            class: "number-ani-char",
          },
          item
        );
      })
    );
  },
});
</script>