import { Router } from 'express'
import { getUsers, getUserById } from '../controllers/userController.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

const router = Router()

router.get('/', asyncHandler(getUsers))
router.get('/:id', asyncHandler(getUserById))

export default router
