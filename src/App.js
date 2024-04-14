import { Navigate, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Stats from './components/Stats';
import Setup from './components/Setup';
import Login from './components/Login';
import Register from './components/Register';
import { useAuth } from './AuthContext';

function ProtectedRoute({ children }) {
  const user = useAuth();
  return user.currentUser ? children : <Navigate to="/login" replace />;
}

function LoginRedirect() {
  const user = useAuth();
  return user.currentUser ? <Navigate to="/dashboard" replace /> : <Login />;
}

function RegisterRedirect() {
  const user = useAuth();
  return user.currentUser ? <Navigate to="/dashboard" replace /> : <Register />;
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/setup" element={<ProtectedRoute><Setup /></ProtectedRoute>} />
        <Route path="/stats" element={<ProtectedRoute><Stats /></ProtectedRoute>} />
        <Route path="/login" element={<LoginRedirect  />} />
        <Route path="/register" element={<RegisterRedirect  />} />
      </Routes>
    </div>
  );
}

export default App;
