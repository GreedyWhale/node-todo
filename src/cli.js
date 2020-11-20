#!/usr/bin/env node
/*
 * @Description: node-todo入口文件
 * @Author: MADAO
 * @Date: 2020-11-19 14:38:12
 * @LastEditors: MADAO
 * @LastEditTime: 2020-11-20 16:01:59
 */

const { program } = require('commander')
const { addTodo, showTodoItems, clearTodo, printStoragePath, editTodo } = require('./action')


program.version('1.0.0')

program
  .command('path')
  .description('output To-do storage path')
  .action(printStoragePath)

program
  .command('edit')
  .description('edit to-do items')
  .action(() => editTodo.edit())

program
  .command('add <name> [description]') // <必传参数> [可选参数]
  .description('Add a new to-do')
  .action(addTodo)

program
  .command('show')
  .description('Show all to-do items')
  .action(showTodoItems)

program
  .command('clear')
  .description('Clear all to-do items')
  .action(clearTodo)

program.parse(process.argv)
