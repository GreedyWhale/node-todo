/*
 * @Description: 打印信息方法
 * @Author: MADAO
 * @Date: 2020-11-20 10:01:24
 * @LastEditors: MADAO
 * @LastEditTime: 2020-11-20 11:05:41
 */
const ora = require('ora')
const spinner = ora()
const logText = (text) => `[Todo] ${text}`

const log = (method, message) => {
  spinner[method](logText(message))
}

module.exports = log
