const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const leverageRoutes = require('./routes/leverage');
const balanceRoutes = require('./routes/balance');
const orderRoutes = require('./routes/order');
const tickersRoutes = require('./routes/tickers');
const positionRoutes = require('./routes/position');
const tradingRoutes = require('./routes/trading');
const htmlRoutes = require('./routes/html');
const authRoutes = require('./routes/auth');
const test = require('./routes/test');

app.use(
    express.json(), express.urlencoded({ extended: true }), cors(),
    express.static(path.join(__dirname, 'exchange', 'src'), { index: false }),
);

app.use('/html', htmlRoutes);
app.use(
    tickersRoutes,
    balanceRoutes,
    leverageRoutes,
    orderRoutes,
    positionRoutes,
    tradingRoutes,
    authRoutes,
    test
);



app.get('/', (req, res) => {
    res.redirect('/html')
})

app.use((err, req, res, next) => {
    res.status(+err.status || +err.code || +err.statusCode || 500).json(err);
})



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on ${PORT}!`));