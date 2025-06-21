import { Router } from 'express';

const router = Router();

router.get('/recaptcha-key', (req, res) => {
  res.json({ siteKey: process.env.RECAPTCHA_SITE_KEY });
});

export default router;
