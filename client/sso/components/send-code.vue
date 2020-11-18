<template lang="pug">
  a-button(type="primary" :loading="loading" :disabled="disabled" @click="handleClick") {{ text }}
</template>

<script lang="ts">
import { computed, defineComponent, ref, reactive, useContext } from '@nuxtjs/composition-api';
import * as Cookies from 'js-cookie';
import { NotifyTypeEnum } from '../../../common/enum/notify.type.enum';

const smsUrl = ['/sms', '/sms/verify'];
const emailUrl = ['/email', '/email/verify'];

export default defineComponent({
  name: 'SendCode',

  props: {
    method: {
      type: String,
      default: 'sms',
      validator: (val: string) => ['sms', 'email'].includes(val),
    },
    value: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      required: true,
      validator: (val: number) => !!NotifyTypeEnum[val],
    },
    beforeSend: {
      type: Function,
      required: true,
    },
  },

  setup(props: any) {
    const { $axios }: any = useContext();

    const timer: any = ref(null);

    const state = reactive({
      time: 0,
    });
    const loading = ref(false);

    const url = computed(() => (props.method === 'sms' ? smsUrl : emailUrl));
    const body = computed(() => ({
      [props.method === 'sms' ? 'phone' : 'email']: props.value,
      type: NotifyTypeEnum[props.type],
    }));

    const disabled = computed(() => state.time > 0);
    const text = computed(() => (state.time > 0 ? `${state.time} 秒后重新获取` : '获取验证码'));

    const start = (time = 60) => {
      state.time = time;
      timer.value = setInterval(() => {
        state.time--;
        if (state.time === 0) {
          reset();
        }
      }, 1000);
    };

    const reset = () => {
      state.time = 0;
      timer.value = null;
    };

    const queryTime = Cookies.get(`IDecs_${props.method}_${NotifyTypeEnum[props.type]}`);
    if (queryTime) {
      const time = Math.round(60 - (+Date.now() - queryTime) / 1000);
      start(time);
    }

    const handleClick = async () => {
      loading.value = true;
      const valid: boolean = await props.beforeSend();
      if (valid) {
        try {
          await $axios.post(url.value[0], body.value);
          Cookies.set(`IDecs_${props.method}_${NotifyTypeEnum[props.type]}`, +Date.now(), { expires: 1 / 24 / 60 });
          start();
          loading.value = false;
        } catch (err) {
          loading.value = false;
        }
      } else {
        loading.value = false;
      }
    };

    const verify = async (val: string) => {
      try {
        await $axios.post(url.value[1], { ...body.value, code: val });
      } catch (err) {
        throw new Error(err);
      }
    };

    return {
      ...state,
      loading,
      disabled,
      text,
      start,
      reset,
      handleClick,
      verify,
    };
  },
});
</script>
