

const express = require('express');
const router = express.Router();

// import our json token package
const jwt = require('jsonwebtoken');

// Login, Signup
router.get('/sign-token', function(req, res){

    // simulating signing a jwt token
    // 1. The payload to be included inthe JWT 
    // 2. Secret key to sign the JWT (store in our .env)
    // 3. Optional options object (when does the token expire)

    // payload
    const user = {
        _id: 1,
        username: 'Wolverine'
    }
    const token = jwt.sign({user}, process.env.JWT_SECRET)

    res.json(
        {token}
    )
});

// We would do this on every single request coming into the server
// after the user logs in or signs up.
router.post('/verify-token', function(req, res){
    const token = req.headers.authorization.split(' ')[1]
    console.log(token, "<- token in the headers!")

    // decod token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decoded, " <- decoded token")

    res.json({token})
})

module.exports = router;
