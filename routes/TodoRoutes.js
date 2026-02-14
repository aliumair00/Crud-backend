import express from 'express'
import { createTodo, getTodos, getTodoById, updateTodoById, toggleTodoStatus, deleteTodoById } from '../controllers/todoController.js'

const route = express.Router()
//Create Todo
route.post('/add', createTodo)

//get Todos
route.get('/', getTodos)

//get single todo by id
route.get('/:id', getTodoById)

//update todo by id
route.put('/:id', updateTodoById)

//toggle todo status by id
route.patch('/:id/toggle', toggleTodoStatus)
//delete todo by id
route.delete('/:id', deleteTodoById)

export default route
