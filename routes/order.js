const axios = require('axios');
const { db } = require('../firebase');
const getBalance = require('../lib/getBalance');
const activeAccounts = require('../middlewares/activeAccounts');
const getSignature = require('../signature');
const router = require('express').Router();


router.post('/order', activeAccounts, async (req, res, next) => {
    try {
        const symbol = req.body.symbol;
        const respes = await Promise.all([
            axios.get(`https://api.bybit.com/v2/public/tickers?symbol=${symbol}`),
            db.doc(`leverage/${symbol}`).get()
        ])

        const newData = {
            time_in_force: 'GoodTillCancel',
            reduce_only: false,
            close_on_trigger: false
        }
        const price = respes[0].data.result[0].last_price;
        const leverage = respes[1].data().leverage;
        const ordersRes = [];
        for (let account of req.accounts) {
            const balance = await getBalance(account);
            const qty = (((balance.wallet_balance * 0.90) * leverage) / price).toFixed(3);
            const data = {
                ...account.data,
                ...req.body,
                ...newData,
                qty,
            }
            console.log(qty);
            const sign = getSignature(data, account.secret);
            data.sign = sign;
            const orderRes = await axios.post('https://api.bybit.com/private/linear/order/create', data);
            ordersRes.push(orderRes.data);
        }
        res.status(201).json(ordersRes)
    }
    catch (err) {
        next(err)
    }
})



router.get('/orders', activeAccounts, (req, res, next) => {
    const promises = [];
    for (let account of req.accounts) {
        const params = {
            ...account.data,
            symbol: req.query.symbol
        }
        const sign = getSignature(params, account.secret);
        const url = `https://api.bybit.com/private/linear/order/list?api_key=${params.api_key}&timestamp=${params.timestamp}&sign=${sign}&symbol=BTCUSDT`;
        promises.push(axios.get(url))
    }
    Promise.all(promises)
        .then(responses => {
            const data = responses.map(res => res.data);
            res.status(200).json(data);
        })
        .catch(next)
})

module.exports = router;