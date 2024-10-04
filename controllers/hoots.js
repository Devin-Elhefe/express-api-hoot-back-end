const express = require('express')
const router = express.Router()
const HootModel = require('../models/hoot')

router.post('/', async function(req, res) {
    console.log(req.body, "<- this is the contents of the form")
    console.log(req.user, "<- req.user from the jwt")
    req.body.author = req.user._id

    try {
        const hootDoc = await HootModel.create(req.body)
        // if we want to send back the author property with the whole object
        // instead just the userId
        hootDoc._doc.author = req.user
        res.status(201).json(hootDoc)

    } catch(err) {
        console.log(err)
        res.status(500).json({error: err.message})
    }

})


router.get('/', async function(req, res) {
    try {

        // .populate is when you have refereced property
        // in this case author  (check the model to see the reference)
        // and it replaces the id with the object that the id references.
        const hootDocs = await HootModel.find({}).populate('author')

        res.status(200).json(hootDocs)


    } catch(err) {
        res.status(500).json({error: err.message})
    }
})

router.get('/:id', async function(req, res) {
    try {
        const hootDoc = await HootModel.findById(req.params.id).populate('author')
        
        
        res.status(200).json(hootDoc)


    } catch(err) {
        res.status(500).json({error: err.message})
    } 
});

router.delete('/:id', async function(req, res) {
    try {

        // check to see if user owns this document - only the user that created hoot should be able to update it
        const hootDoc = await HootModel.findById(req.params.id);

        // .equals is a mongoose method for comparing mongodb id's
        // we can't use the === we need to suse the .equals method
        if(!hootDoc.author.equals(req.user._id)) {
            res.status(403).json({
                message: "you're not allowed to delete a hoot"
            })
        }

        const deletedHoot = await HootModel.findByIdAndDelete(req.params.id)

        res.status(200).json({message: 'item was successfully deleted'})

    } catch(err) {
        console.log(err)
        res.status(500).json({error: err.message})
    } 
});



router.put('/:id', async function(req, res) {
    try {

        // check to see if user owns this document - only the user that created hoot should be able to update it
        const hootDoc = await HootModel.findById(req.params.id);

        // .equals is a mongoose method for comparing mongodb id's
        // we can't use the === we need to suse the .equals method
        if(!hootDoc.author.equals(req.user._id)) {
            res.status(403).json({
                message: "you're not allowed to update a hoot"
            })
        }

        const updatedHoot = await HootModel.findByIdAndUpdate(req.params.id, req.body, { new: true});
        


        updatedHoot._doc.author = req.user;


        res.status(204).json(updatedHoot)
    } catch(err) {
        res.status(500).json({error: err.message})
    } 
})

router.post('/:hootid/comments', async function(req, res) {
    console.log(req.body)
    try {
        // assigning the author to req.body, so we have an object that matches 
        // the shape of the comment schema
        req.body.author = req.user._id
        // find the hoot so we can add a the comment to the hoot's comments array
        const hootDoc = await HootModel.findById(req.params.hootid)
        // add the comment to the comments array
        hootDoc.comments.push(req.body)
        // tell the db we added the comment to the hoot array
        await hootDoc.save()

        // const newComment = hootDoc.comments[hootDoc.comments.length -1]

        // newComment._doc.author = req.user

        //another way, because we are populating on a document
        
        await hootDoc.populate('comments.author')

        res.status(201).json(hootDoc)

    } catch(err) {
        res.status(500).json({error: err.message})
    }
})


module.exports = router