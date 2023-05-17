const axios = require('axios');
const accounts = require('../middlewares/accounts');
const getSignature = require('../signature');
const router = require('express').Router();


router.get('/balance', accounts, async (req, res, next) => {
    try {
        const promises = req.accounts.map(account => {
            const params = {
                coin: 'USDT',
                ...account.data,
            }
            const sign = getSignature(params, account.secret);
            return axios.get(`https://api.bybit.com/v2/private/wallet/balance?api_key=${params.api_key}&coin=USDT&timestamp=${params.timestamp}&sign=${sign}`);
        })
        const responses = await Promise.all(promises);
        const balance = responses.map(res => res.data);
        res.status(201).json(balance);
    }
    catch (err) {
        next(err)
    }
})


module.exports = router;