const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SALT_I = 10;

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 3
    },
    token: {
        type: String,
        required: false,
    }
})

userSchema.pre('save', function(next) {
    var user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(SALT_I, (err, salt) => {
            if (err) return next(err);
            
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err);
                
                user.password = hash;
                next();
            });
        })
    } else {
        next();
    }
})

userSchema.methods.comparePasswords = function(candidatePass, cb) {
    console.log(this.password)
    bcrypt.compare(candidatePass, this.password, (err, isMatch) => {
        console.log(err ? "error" : "")
        if (err) cb(err);
        else cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb) {
    this.token = jwt.sign(this._id.toHexString(), 'supersecretpassword');
    this.save(cb);
}

userSchema.statics.findByToken = function(token, cb) {
    const user = this;

    jwt.verify(token, 'supersecretpassword', function(err, decode){
        if (err) return cb(err);
        user.findOne({_id: decode, token: token}, cb)
    })
}

const User = mongoose.model("User", userSchema);
module.exports = { User } 