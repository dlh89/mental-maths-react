import { Navigate, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Stats from './components/Stats';
import Login from './components/Login';
import { useAuth } from './AuthContext';

function ProtectedRoute({ children }) {
  const user = useAuth();
  return user.currentUser ? children : <Navigate to="/login" replace />;
}

function LoginRedirect() {
  const user = useAuth();
  return user.currentUser ? <Navigate to="/dashboard" replace /> : <Login />;
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/stats" element={<ProtectedRoute><Stats /></ProtectedRoute>} />
        <Route path="/login" element={<LoginRedirect  />} />
      </Routes>
    </div>
  );
}

export default App;
