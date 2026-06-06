import { Router } from 'express';
import { initiatePayment, handleNotification } from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/initiate', authenticate, initiatePayment);
router.post('/notify', handleNotification);  

export default router;