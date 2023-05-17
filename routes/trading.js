const axios = require('axios');
const getSignature = require('../signature');
const router = require('express').Router();
const activeAccounts = require('../middlewares/activeAccounts');

router.put('/trading', activeAccounts, async (req, res) => {
    try {
        const promises = [];
        const take_profit = +req.body.take_profit;
        const stop_loss = +req.body.stop_loss;
        const { side, symbol } = req.body;
        for (let account of req.accounts) {
            account.data.timestamp = Date.now();
            const data = {
                ...account.data,
                symbol,
                side
            }
            if (take_profit && take_profit > 0) data.take_profit = take_profit
            if (stop_loss && stop_loss > 0) data.stop_loss = stop_loss;
            const sign = getSignature(data, account.secret);
            data.sign = sign;
            const url = `https://api.bybit.com/private/linear/position/trading-stop`;
            promises.push(axios.post(url, data))
        }
        const resps = await Promise.all(promises);
        const data = resps.map(res => res.data);
        res.status(200).json(data);
    }
    catch (err) {
        res.status(401).json({ message: 'Something went wrong!' })
    }
})

module.exports = router;