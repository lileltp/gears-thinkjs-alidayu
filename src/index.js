const TopClient = require('topsdk');
const format = require('string-template');

/**
 * 发送短信息
 * @param telephone 接受电话,支持单个或列表
 * @param sign_name 签名名称
 * @param template_code 短息模板
 * @param param 模板使用的参数,String类型
 */
function sendMessage(telephone, sign_name, template_code, param) {
    let deferred = think.defer();
    let config = think.config('alidayu');
    let client = new TopClient(config.appkey, config.appsecret, config.rest_url);
    client.execute('alibaba.aliqin.fc.sms.num.send', {
        'extend': config.business_name,
        'sms_type': 'normal',
        'sms_free_sign_name': sign_name,
        'sms_param': param,
        'rec_num': telephone,
        'sms_template_code': template_code
    }).then(function (result) {
        deferred.resolve(result)
    }).catch(function (error) {
        deferred.reject(error)
    });
    return deferred.promise;
}

/**
 * 发送登录校验短信
 * @param telephone
 * @returns {Promise.<*>}
 */
async function verifyLoginCode(telephone) {
    let config = think.config('alidayu');
    let random = Math.random().toString();
    let code = random.substring(random.length - config.codeLength);
    let param = format(config.verifyLoginCode.param, {code: code, product: config.productName});
    let result = await this.sendMessage(telephone, config.verifyLoginCode.sign_name, config.verifyLoginCode.template_code, param);
    think.cache('sms_' + telephone, code, {
        timeout: config.codeTimeout,
        type: config.cacheType
    });
    return result
}

/**
 * 校验用户的电话和校验码
 * @param telephone
 * @param code
 * @returns {Promise.<boolean>}
 */
async function verifyCode(telephone, code) {
    let config = think.config('alidayu');
    let result = false;
    let vCode = await think.cache('sms_' + telephone, undefined, {type: config.cacheType}).catch(() => {
    });
    if (!think.isEmpty(code) && vCode === code) {
        result = true;
        think.cache('sms_' + telephone, null,{type: config.cacheType});// 使用过后删除
    }
    return result
}

export default {
    sendMessage,
    verifyLoginCode,
    verifyCode
}