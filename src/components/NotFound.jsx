import { Link } from 'react-router-dom';
import Header from "./Header";

const NotFound = () => (
    <div>
        <Header />
        <div className="container">Page not found. <Link to="/">Return home.</Link></div>
    </div>
);

export default NotFound;