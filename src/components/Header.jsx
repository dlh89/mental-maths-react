import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { logout } from '../firebase-service';


const Header = () => {
    const user = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="header js-header">
            <div className="container">
                <nav className="header__container">
                    <div className="header__nav">
                        <Link to="/" className="header__link header__link--active">Home</Link>
                        <Link to="/setup" className="header__link">Play</Link>
                        {user.currentUser && (
                            <div>
                                <Link to="/stats" className="header__link">Stats</Link>
                            </div>
                        )}
                    </div>
                    {!user.currentUser ? (
                        <Link to="/login" className="header__login-btn">Login</Link>
                    ) : (
                        <button className="btn btn-primary" onClick={handleLogout}>Log out</button>
                    )}
                </nav>
            </div>
        </nav>
    )
};

export default Header;