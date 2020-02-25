const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
//The urlencoded method within body-parser tells body-parser to extract data 
//from the <form> element and add them to the body property in the request object.

//works in postman & from a form
//when commented out it works when I submit post through a form
app.use(bodyParser.json());
//with this commented out the app won't take the data submitted from the form but it will take
//the data if i submit it from postman
app.use(bodyParser.urlencoded({ extended: true }))

//allows the whole app to use everything in the public folder so when I link js in my html
//I am allows to use that html
app.use(express.static('public'))

//define what the db is
const db = require('./config/keys').mongoURI;

//Connect to mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

//importing our db model
const Product = require('./schema')


const port = process.env.Port || 4000;

app.listen(port, function () {
    console.log('listening on 4000')
})


app.get('/products', (req, res, next) => {
    Product.find()
        .then(docs => {
            // if (docs.length >= 0) {
            console.log(`From database ${docs}`)
            //if we actually get something back wen we look for the doc
            //want to run the response inside of this then block 
            //when we know the request was successful
            res.status(200).json(docs)
            // } else {
            //     res.json({ message: "no entries found in database" })
            // }

        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
})

app.get('/:productId', (req, res, next) => {
    const id = req.params.productId
    Product.findById(id)
        .then(doc => {
            console.log(`From database ${doc}`)
            //if we actually get something back wen we look for the doc
            if (doc) {
                //want to run the response inside of this then block 
                //when we know the request was successful
                res.status(200).json(doc)
            } else {
                res.status(404).json({ message: "no valid entry found for provided ID" })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
})

app.post('/products', (req, res, next) => {
    //using our db model as a constructor
    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price
    })
    product.save()
        .then(result => {
            console.log(result)
        })
        .then(result => {
            //res.status.(201) means a new resource in this case product has been created on the server 
            //if that happens we respond with json that has a message and an object
            res.status(201).json({
                message: "success",
                createdProduct: result
            })
        })
        .catch(err => {
            console.log(err)
            res.status(5).json({
                error: err
            })
        })
})

app.patch("/:productId", (req, res, next) => {
    console.log('body', req.body)
    const id = req.params.productId
    Product.findByIdAndUpdate({ _id: id }, { $set: req.body })
        .then(result => {
            res.status(200).json(req.body)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
})

app.delete('/:productId', (req, res) => {
    const id = req.params.productId
    Product.findOneAndDelete({ _id: id })
        .then(result => {
            console.log('Post successfully removed from collection!');
            res.status(200).json(result)
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({ error: err })
        })
})

