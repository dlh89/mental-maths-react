import { Navigate, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Stats from './components/Stats';

function ProtectedRoute({ children }) {
  const auth = false;
  return auth ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/stats" element={<ProtectedRoute><Stats /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
