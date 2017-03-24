'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

/**
 * 发送登录校验短信
 * @param telephone
 * @returns {Promise.<*>}
 */
var verifyLoginCode = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(telephone) {
        var config, random, code, param, result;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        config = think.config('alidayu');
                        random = Math.random().toString();
                        code = random.substring(random.length - config.codeLength);
                        param = format(config.verifyLoginCode.param, { code: code, product: config.productName });
                        _context.next = 6;
                        return this.sendMessage(telephone, config.verifyLoginCode.sign_name, config.verifyLoginCode.template_code, param);

                    case 6:
                        result = _context.sent;

                        think.cache('sms_' + telephone, code, {
                            timeout: config.codeTimeout,
                            type: config.cacheType
                        });
                        return _context.abrupt('return', result);

                    case 9:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function verifyLoginCode(_x) {
        return _ref.apply(this, arguments);
    };
}();

/**
 * 校验用户的电话和校验码
 * @param telephone
 * @param code
 * @returns {Promise.<boolean>}
 */


var verifyCode = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(telephone, code) {
        var config, result, vCode;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        config = think.config('alidayu');
                        result = false;
                        _context2.next = 4;
                        return think.cache('sms_' + telephone, undefined, { type: config.cacheType }).catch(function () {});

                    case 4:
                        vCode = _context2.sent;

                        if (!think.isEmpty(code) && vCode === code) {
                            result = true;
                            think.cache('sms_' + telephone, null, { type: config.cacheType }); // 使用过后删除
                        }
                        return _context2.abrupt('return', result);

                    case 7:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function verifyCode(_x2, _x3) {
        return _ref2.apply(this, arguments);
    };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TopClient = require('topsdk');
var format = require('string-template');

/**
 * 发送短信息
 * @param telephone 接受电话,支持单个或列表
 * @param sign_name 签名名称
 * @param template_code 短息模板
 * @param param 模板使用的参数,String类型
 */
function sendMessage(telephone, sign_name, template_code, param) {
    var deferred = think.defer();
    var config = think.config('alidayu');
    var client = new TopClient(config.appkey, config.appsecret, config.rest_url);
    client.execute('alibaba.aliqin.fc.sms.num.send', {
        'extend': config.business_name,
        'sms_type': 'normal',
        'sms_free_sign_name': sign_name,
        'sms_param': param,
        'rec_num': telephone,
        'sms_template_code': template_code
    }).then(function (result) {
        deferred.resolve(result);
    }).catch(function (error) {
        deferred.reject(error);
    });
    return deferred.promise;
}exports.default = {
    sendMessage: sendMessage,
    verifyLoginCode: verifyLoginCode,
    verifyCode: verifyCode
};