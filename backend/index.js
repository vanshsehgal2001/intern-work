const express = require('express')
const app=express()
const shortid = require('shortid')
const Razorpay = require('razorpay')
const cors = require('cors')

const razorpay = new Razorpay({
    key_id:'rzp_test_chMdzVi1BnMpHt',
    key_secret:'ax4zcjxK4dHvQKI5aUxWebp1'
})


app.use(cors())
app.use(express.json())
app.get('/',(req,res)=>{
    res.send('Hello')
})

// WANTED TO IMPLEMENT WEBHOOKS BUT DUE TO SOME ERROR, NOT WORKING

app.post('/razorpay',async (req,res)=>{

    var amount = 7000
    const currency='INR'
    const payment_capture = 1

    const options = {
        amount:amount*100,
        currency,
        receipt : shortid.generate(),
        payment_capture
    }

    try {
        const resp = await razorpay.orders.create(options)
        console.log(resp)
        res.json({
            id:resp.id,
            currency:resp.currency,
            amount:resp.amount
        })    
    } catch (error) {
        console.log(error)
    }

    
})

app.listen(1300,()=>{
    console.log("Started")
})

