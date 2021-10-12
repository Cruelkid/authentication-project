import { useContext, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';

import classes from './AuthForm.module.css';

const AuthForm = () => {
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const [isLogin, setIsLogin] = useState(true);
    const [isSendingRequest, setIsSendingRequest] = useState(false);
    const authCtx = useContext(AuthContext);
    const history = useHistory();

    const switchAuthModeHandler = () => {
        setIsLogin((prevState) => !prevState);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        let url;
        setIsSendingRequest(true);

        if (isLogin) {
            url =
                'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD7dOhtsc_pxz7XF29jyBTo4K6rB6NHL7A';
        } else {
            url =
                'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD7dOhtsc_pxz7XF29jyBTo4K6rB6NHL7A';
        }

        fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                email: emailInputRef.current.value,
                password: passwordInputRef.current.value,
                returnSecureToken: true,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                setIsSendingRequest(false);

                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then((data) => {
                        let errorMessage = 'Authentication failed!';

                        if (data && data.error && data.error.message) {
                            errorMessage = data.error.message;
                        }

                        // alert(errorMessage);
                        throw new Error(errorMessage);
                    });
                }
            })
            .then((data) => {
                const expTime = new Date(
                    new Date().getTime() + +data.expiresIn * 1000
                );

                authCtx.login(data.idToken, expTime.toISOString());
                history.replace('/');
            })
            .catch((err) => {
                alert(err);
            });
    };

    return (
        <section className={classes.auth}>
            <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
            <form onSubmit={submitHandler}>
                <div className={classes.control}>
                    <label htmlFor="email">Your Email</label>
                    <input
                        type="email"
                        id="email"
                        required
                        ref={emailInputRef}
                    />
                </div>
                <div className={classes.control}>
                    <label htmlFor="password">Your Password</label>
                    <input
                        type="password"
                        id="password"
                        required
                        ref={passwordInputRef}
                    />
                </div>
                <div className={classes.actions}>
                    {!isSendingRequest && (
                        <button>{isLogin ? 'Login' : 'Create Account'}</button>
                    )}
                    {isSendingRequest && <p>Sending request...</p>}
                    <button
                        type="button"
                        className={classes.toggle}
                        onClick={switchAuthModeHandler}
                    >
                        {isLogin
                            ? 'Create new account'
                            : 'Login with existing account'}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default AuthForm;
