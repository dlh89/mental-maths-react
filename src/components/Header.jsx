import { NavLink } from 'react-router-dom';
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
                        <NavLink to="/" className="header__link">Home</NavLink>
                        <NavLink to="/setup" className="header__link">Play</NavLink>
                        {user.currentUser && (
                            <div>
                                <NavLink to="/stats" className="header__link">Stats</NavLink>
                            </div>
                        )}
                    </div>
                    {!user.currentUser ? (
                        <NavLink to="/login" className="header__login-btn">Login</NavLink>
                    ) : (
                        <button className="btn btn-primary" onClick={handleLogout}>Log out</button>
                    )}
                </nav>
            </div>
        </nav>
    )
};

export default Header;