export const PAGE_TITLE: Record<string, string> = {
  index: '首页',
  login: '登录',
  'register-phone': '手机号注册',
  'register-email': '邮箱注册',
  'forgot-password-phone': '手机号修改密码',
  'forgot-password-email': '邮箱修改密码',
  default: 'IDecs',
};

export const PAGE_ERROR: Record<string | number, any> = {
  401: {
    status: '403',
    title: 401,
    description: '对不起，您暂无权限访问该页面~',
  },
  404: {
    status: '404',
    title: 404,
    description: '对不起，您访问的页面不存在~',
  },
  500: {
    status: '500',
    title: 500,
    description: '系统错误，请联系相关人员~',
  },
};

export const SYSTEM_ERROR = '系统错误，请联系相关人员~';

export const STATUS_ERROR: Record<string, string> = {
  401: '暂无权限操作~',
  504: '网络超时，请稍后再试~',
};

export const RESPONSE_ERROR: Record<string, string> = {
  I_00004: '用户已存在，请更换用户~',
  I_00007: '用户不存在，请更换用户~',
  I_00008: '密码错误，请重新输入~',
  I_00012: '短信验证码发送失败，请稍后重试~',
  I_00013: '未知的短信供应商，请修改配置项~',
  I_00014: '邮箱验证码发送失败，请稍微重试~',
  I_00016: '验证码错误，请重新输入~',
  I_00018: '暂无权限操作~',
};
