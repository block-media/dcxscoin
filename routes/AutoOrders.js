const cron = require('node-cron');
const cronTimeZone = require('../constants/cronTimeZone');
const axios = require('axios');
const { db } = require('../firebase');
const getBalance = require('../lib/getBalance');
const activeAccounts = require('../middlewares/activeAccounts');
const getSignature = require('../signature');
const router = require('express').Router();

const times = [
    { create: "55 9", side: 'long' },
   // { create: "35 10", side: 'short' },
    { create: "00 18", side: 'long' },
   // { create: "35 20", side: 'short' },
    // { create: "0 18", side: 'long' }
]
 
const handler = async () => {
    for (let time of times) {
        cron.schedule(`${time.create} * * *`, async () => {
            console.log(time)
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
                console.log(new Date())
                console.log(err)
            }
        }, cronTimeZone)
    }
}


handler();
