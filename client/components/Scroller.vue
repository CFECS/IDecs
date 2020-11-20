<template>
  <div ref="scroller" class="id-scroller">
    <div ref="content" class="id-scroller-content" :style="{ width: contentWidth }">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'nuxt-property-decorator';
import BScroll from 'better-scroll';

@Component
export default class Scroller extends Vue {
  @Prop({ type: Boolean, default: false })
  scrollbar = false;

  @Prop({ type: Boolean, default: false })
  scrollX = false;

  @Prop({ type: Boolean, default: true })
  scrollY = true;

  @Prop({ type: Number, default: 10 })
  offset = 10;

  public scroller: any = null;
  public contentWidth = '0px';

  mounted() {
    this.init();
  }

  destroyed() {
    this.scroller.destroy();
    this.scroller = null;
  }

  public init() {
    const content: any = this.$refs.content;
    if (!this.$refs.scroller) return;
    if (this.scrollX && content.scrollWidth > content.offsetWidth) {
      this.contentWidth = content.scrollWidth + 'px';
    }
    const options = {
      bounce: false,
      probeType: 3,
      preventDefault: false,
      scrollX: this.scrollX,
      scrollY: this.scrollY,
      scrollbar: this.scrollbar || { fade: false, interactive: true },
      mouseWheel: {
        speed: 20,
        easeTime: 100,
      },
    };
    this.$nextTick(() => {
      const scroller: any = this.$refs.scroller;
      this.scroller = new BScroll(scroller, options);
      this.scroller.on('scroll', this.scroll);
      this.scroller.on('scrollEnd', this.scrollEnd);
    });
  }

  public scroll(index: any) {
    this.$emit('scroll', index);
    if (index.y - this.offset <= this.scroller.maxScrollY) {
      this.$emit('will-end', index.y);
    }
  }

  public scrollEnd(index: any) {
    this.$emit('scroll-end', index);
  }

  public disable() {
    this.scroller.disable();
  }

  public enable() {
    this.scroller.enable();
  }

  public refresh() {
    this.scroller.refresh();
  }

  public scrollTo() {
    this.scroller.scrollTo.apply(this.scroll, arguments);
  }

  public scrollToElement() {
    this.scroller.scrollToElement.apply(this.scroller, arguments);
  }

  public destroy() {
    this.scroller.destroy();
  }
}
</script>

<style lang="less">
.id-scroller {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  white-space: nowrap;

  &-content {
    min-width: 100%;
    min-height: 100%;
  }
}

.bscroll-horizontal-scrollbar,
.bscroll-vertical-scrollbar {
  z-index: 99 !important;
}

.bscroll-indicator {
  background-color: rgba(0, 0, 0, 0.1) !important;
  border: none !important;
  cursor: pointer;
  margin-left: 1px;
}
</style>
