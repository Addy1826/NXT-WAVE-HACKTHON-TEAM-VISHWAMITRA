import express from 'express';
import { getTherapists, requestTherapist } from '../controllers/therapistController';

const router = express.Router();

router.get('/', getTherapists);
router.post('/request', requestTherapist);

export default router;
