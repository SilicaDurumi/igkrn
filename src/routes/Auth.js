import React from "react";
import {Link} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faGoogle,faGithub,} from "@fortawesome/free-brands-svg-icons";
import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { authService, firebaseInstance } from "../fbInstance";
import AuthForm from "../components/AuthForm";

const Auth = () => {
   const onSocialClick = async (event) => {
        const {
            target:{name},
        } = event;
        let provider;
        if(name ==="google"){
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        }else if(name === "github"){
            provider = new firebaseInstance.auth.GithubAuthProvider();
        }
        await authService.signInWithPopup(provider);
    };
    return (
        <div className="authContainer">
            <Link to="/" style={{ marginRight: 10 }}>
                <FontAwesomeIcon
                    icon={faBrain}
                    color={"#04AAFF"}
                    size="3x"
                    style={{ marginBottom: 30 }}
                />
            </Link>
            <AuthForm />
                <div className="authBtns">
                    <button onClick={onSocialClick} name="google" className="authBtn">
                        Continue with Google <FontAwesomeIcon icon={faGoogle} />
                    </button>
                    <button onClick={onSocialClick} name="github" className="authBtn">
                        Continue with Github <FontAwesomeIcon icon={faGithub} />
                    </button>
            </div>
        </div>
    );
 };
export default Auth;