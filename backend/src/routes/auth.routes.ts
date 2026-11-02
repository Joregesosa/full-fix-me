import { Router } from 'express'
import { login } from '../controllers/auth.controller.js'
import { validateLogin } from '../middlewares/validate-login.js'

const router: Router = Router()

router.post('/login', validateLogin, login)

export default router
