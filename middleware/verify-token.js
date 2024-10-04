const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {

    try {
        // verify the token, open it up, and then assign the payload(who the user is) to req.user
        // so our controller functions know who is making the request
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // assign the payload (decoded token) to the req.user
        
        req.user = decoded
        //proceed to the controller function
        console.log(req.user)
        next()

    } catch(err) {
        console.log(err)
        res.status(401).json({error: "Ivalid Token. Please Log In"})
    }

}

module.exports = verifyToken