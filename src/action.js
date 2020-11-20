/*
 * @Description: 命令、选项处理函数
 * @Author: MADAO
 * @Date: 2020-11-19 14:58:50
 * @LastEditors: MADAO
 * @LastEditTime: 2020-11-20 14:45:01
 */
const inquirer = require('inquirer')
 const { write, read, clear, storagePath } = require('./db')
const log = require('./log')

const addTodo = (name, description = '') => {
  const date = new Date().toLocaleString()
  const todo = {
    name,
    description,
    done: false,
    createDate: date,
    updateDate: date,
    completeDate: null
  }
  log('start', '创建中...')
  const result = write(todo)
  result.succeed ? log('succeed', `创建成功，储存路径是: ${storagePath}`) : log('fail', `创建失败: ${result.message}`)
}

const consoleTodoInfo = item => {
  console.log('\n')
  console.log(`待办事项：${item.name}`)
  console.log(`描述：${item.description || ""}`)
  console.log(`状态：${item.done ? "完成" : "未完成"}`)
  console.log(`创建日期：${item.createDate}`)
  console.log(`更新日期：${item.updateDate}`)
  console.log(`完成日期：${item.completeDate}`)
  console.log("-".repeat(30))
};

const showTodoItems = () => {
  const todoList = read()
  if (todoList.length) {
    todoList.forEach(todo => consoleTodoInfo(todo))
  }
}

const clearTodo = () => clear()

const printStoragePath = () => log('info', `储存路径：${storagePath}`)

const editTodo = {
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
      .prompt(this.todoQuestions)
      .then(({ name, description }) => {
        addTodo(name, description);
      });
  },

  askForAction () {
    inquirer
      .prompt({
        type: "list",
        name: "action",
        message: "请选择操作",
        choices: [
          { name: "退出", value: "quit" },
          { name: "已完成", value: "markAsDone" },
          { name: "未完成", value: "markAsUndone" },
          { name: "修改", value: "updateTodo" },
          { name: "删除", value: "removeTodo" }
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
        const result = write(todoList)
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
        inquirer.prompt(this.todoQuestions)
          .then(({ name, description }) => {
            todoList[this.todoIndex] = Object.assign({}, todoList[this.todoIndex], {
              name,
              description,
              updateDate: date
            })
            const result = write(todoList)
            result.succeed
              ? log('succeed', `更新完成：${todoList[this.todoIndex].name}`)
              : log('fail', `更新失败：${result.message}`)
          })
      },
      removeTodo: () => {
        todoList.splice(this.todoIndex, 1)
        const result = write(todoList)
        result.succeed
          ? log('succeed', '删除成功')
          : log('fail', `删除失败：${result.message}`)
      }
    }
    handlers[action] && handlers[action]()
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
        switch (true) {
          case index === -2:
            this.createTodo()
            break;
          case index >= 0:
            this.todoIndex = index
            this.askForAction()
            break;
          default:
            break
        }
      })
  }
}

module.exports = {
  addTodo,
  showTodoItems,
  clearTodo,
  editTodo,
  printStoragePath
}
