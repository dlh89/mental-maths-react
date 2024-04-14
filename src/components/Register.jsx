import { useState } from 'react';
import { Link } from 'react-router-dom';
import { userRegister } from '../firebase-service';
import Header from './Header';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await userRegister(email, password);
            window.location.href = '/';
        }
        catch (error) {
            console.log(error);
            setErrorMessage(getErrorMessageFromFirebaseError(error));
        }        
    };

    const getErrorMessageFromFirebaseError = (error) => {
        let errorMessage;

        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'A user with that email address already exists.';
                break;
            case 'auth/weak-password':
                errorMessage = 'Your password is too weak.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email format.';
                break;
            default:
                errorMessage = 'An unknown error occurred.';
        }

        return errorMessage;
    }

    return (
        <div>
            <Header />
            <div className="container">
                <h1 className="display-2">Create your account</h1>
                <form onSubmit={handleRegister}>
                    <input type="email" name="email" placeholder="Email address" required value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    <input type="password" name="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    <input type="submit" name="login-btn" value="Register"></input>
                    {errorMessage && (
                        <div className="notice notice--error">{errorMessage}</div>
                    )}
                </form>
                <p>Already have an account? <Link to="/login">Sign in</Link></p>
            </div>
        </div>
    );
};

export default Register;