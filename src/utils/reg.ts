/*
 * 通用正则验证
 */

// 手机号
export const mobileReg = /^1[3|4|5|6|7|8|9](\d){9}$/

// 密码(由字母及数字或特殊字符组成（空格除外），限制8~16个字符)
export const passwordReg =
	/^(?![A-Za-z0-9]+$)(?![a-z0-9\W]+$)(?![A-Z0-9\W]+$)(?![0-9\W]+$)(?![0-9]+$)(?![A-Z0-9]+$)(?![a-z0-9]+$)[a-zA-Z0-9\W]{8,16}$/

// 昵称（字母、汉字、数字或符号（除空格）至少两种以上组成，限制4~10位字符）
export const nickNameReg =
	/^(?!.*\s)(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)(?![\u4e00-\u9fa5]+$).{4,10}$/

// 邮箱
export const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

// 小數或整數
export const floatReg = /^\d*(\.\d*)?$/

// 金额（保留小数点后两位
export const float2Reg = /^\d*(\.\d{0,2})?$/

// 必须是大写字母
export const upperCaseReg = /^[A-Z]+$/

// 金额（保留小数点后两位
export const float4Reg = /^\d*(\.\d{0,4})?$/

// 匹配一个不带小数点的非负整数
export const intReg = /^\d*(?!\.)$/

// 匹配正整数
export const positiveIntReg = /^[0-9]+$/

// 全空格
export const allSpaceReg = /^\s*$/

// 大小写字母和数字
export const alphaAndNumber = /^[0-9a-zA-Z]*$/

// ID 号码格式
export const arcNumberReg = /^[A-Z]{1}[A-Z0-9]{9}$/

// 校验 firstname lastname middlename
export const usernameReg = /^[a-zA-Z.\s_-]{2,}$/

export const phpPhoneNumberRE = /^09\d{9}$/

export const twPhoneNumberRE = /^09\d{8}$/

export const twPhoneNumberWithoutZeroRE = /^9\d{8}$/

export const phpPhoneNumberWithoutZeroRE = /^9\d{9}$/
