const axios = require('axios');
const getBalance = require('../lib/getBalance');
const activeAccounts = require('../middlewares/activeAccounts');
const getSignature = require('../signature');
const router = require('express').Router();


router.get('/position', activeAccounts, async (req, res, next) => {
    try {
        const { symbol, isAllPositions = false, isBalance = false } = req.query
        const positions = [];
        for (let account of req.accounts) {
            account.data.timestamp = Date.now()
            const params = {
                ...account.data,
                symbol: symbol
            }
            const sign = getSignature(params, account.secret);
            const url = `https://api.bybit.com/private/linear/position/list?api_key=${params.api_key}&symbol=${symbol}&timestamp=${params.timestamp}&sign=${sign}`
            const promises = [axios.get(url)];
            if (isBalance) promises.push(getBalance(account));
            const resps = await Promise.all(promises);
            const position = resps[0].data;
            const posRes = position.result;
            const results = [];
            if (posRes) {
                for (let k = 0; k < posRes.length; k++) {
                    const result = posRes[k];
                    if ((result.position_value / result.leverage) > 0) results.push(result);
                }
            }
            if (results.length > 0 || isAllPositions) {
                position.result = results;
                if (isBalance) position.balance = resps[1];
                position.account = account.account;
                position.owner = account.owner;
                position.exchange = account.exchange;
                positions.push(position);
                position.status = account.status;
            }
        }
        const price = await axios.get(`https://api.bybit.com/v2/public/tickers?symbol=${symbol}`);
        res.status(200).json({ positions, price: price.data.result[0] })
    }
    catch (err) {
        res.status(501).json(err)
    }
})


module.exports = router;