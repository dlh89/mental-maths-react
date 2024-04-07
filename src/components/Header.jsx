import { Link } from 'react-router-dom';

const isLoggedIn = true; // TODO

const Header = () => (
    <nav class="header js-header">
        <div class="container">
            <nav class="header__container">
                <div class="header__nav">
                    <Link to="/" class="header__link header__link--active">Home</Link>
                    <Link to="/setup" class="header__link">Play</Link>
                    {isLoggedIn && (
                        <div>
                            <Link to="/stats" class="header__link">Stats</Link>
                        </div>
                    )}
                </div>
                {!isLoggedIn && (
                    <div>
                        <Link to="/login" class="header__login-btn">Login</Link>
                        <button class="btn btn-primary js-logout-btn">Log out</button>
                    </div>
                )}
            </nav>
        </div>
    </nav>
);

export default Header;