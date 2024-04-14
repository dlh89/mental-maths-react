import Header from './Header';
import { Link } from 'react-router-dom';

const Home = () => (
    <div>
        <Header />
        <div className="container">
            <h1 className="display-2">Mental Maths</h1>
            <Link to="/setup" className="btn btn-primary">Play</Link>
        </div>
    </div>
);

export default Home;