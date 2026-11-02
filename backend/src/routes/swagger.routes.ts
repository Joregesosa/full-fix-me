import swaggerUi from 'swagger-ui-express'
import { Router } from 'express'
import swaggerDoc from '../../swagger-output.json' with { type: 'json' }

const router: Router = Router()

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

export default router
