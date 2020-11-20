/*
 * @Description:
 * @Author: MADAO
 * @Date: 2020-11-19 16:32:46
 * @LastEditors: MADAO
 * @LastEditTime: 2020-11-19 16:33:36
 */

const fs = require('fs')

fs.write('./a.txt', 'fuck', (err) => {
  console.log(err)
})
