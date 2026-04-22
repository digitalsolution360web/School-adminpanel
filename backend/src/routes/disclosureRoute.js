import express from 'express';
import { getDisclosure, addDisclosure, updateDisclosure, deleteDisclosure } from '../controllers/disclosureController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadToR2 } from '../config/r2.js';

const router = express.Router();

router.route('/')
    .get(getDisclosure)
    .post(protect, admin, uploadToR2('disclosure').single('file'), addDisclosure);

router.route('/:id')
    .put(protect, admin, uploadToR2('disclosure').single('file'), updateDisclosure)
    .delete(protect, admin, deleteDisclosure);

export default router;