import { Router } from 'express'
import { addLoan, getLoan, getMyLoans } from '../controllers/loan.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'
import { authorize } from '../middlewares/authorize.middleware.js'
import { validateLoan } from '../middlewares/validate-loan.js'

const router: Router = Router()

router.post('/', verifyToken, authorize('MIEMBRO'), validateLoan, addLoan)
router.get('/:id', verifyToken, authorize('MIEMBRO', 'ADMIN'), getLoan)
router.get('/me', verifyToken, authorize('MIEMBRO'), getMyLoans)

export default router
