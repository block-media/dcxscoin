const axios = require('axios');
const getSignature = require('../signature');

const getBalance = async (account, timestamp = Date.now()) => {
    const params = {
        ...account.data,
        coin: 'USDT',
        timestamp,
    }
    const sign = getSignature(params, account.secret);
    const res = await axios.get(`https://api.bybit.com/v2/private/wallet/balance?api_key=${params.api_key}&coin=USDT&timestamp=${params.timestamp}&sign=${sign}`)
    return res.data.result ? res.data.result.USDT : res.data;
}

module.exports = getBalance;