/*
 * @Description: 操作文件相关方法
 * @Author: MADAO
 * @Date: 2020-11-19 15:22:27
 * @LastEditors: MADAO
 * @LastEditTime: 2020-11-20 14:42:09
 */
const fs = require('fs')
const os = require('os')
const path = require('path')
const log = require('./log')

const storagePath = path.join(process.env.HOME || os.homedir(), '.node-todo')

const isExists = () => {
  const result = fs.existsSync(storagePath)
  !result && log('info', '暂无待办事项')
  return result
}

const write = (data) => {
  const result = {
    message: '',
    succeed: false
  }
  try {
    let todoList = []
    if (Array.isArray(data)) {
      todoList = data
    } else {
      todoList = read()
      todoList.push(data)
    }
    fs.writeFileSync(storagePath, JSON.stringify(todoList), { flag: 'w' })
    result.succeed = true
  } catch (error) {
    result.message = error.message
  }
  return result
}

const read = () => {
  let result = []
  if (!isExists()) {
    return result
  }
  log('start', '读取中...')
  try {
    result = JSON.parse(fs.readFileSync(storagePath, { flag: 'r' }))
    !result.length ? log('info', '暂无待办事项') : log('succeed', '读取成功')
  } catch (error) {
    log('fail', `读取失败: ${error.message}`)
  }
  return result
}


const clear = () => {
  if (!isExists()) { return }
  try {
    log('start', '清除中...')
    fs.unlinkSync(storagePath)
    log('succeed', '清除成功')
  } catch (error) {
    log('fail', `清除失败: ${error.message}`)
    log('fail', `请手动删除: ${storagePath}`)
  }
}
module.exports = {
  write,
  read,
  clear,
  storagePath
}
