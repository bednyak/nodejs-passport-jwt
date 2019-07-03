const express = require('express'),
    router = express.Router();

/**
 * Check service status
 * @return 200 Get service status success
 * @return 500 Get service status failed
 */
router.get('/status', (req, res, next) => {
    res.status(200).json({ status: 'OK' });
});

/**
 * Check service status
 * @return 200 Get service status success
 * @return 500 Get service status failed
 */
router.get('/health', (req, res, next) => {
    res.status(200).json({ health: 'OK' });
});

module.exports = router;
