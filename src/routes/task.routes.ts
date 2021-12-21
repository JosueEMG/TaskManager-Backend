import { Router } from 'express'
const router = Router()
import * as taskController from '../controllers/task.controller'
import upload from '../helpers/upload'

router.get('/tasks', taskController.getTasks)
router.get('/tasks/:id', taskController.getTask)
router.post('/tasks', upload.single('image'), taskController.createTask)
router.put('/tasks/:id', upload.single('image'), taskController.updateTask)
router.delete('/tasks/:id', taskController.deleteTask)


export default router