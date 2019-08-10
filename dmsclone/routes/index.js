const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).render('main', {user1:req.user});
});

module.exports = router;
