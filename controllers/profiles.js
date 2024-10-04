const express = require('express')
const router = express.Router()

const UserModel = require('../models/user')
const verifyToken = require('../middleware/verify-token')

router.get('/:userId', verifyToken, async function(req, res) {
    console.log(req.user, "<-the logged in user info")
    try {

        const userDoc = await UserModel.findById(req.params.userId)
        if(!userDoc) {
            res.status(404)
            throw new Error("Profile not found")
        }
        //password is being deleted because of the 
        // toJson listner in our model on the schema

        res.json({userDoc})
    } catch(err) {
        console.log(err)
        if (res.statusCode === 404) {
            res.json({ error: err.message })
        }
        res.status(500).json({error: err.message})
    }
})

module.exports = router