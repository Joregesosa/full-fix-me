import { Router } from 'express'
import { createBook, getBook, getBooks } from '../controllers/book.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'
import { authorize } from '../middlewares/authorize.middleware.js'
import { validateBook } from '../middlewares/validate-book.js'

const router: Router = Router()

router.get('/', getBooks)
router.get('/:id', getBook)
router.post('/', verifyToken, authorize('ADMIN'), validateBook, createBook)

export default router
