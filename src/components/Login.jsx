import { useState } from 'react';
import { Link } from 'react-router-dom';
import { userLogin } from '../firebase-service';
import Header from './Header';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await userLogin(email, password);
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
            case 'auth/wrong-password':
            case 'auth/user-not-found':
                errorMessage = 'Incorrect email or password.';
                break;
            case 'auth/user-disabled':
                errorMessage = 'This user account has been disabled.';
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
                <h1 className="display-2">Login</h1>
                <form onSubmit={handleLogin}>
                    <input type="email" name="email" placeholder="Email address" required value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    <input type="password" name="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    <input type="submit" name="login-btn" value="Login"></input>
                    {errorMessage && (
                        <div className="notice notice--error">{errorMessage}</div>
                    )}
                </form>
                <p>Don't have an account? <Link to="/register">Sign up</Link></p>
            </div>
        </div>
    );
};

export default Login;