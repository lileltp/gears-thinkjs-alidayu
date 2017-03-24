## 用于thinkjs中使用阿里大于发送短信息


## Install
npm i gears_ts_alidayu

## Config
在common/config中添加alidayu.js

```
export  default {
  appkey: 'appkey',
  appsecret: 'appsecret',
  rest_url:'http://gw.api.taobao.com/router/rest',
  business_name:'gears',
  /**
   * sign_name:签名名称
   * template_code:模板编号
   * param:参数json字符串
   */
  productName: '发送短息公司名或产品名',
  verifyLoginCode: {sign_name: '登录验证', template_code: 'SMS_57120230', param: '{code:"{code}",product:"{product}"}'},
  codeLength: 4,
  codeTimeout: 15 * 60,
  cacheType:'file'// 使用thinkjs缓存
}
```

```
/**
 * 发送短信息
 * @param telephone 接受电话,支持单个或列表
 * @param sign_name 签名名称
 * @param template_code 短息模板
 * @param param 模板使用的参数,String类型
 */
function sendMessage(telephone, sign_name, template_code, param)

/**
 * 发送登录校验短信
 * @param telephone
 * @returns {Promise.<*>}
 */
async function verifyLoginCode(telephone)

/**
 * 校验用户的电话和校验码
 * @param telephone
 * @param code
 * @returns {Promise.<boolean>}
 */
async function verifyCode(telephone, code)

```