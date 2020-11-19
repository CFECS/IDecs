<template>
  <a-button type="primary" :loading="loading" :disabled="disabled" @click="handleClick">{{ text }}</a-button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import * as Cookies from 'js-cookie';
import { NotifyTypeEnum } from '../../../common/enum/notify.type.enum';
import { SMSRequestURLEnum, EmailRequestURLEnum } from '../types/dto';

@Component
export default class SendCode extends Vue {
  @Prop({ default: 'sms' })
  method!: string;

  @Prop({ required: true })
  value!: string;

  @Prop({ required: true, validator: (val: number) => !!NotifyTypeEnum[val] })
  type!: number;

  @Prop({ type: Function, required: true })
  beforeSend!: any;

  timer: any = null;

  time = 0;

  loading = false;

  get RequestURL(): any {
    return this.method === 'sms' ? SMSRequestURLEnum : EmailRequestURLEnum;
  }

  get RequestBody(): any {
    return {
      [this.method === 'sms' ? 'phone' : 'email']: this.value,
      type: NotifyTypeEnum[this.type],
    };
  }

  get disabled(): boolean {
    return this.time > 0;
  }

  get text(): string {
    return this.time > 0 ? `${this.time} 秒后重新获取` : '获取验证码';
  }

  mounted() {
    const queryTime: any = Cookies.get(`IDecs_${this.method}_${NotifyTypeEnum[this.type]}`);
    if (queryTime) {
      const time = Math.round(60 - (+Date.now() - Number(queryTime)) / 1000);
      this.start(time);
    }
  }

  start(time = 60): void {
    this.time = time;
    this.timer = setInterval(() => {
      this.time--;
      if (this.time === 0) {
        this.reset();
      }
    }, 1000);
  }

  reset(): void {
    this.time = 0;
    this.timer = null;
  }

  async handleClick() {
    this.loading = true;
    const valid: boolean = await this.beforeSend();
    if (valid) {
      try {
        await this.$axios.post(this.RequestURL.SEND, this.RequestBody);
        Cookies.set(`IDecs_${this.method}_${NotifyTypeEnum[this.type]}`, String(+Date.now()), {
          expires: 1 / 24 / 60,
        });
        this.start();
        this.loading = false;
      } catch (err) {
        this.loading = false;
      }
    } else {
      this.loading = false;
    }
  }
}
</script>
