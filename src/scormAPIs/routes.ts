import { AbstractController } from './controllers/AbstractController'
import { ScormController } from './controllers/ScormController'

const controllers: Array<{ route: string, controller: AbstractController }> = [
    {
        route: 'scorm',
        controller: new ScormController()
    }
]

export default controllers