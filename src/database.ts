import mongoose from 'mongoose'
import { config } from './config'

(async () => {
    try {
        const database = await mongoose.connect(config.MONGODB_URI, {
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useNewUrlParser: true,
        })
        console.log(`DB is connected to: ${database.connection.name}, in port: ${database.connection.port}`)
    } catch (error) {
        console.log(error)
    }
})()