import express, { json, NextFunction, Request, Response, urlencoded } from 'express'
import moment from 'moment'
import * as config from '../config.json'
import controllers from './routes'
import storage from './storage'
import helmet from 'helmet'
export class ScormAPIs {
    private _expressApp = express()
    constructor() {
        this._expressApp.use(helmet())
        this._expressApp.use(json())
        this._expressApp.use(urlencoded({ extended: true }))
        this._expressApp.get('/healthcheck', (req, res) => {
            res.json({
                serviceType: 'ScormAPI',
                serviceName: config.serviceName,
                timestamp: moment().unix()
            })
        })

        if (config.debug) {
            this._expressApp.get('/test/form', (req, res) => res.send('<form action="/test/submit" method="post" enctype="multipart/form-data"><input type="file" name="scormZip" /><input type="submit" /></form>'))
            this._expressApp.post('/test/submit', storage.single('scormZip'), (req, res) => res.json(req.file))
        }

        for (const controller of controllers) {
            this._expressApp.use('/api/' + controller.route, controller.controller.routes)
        }
    }

    public start() {
        this._expressApp.use((err: any, req: Request, res: Response, next: NextFunction) => {
            res.status(err.status).json(err)
        })
        this._expressApp.listen(config.app.port, config.app.host, () => {
            console.log(moment().format('YYYY/MM/DD HH:mm:ssZ'), `App listening on ${config.app.host} port ${config.app.port}`)
        })
    }
}

export interface ServiceError extends Error {
    status: number,
}