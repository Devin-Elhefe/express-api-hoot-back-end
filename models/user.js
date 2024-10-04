const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    username: String,
    hashedPassword: String
})


// this listens for everytime any userDocument is turned into json
// just delete password
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword
    }
})

module.exports = mongoose.model('User', userSchema)