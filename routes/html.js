const router = require('express').Router();
const path = require('path');

const getPath = name => {
    return path.join(__dirname, '..', 'views', `${name}.html`)
}

router.get('/login', (req, res) => {
    res.sendFile(getPath('login'))
})

router.get('/admin', (req, res) => {
    res.sendFile(getPath('admin'));
})

router.get('/orders', (req, res) => {
    res.sendFile(getPath('orders'));
})

router.get('/position', (req, res) => {
    res.sendFile(getPath('PositionTrack'))
})

router.get('/v2/:name', (req, res) => {
    const htmlPath = path.join(__dirname, '..', 'views-v2', `${req.params.name}.html`);
    res.sendFile(htmlPath);
})

router.get('/', (req, res) => {
    res.sendFile(getPath('index'))
})



module.exports = router;