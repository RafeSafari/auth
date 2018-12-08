const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { User } = require('./models/user.js')
const { auth } = require('./middleware/auth')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/auth', { useNewUrlParser: true })

const app = express();
app.use(bodyParser.json()); 
app.use(cookieParser()); 


app.post('/api/user', (req, res) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password
    });
    user.save((err, doc) => {
        if (err) res.status(400).send(err);
        else res.status(200).send(doc);
    });
})

app.post('/api/user/login', (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if (!user) 
            return res.json({message: 'Auth failed, user not found'})
        
        user.comparePasswords(req.body.password, (err, isMatch) => {
            if (err) throw err;
            if (!isMatch) 
                res.status(400).json({message: 'Auth failed, missmatch password'})
            else {
                user.generateToken((err, user) => {
                    if (err) throw err;
                    res.cookie('auth', user.token).send('done!')
                })
            }
        })
    })
})

app.get('/user/profile', auth, (req, res) => {
    res.status(200).send(req.token);
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`started on port ${port}`)
})  

