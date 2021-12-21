import { Schema, model } from 'mongoose'
import { TaskInterface } from '../interfaces/TaskInterface'

const taskSchema = new Schema<TaskInterface>({
    title: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    content: {
        type: String,
        require: true,
        trim: true
    },
    image: {
        type: String,
        default: 'https://www.publicdomainpictures.net/pictures/240000/velka/hands-holding-task-word.jpg'
    }
}, {
    timestamps: true,
    versionKey: false
})

export default model('task', taskSchema)