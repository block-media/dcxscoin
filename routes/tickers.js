const axios = require('axios');
const router = require('express').Router();

router.get('/tickers', (req, res) => {
    axios.get(`https://api.bybit.com/v2/public/tickers?symbol=${req.query.symbol}`)
        .then(r => res.json(r.data))
        .catch(err => res.json(err))
})

module.exports = router;