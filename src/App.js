import React, { useState } from "react";
import firebase from "./firebase";
import axios from "axios";
import "./App.css";
import Payment from "./Payment";

const App = () => {
  const [no, setNo] = useState("");
  const [otp, setOtp] = useState("");
  const [data, setData] = useState(null);
  const [flag, setFlag] = useState(false);
  const [checked, setChecked] = useState(false);
  const [payment, setPayment] = useState(false);

  const handleChangeNo = (e) => {
    setNo(e.target.value);
  };

  const handleChangeOtp = (e) => {
    setOtp(e.target.value);
  };

  const handleCheck = (e) => {
    setChecked(!checked);
  };

  const onclick = async () => {
    const data = await axios.get("https://randomuser.me/api/");
    console.log(data.data.results[0]);
    setData(data.data.results[0]);
  };

  const onSubmitOTP = (e) => {
    e.preventDefault();
    const code = otp;
    console.log(code);
    // if(checked==false){}
    window.confirmationResult
      .confirm(code)
      .then((result) => {
        // User signed in successfully.
        const user = result.user;
        console.log(JSON.stringify(user));
        // alert("User is verified");
        setPayment(true);
        // ...
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        // ...
      });
  };

  const onSignInSubmit = (e) => {
    e.preventDefault();
    configureCaptcha();
    const phoneNumber = "+91" + no;
    console.log(phoneNumber);
    const appVerifier = window.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        console.log("OTP has been sent");
        setFlag(true);
        // ...
      })
      .catch((error) => {
        // Error; SMS not sent
        // ...
        console.log("SMS not sent");
      });
  };

  const configureCaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          onSignInSubmit();
          console.log("Recaptca varified");
        },
        defaultCountry: "IN",
      }
    );
  };

  return (
    <React.Fragment>
      {payment ? (
        <Payment />
      ) : (
        <React.Fragment>
          <div className="main">
            {!data && (
              <button className="btn" onClick={onclick}>
                Get data
              </button>
            )}
            {data && (
              <div className="container">
                <h5>
                  {" "}
                  Welcome {data.name.title} {data.name.first} {data.name.last}{" "}
                </h5>
                {flag ? (
                  <div className="cont">
                    <form onSubmit={onSubmitOTP}>
                      <label>Enter OTP <i class="fa fa-solid fa-key"></i> </label>
                      <input
                        type="number"
                        value={otp}
                        placeholder="OTP Number"
                        required
                        onChange={handleChangeOtp}
                      />
                      <div
                        className="check"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          checked={checked}
                          onChange={handleCheck}
                          required
                          type="checkbox"
                          name="terms"
                        />
                        <label style={{ fontSize: "20px" }}>
                          Agree to terms and conditions
                        </label>
                      </div>
                      <button className="btnn" type="submit">
                        Submit
                      </button>
                      
                    </form>
                  </div>
                ) : (
                  <div className="cont">
                    <form onSubmit={onSignInSubmit}>
                      <label>Enter Mobile Number <i  className="fa fa-solid fa-phone"></i> </label>
                      <input
                        type="number"
                        value={no}
                        placeholder="Mobile number"
                        required
                        onChange={handleChangeNo}
                      />
                      <button className="btnn" type="submit">
                        Submit
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </React.Fragment>
      )}

      <div id="sign-in-button"></div>
    </React.Fragment>
  );
};

export default App;
