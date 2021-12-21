import multer from 'multer'
import path from 'path'

const diskStorage = multer.diskStorage({
    destination:  process.env.NODE_ENV === 'development' ? './src/images' : './build/images' ,
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

export default multer({ storage: diskStorage })