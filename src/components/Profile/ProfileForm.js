import { useRef } from 'react';
import { useContext } from 'react';
import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
    const newPasswordInputRef = useRef();
    const authCtx = useContext(AuthContext);

    const submitHandler = (e) => {
        e.preventDefault();

        fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyD7dOhtsc_pxz7XF29jyBTo4K6rB6NHL7A',
            {
                method: 'POST',
                body: JSON.stringify({
                    idToken: authCtx.token,
                    password: newPasswordInputRef.current.value,
                    returnSecureToken: false,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        ).then((response) => {});
    };

    return (
        <form className={classes.form} onSubmit={submitHandler}>
            <div className={classes.control}>
                <label htmlFor="new-password">New Password</label>
                <input
                    type="password"
                    id="new-password"
                    minLength="7"
                    ref={newPasswordInputRef}
                />
            </div>
            <div className={classes.action}>
                <button>Change Password</button>
            </div>
        </form>
    );
};

export default ProfileForm;
