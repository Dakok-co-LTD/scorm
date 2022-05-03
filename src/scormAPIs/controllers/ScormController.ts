import express, { NextFunction, Request, Response } from 'express'
import mime from 'mime'
import { ServiceError } from '..'
import storage from '../storage'
import { AbstractController } from './AbstractController'
import fs from 'fs/promises'
import * as config from '../../config.json'
import unzip from '@slimio/unzipper'
import path from 'path'
import moment from 'moment'

export class ScormController extends AbstractController {
    constructor() {
        super()
        this._router.post(
            '/',
            storage.single('file'),
            (req, res, next) => this.fileUpload(req, res, next)
        )
        this._router.use(
            '/files',
            express.static(path.join(process.cwd(), config.app.scorm_path))
        )
    }

    private async fileUpload(req: Request, res: Response, next: NextFunction) {
        try {

            if (req.file?.mimetype && mime.extension(req.file?.mimetype) == 'zip') {
                res.json({
                    status: 'extracting',
                    key: req.file.filename,
                    path: `/api/scorm/files/${req.file.filename}`
                })
                console.log('is zip')
                this.unzip(req.file).catch(e => console.error(moment().format('YYYY/MM/DD HH:mm:ssZ'), e.message))

            } else {
                throw {
                    status: 400,
                    message: 'FileNotSupported'
                } as ServiceError
            }

        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        catch (error: any) {
            next({
                status: 400,
                message: error.message,
                stack: error.stack
            } as ServiceError)
        }
    }

    private async unzip(file: Express.Multer.File) {
        console.log(moment().format('YYYY/MM/DD HH:mm:ssZ'), 'Start unzip', file.path)
        await fs.mkdir(path.join(process.cwd(), config.app.scorm_path, file.filename))
        await unzip(
            file.path,
            {
                dir: path.join(process.cwd(), config.app.scorm_path, file.filename),
                log: true
            }
        )
        console.log(moment().format('YYYY/MM/DD HH:mm:ssZ'), 'Unzipped', file.path)
    }

}