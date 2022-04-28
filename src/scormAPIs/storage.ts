import multer from 'multer'
import * as config from '../config.json'

const storage = multer({ dest: config.app.bucket, limits: { fileSize: config.filesize } })

export default storage