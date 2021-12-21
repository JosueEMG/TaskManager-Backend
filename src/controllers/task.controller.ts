import { RequestHandler } from "express"
import Task from '../models/Task'
import fs from 'fs/promises'
import cloudinary from 'cloudinary'

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const handleError = (e: any) => {

    if (e.message === 'The extention is not supported') {
        return 'El archivo subido no está soportado'
    }
    else

    if (e.message === 'The size is long') {
        return 'El archivo es muy pesado (3MB como máximo)'
    }
    else

    if (e.message === "Cannot read property 'path' of undefined") {
        return 'Seleccione un archivo'
    }
    else

    if (e.message === 'Upload failed') {
        return 'Error al subir el archivo, posiblemente sea su conexión a Internet'
    }
}

export const getTasks: RequestHandler = async (req, res) => {
    const tasksFound = await Task.find()
    res.json(tasksFound)
}

export const getTask: RequestHandler = async (req, res) => {

    try {
        const taskFound = await Task.findById(req.params.id)
        taskFound ? res.json(taskFound) : res.json({message: `Task doesn't exists`})
    } catch (error) {
        res.json({
            message: error.message
        })
    }
    
}

export const createTask: RequestHandler = async (req, res) => {

    const { title, content } = req.body

    const tempPath = req.file?.path
    const size = req.file?.size

    const taskFound = await Task.findOne({title})

    if (tempPath != undefined) {

        if (!taskFound) {

            try {     
                if (req.file?.mimetype === 'image/png' || req.file?.mimetype === 'image/jpeg' || req.file?.mimetype === 'image/gif' || req.file?.mimetype === 'image/jpg') {
        
                    if (size != undefined && size <= 1024 * 1024 * 3) {
        
                        try{
                            const upload = await cloudinary.v2.uploader.upload(tempPath)
                            console.log(upload)
        
                            const newTask = new Task({
                                title,
                                content,
                                image: cloudinary.v2.url(upload.public_id, { width: 250, height: 250, crop: "scale", quality: "auto:low", flags: "lossy", secure: "true" })
                            })
    
                            await fs.unlink(tempPath)
                            await newTask.save()
                            res.json({
                                message: 'Task saved'
                            })
                            
                        } catch(error) {
    
                            throw Error('Upload failed')
                        }            
                    } else {
        
                        await fs.unlink(tempPath)
                        throw Error('The size is long')
                    }
                }
                else {
        
                    await fs.unlink(tempPath)
                    throw Error('The extention is not supported')
                }
              
            } catch (error) {
        
                const errors = handleError(error)
        
                res.json({
                    errors
                })
            }
        } else {
            await fs.unlink(tempPath)
            res.json({
                errors: `Can't be saved because the task: '${taskFound.title}' is already exists`
            })
        }
    }
    
}

export const updateTask: RequestHandler = async (req, res) => {
    
    const { title, content } = req.body

    console.log(req)

    const tempPath = req.file?.path
    const size = req.file?.size

    const taskFound = await Task.findOne({title})

    if (tempPath != undefined) {

        if (!taskFound) {

            try {     
                if (req.file?.mimetype === 'image/png' || req.file?.mimetype === 'image/jpeg' || req.file?.mimetype === 'image/gif' || req.file?.mimetype === 'image/jpg') {
        
                    if (size != undefined && size <= 1024 * 1024 * 3) {
        
                        try{
                            const upload = await cloudinary.v2.uploader.upload(tempPath)
                            console.log(upload)
        
                            await Task.findByIdAndUpdate(req.params.id, {
                                title,
                                content,
                                image: cloudinary.v2.url(upload.public_id, { width: 300, height: 300, crop: "scale", quality: "auto", flags: "lossy", secure: "true" })
                            })
    
                            await fs.unlink(tempPath)
                            res.json({
                                message: 'Task updated'
                            })
                            
                        } catch(error) {
    
                            throw Error('Upload failed')
                        }            
                    } else {
        
                        await fs.unlink(tempPath)
                        throw Error('The size is long')
                    }
                }
                else {
        
                    await fs.unlink(tempPath)
                    throw Error('The extention is not supported')
                }
              
            } catch (error) {
        
                const errors = handleError(error)
        
                res.json({
                    errors
                })
            }
        } else {
            await fs.unlink(tempPath)
            res.json({
                errors: `Can't be saved because the task: '${taskFound.title}' is already exists`
            })
        }
    }
    
}

export const deleteTask: RequestHandler = async (req, res) => {
    try {
        const taskDeleted = await Task.findByIdAndDelete(req.params.id)
        taskDeleted ? res.json({message: 'Task deleted'}) : res.json({message: `Task doesn't exists`})
    } catch (error) {
        res.json({
            message: error.message
        })
    }
    
}
