import React from 'react'
import axios from 'axios'
import './App.css'

const loadRazorpay = src =>{
    return new Promise(resolve =>{
        const script = document.createElement('script')
        script.src = src
        script.onload = () =>{
            resolve(true)
        }
        script.onerror = () =>{
            resolve(false)
        }
        document.body.appendChild(script)
    })
}

const displayRazorpay = async () =>{
    const res = await loadRazorpay('https://checkout.razorpay.com/v1/checkout.js')
    if(!res){
        alert("SDK Failed")
        return;
    }


    const data = await axios.post('http://localhost:1300/razorpay')
    
    console.log(data.data)

    var options = {
        "key": "rzp_test_chMdzVi1BnMpHt",
        "amount":data.data.amount.toString(),
        "currency":data.data.currency,
        "order_id":data.data.id, 
        "name": "Loan",
        "description": "Pay off the debt",
        "image": "https://e7.pngegg.com/pngimages/933/104/png-clipart-payment-computer-icons-money-credit-card-indian-rupee-sign-web-production-angle-text.png",
        "handler": function (response){
            alert("Payment successfull. Your debt is now clear!!!")
            window.location.reload()
        }
    };
    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
}

const Payment = () => {
    return (
        <div className="main" >
            <h1>Payment Razorpay</h1>
            <button className="btn"
                onClick = {displayRazorpay}
                target="_blank"
            >
                Pay
            </button>
        </div>
    )
}

export default Payment
