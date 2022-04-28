import { Router } from 'express'

export class AbstractController {
    protected _router = Router()

    public get routes() {
        return this._router
    }
}