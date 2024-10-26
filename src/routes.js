import { Router } from 'express'
import UserController from './app/controllers/Usercontroller'
import SessionController from './app/controllers/SessionController'

const routes = new Router()

routes.post('/users', UserController.store)
routes.post('/session', SessionController.store)

export default routes