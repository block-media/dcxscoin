const { auth } = require('../firebase');
const router = require('express').Router();


router.post('/login', (req, res, next) => {
    auth.signInWithEmailAndPassword(req.body.email, req.body.password)
        .then(r => res.status(200).json(r))
        .catch(next)
})

module.exports = router;