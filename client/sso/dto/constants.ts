import { StringKeyAndValue } from './types';

export const SYSTEM_ERROR = '服务器发生错误，请联系相关人员~';

export const STATUS_ERROR: StringKeyAndValue = {
  401: '暂无权限操作~',
  504: '网络超时，请稍后再试~',
};

export const RESPONSE_ERROR: StringKeyAndValue = {
  I_00004: '用户已存在，请更换用户~',
  I_00007: '用户不存在，请更换用户~',
  I_00008: '密码错误，请重新输入~',
  I_00012: '短信验证码发送失败，请稍后重试~',
  I_00013: '未知的短信供应商，请修改配置项~',
  I_00014: '邮箱验证码发送失败，请稍微重试~',
  I_00016: '验证码错误，请重新输入~',
};
