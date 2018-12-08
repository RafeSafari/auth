const bcrypt = require('bcrypt');
const { MD5 } = require('crypto-js');
const jwt = require('jsonwebtoken');

// bcrypt.genSalt(10, (err, salt) => {
//     if (err) return next(err);

//     bcrypt.hash('123',salt, (err, hash)=> {
//         if (err) return next(err);

//         console.log(hash);
//     })

// })

const id = '1000';
const secret = 'supersecretpassword';

const recievedToken = jwt.sign(id, secret);
console.log(recievedToken)

const decodeToken = jwt.verify(recievedToken, secret);

console.log(decodeToken);