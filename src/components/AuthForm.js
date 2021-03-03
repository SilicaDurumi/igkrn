import React, { useState} from "react";
import { authService, firebaseInstance } from "../fbInstance";

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [PasswordCheck, setPasswordCheck] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");


    //  Send resetPassword page Email
    // const resetPassword = (event) =>{
    //     var auth = firebaseInstance.auth();
    //     var emailAddress = "User Email Want change the Account Password";

    //     auth.sendPasswordResetEmail(emailAddress).then(function() {
    //         // Email sent.
    //     }).catch(function(error) {
    //         // An error happened.
    //     });
    // }
    

    const onChange = (event) => {
        const {target: {name, value}} = event;
        if(name === "email"){
            setEmail(value);
        } else if(name === "password"){
            setPassword(value);
        } else if(name === "password-check"){
            setPasswordCheck(value);
        }
   };
    const onSubmit = async (event) => {
       event.preventDefault();
       if (newAccount && password !== PasswordCheck) {
        setError("비밀번호가 일치하지 않습니다.");
        return;
        }
       try {
            let data;
            if(newAccount){
                 data = await authService.createUserWithEmailAndPassword(email, password);
            } else {
                 data = await authService.signInWithEmailAndPassword(email, password);
            }
        }catch(error){
            setError(error.message);
        }
       };
    const toggleAccount = () => setNewAccount((prev) => !prev);

        return (
            <>
            {/* Display when user click the Reset Password Button 
            <form onSubmit={resetPassword} className="container">
                <input 
                    name="email" 
                    type="email" 
                    placeholder="Email" 
                    required 
                    value={email} 
                    onChange={onChange} 
                    className="authInput"/>
                <input 
                    type="submit" 
                    className="authInput authSubmit" /> 
                {error && <span className="authError">{error}</span>}
            </form>
             */}
            <form onSubmit={onSubmit} className="container">
                <input 
                    name="email" 
                    type="email" 
                    placeholder="Email" 
                    required 
                    value={email} 
                    onChange={onChange} 
                    className="authInput"/>
                    <input 
                        name="password" 
                        type="password" 
                        placeholder="Password" 
                        required 
                        value={password} 
                        onChange={onChange} 
                        className="authInput" />
                {newAccount &&  (
                    <input
                        type="password"
                        placeholder="Password Check"
                        name="password-check"
                        onChange={onChange}
                        value={PasswordCheck}
                        required
                        className="authInput"
                    />
                )}
                <input 
                    type="submit" 
                    value={newAccount ? "Create Account" : "Sign In"} 
                    className="authInput authSubmit" /> 
                {error && <span className="authError">{error}</span>}
            </form>
            <span onClick={toggleAccount} className="authSwitch">
                {newAccount ? "Sign In" : "Create Account"}
            </span>
            <span onClick={resetPassword} className="passwordReset">Reset Password</span>
        </>
    );

};
export default AuthForm;