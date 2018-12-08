const { User } = require('./../models/user');


const auth = (req, res, next) => {
    let token = req.cookies.auth;

    User.findByToken(token, (err, user) => {
        if (err || !user) return res.status(401).send('401 Unauthorized!');
        
        req.token = token;
        next();
    })
    
}


module.exports = { auth };