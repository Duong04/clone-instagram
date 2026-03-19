import { Router } from 'express'
import multer from 'multer'
import mediaController from '~/controllers/media.controller'

const upload = multer({ storage: multer.memoryStorage() })

const router = Router()

router.post('/upload', upload.single('file'), mediaController.uploadOne)
router.post('/upload-multiple', upload.array('files'), mediaController.uploadMany)
router.delete('/upload-multiple', mediaController.deleteMany)
router.delete('/:id', mediaController.deleteOne)

export default router
