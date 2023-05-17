const axios = require('axios');
const { db } = require('../firebase');
const accounts = require('../middlewares/accounts');
const getSignature = require('../signature');
const router = require('express').Router();

router.post('/set-leverage', accounts, async (req, res, next) => {
    try {
        const { symbol, leverage } = req.body;
        const promises = [db.doc(`leverage/${symbol}`).set({ leverage: req.body.leverage })]
        req.accounts.forEach(account => {
            const data = {
                ...account.data,
                symbol,
                buy_leverage: leverage,
                sell_leverage: leverage,
            }
            const sign = getSignature(data, account.secret)
            data.sign = sign;
            promises.push(
                axios.post('https://api.bybit.com/private/linear/position/set-leverage', data)
            );
        })
        await Promise.all(promises);
        res.status(201).json({ message: 'Leverage is set' });
    }
    catch (err) {
        console.log(err);
        next(err)
    }
})


module.exports = router;