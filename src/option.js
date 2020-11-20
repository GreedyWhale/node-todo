/*
 * @Description: 处理option的方法集合
 * @Author: MADAO
 * @Date: 2020-11-20 09:59:10
 * @LastEditors: MADAO
 * @LastEditTime: 2020-11-20 12:35:13
 */

const { storagePath } = require('./db')
const log = require('./log')
const inquirer = require('inquirer')
const { read, write } = require('./db')
const { addTodo } = require('./action')

const optionHandlers = {
  todoIndex: 0,
  todoQuestions: [
    {
      name: "name",
      type: "input",
      message: "请输入标题:",
      validate(value) {
        if (!value) { return "请输入标题" }
        return true
      }
    },
    {
      name: "description",
      type: "input",
      message: "请输入描述:"
    }
  ],
  createTodo () {
    inquirer
      .prompt(todoQuestions)
      .then(({ name, description }) => {
        addTodo(name, description);
      });
  },

  askForAction () {
    inquirer
      .prompt({
        type: "rawlist",
        name: "action",
        message: "请选择操作",
        choices: [
          { name: "退出", value: "quit" },
          { name: "已完成", value: "markAsDone" },
          { name: "未完成", value: "markAsUndone" },
          { name: "修改", value: "updateTask" },
          { name: "删除", value: "removeTask" }
        ]
      })
      .then(({ action }) => {
        this.updateTodo(action)
      })
  },

  updateTodo (action) {
    const todoList = read()
    const date = new Date().toLocaleString()
    const changeTodoDone = (isDone) => {
      if (!todoList[this.todoIndex]) { return }
        todoList[this.todoIndex] = Object.assign({}, todoList[this.todoIndex], {
          done: isDone,
          completeDate: isDone ? date : null,
          updateDate: date
        })
        const result = write(JSON.stringify(todoList), true)
        result.succeed
          ? (isDone
              ? log('succeed', `已完成：${todoList[this.todoIndex].name}`)
              : log('fail', `未完成：${todoList[this.todoIndex].name}`))
          : log('fail', `操作失败：${result.message}`)
    }
    const handlers = {
      markAsDone: () => changeTodoDone(true),
      markAsUndone: () => changeTodoDone(false),
      updateTodo: () => {
        inquirer.prompt(todoQuestions)
          .then(({ name, description }) => {
            todoList[this.todoIndex] = Object.assign({}, todoList[this.todoIndex], {
              name,
              description,
              updateDate: date
            })
            const result = write(JSON.stringify(todoList), true)
            result.succeed
              ? log('succeed', `更新完成：${todoList[this.todoIndex].name}`)
              : log('fail', `更新失败：${result.message}`)
          })
      },
      removeTodo: () => {
        todoList.splice(this.todoIndex, 1)
        const result = write(JSON.stringify(todoList), true)
        result.succeed
          ? log('succeed', `删除成功：${todoList[this.todoIndex].name}`)
          : log('fail', `删除失败：${result.message}`)
      }
    }
    handlers[action] && handlers[action]()
  },

  path () {
    log('info', `储存路径：${storagePath}`)
  },

  edit () {
    const todoList = read()
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'index',
          message: "请选择你想要操作的待办事项",
          choices: [
            { name: "退出", value: -1 },
            { name: "添加任务", value: -2 },
            ...todoList.map((todo, index) => ({
              name: `${index + 1 } - ${todo.name} - ${todo.done ? '已完成' : '未完成'}`,
              value: index
            }))
          ]
        }
      ])
      .then(({ index }) => {
        if (index === -2) {
          this.createTodo()
          return
        }
        this.todoIndex = index
        this.askForAction()
      })
  }
}

module.exports = optionHandlers