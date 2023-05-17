const axios = require('axios');
const { db } = require('../firebase');
const getSignature = require('../signature');
const router = require('express').Router();

//Create, List and Cancel Orders
const CronJob = require('cron').CronJob;

const job = new CronJob('50 * * * *', async function () {
 async function run() {
  const vtaccount = await db.collection('accounts').where('status', '==', 'active').get()

    const vRows = vtaccount.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));

    const vErrors = [];
    const vOrders = [];

    for (let account of vRows) {
        const vPosition = await getPosition(account);       

        if (vPosition.length <= 0) {
            //console.log("CREAR CUENTA: "  + account.api);
        
             const vOrder = await postOrder(account);
            // console.log(vOrder);
             vOrders.push(vOrder);
        } else 
        {
            //console.log("NO CREAR CUENTA: " + account.api);
            vErrors.push("NO CREAR CUENTA: " + account.api);
        }

        //lb.push(vBalance);
    }

  
    console.log("ORDENES CREADAS", vOrders);
    console.log("ERRORES", vErrors);
  }

async function getBalance(account, timestamp = Date.now())  {
    try {
        const params = {
            api_key: account.api,
            coin: 'USDT',
            timestamp,
        }

        const sign = getSignature(params, account.secret);
      
        const res = await axios.get(`https://api.bybit.com/v2/private/wallet/balance?api_key=${account.api}&coin=USDT&timestamp=${params.timestamp}&sign=${sign}`)
  
        return res.data.result ? res.data.result.USDT : res.data;
    }     
    catch (err) {
        console.log(err);
    }

    return null;
}

async function getPosition(account, timestamp = Date.now()) {
    const positions = [];

    try {
        const symbol = "BTCUSDT";  
        const isBalance = false;
        
        const params = {
            api_key: account.api,
            timestamp: Date.now(),
            symbol: symbol
        }
        
        const sign = getSignature(params, account.secret);
        const url = `https://api.bybit.com/private/linear/position/list?api_key=${params.api_key}&symbol=${symbol}&timestamp=${params.timestamp}&sign=${sign}`
        //const url = `https://api.bybit.com/v5/position/list?category=linear&api_key=${params.api_key}&symbol=${symbol}&settleCoin=${params.settleCoin}&timestamp=${params.timestamp}&sign=${sign}`
        const promises = [axios.get(url)];
            if (isBalance) promises.push(getBalance(account));
            const resps = await Promise.all(promises);
            const position = resps[0].data;
            const posRes = position.result;
            
            if (posRes) {
                
                for (let k = 0; k < posRes.length; k++) {
                    const result = posRes[k];
                    
                    if (result.position_value > 0 && result.side == "Buy") { 
                        positions.push(result);
                    }
                }
            }      

    }
    catch (err) {
        console.log(err);
    }

    return positions;
}
 async function postOrder(account, timestamp = Date.now()) {
try {
    const symbol = "BTCUSDT";

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
    
    const balance = await getBalance(account);
    const qty = (((balance.wallet_balance * 0.90) * leverage) / price).toFixed(3);
    const data = {
        api_key: account.api,
        symbol: "BTCUSDT",
        timestamp: Date.now(),
        side: "Buy",
        order_type: "Market",
        qty: qty,
        take_profit: price+65,
        stop_loss: price-85,
        ...newData,
    }
    

    
    const sign = getSignature(data, account.secret);
    data.sign = sign;

    const orderRes = await axios.post('https://api.bybit.com/private/linear/order/create', data);
   //console.log(orderRes.data);
 

    /* let config = {
        method: 'post',
        url: 'https://api.bybit.com/v5/order/create',

        headers: {   
          'X-BAPI-SIGN-TYPE': '2',          
          'X-BAPI-API-KEY': account.api, 
          'X-BAPI-TIMESTAMP': timestamp, 
          'X-BAPI-RECV-WINDOW': '5000', 
          'X-BAPI-SIGN': sign,
          'Content-Type': 'application/json; charset=utf-8'
        },
        data : data
      };
      axios(config)
.then((response) => {
  console.log("4 ",  JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
}); */
   // const orderRes = await axios.post('https://api.bybit.com/private/linear/order/create', data);
    //console.log(orderRes);
    
    return orderRes.data;
}
catch (err) {
    next(err)
}
}

run();
});

job.start();
