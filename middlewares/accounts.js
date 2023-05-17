const {db} = require('../firebase');

module.exports = (req, res, next) => {
    db.collection('accounts').get()
        .then(snapShot => {
            const accounts = snapShot.docs.map(doc => {
                const account = doc.data();
                account.id = doc.id;
                account.data = {
                    api_key: account.api,
                    timestamp: Date.now()
                }
                return account;
            })
            req.accounts = accounts;
            next();
        })
        .catch(next);
}