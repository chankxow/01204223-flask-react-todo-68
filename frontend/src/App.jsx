import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import LoginForm from './LoginForm.jsx';
import './App.css'
import TodoList from './Todolist.jsx'

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppContent() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <TodoList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/login" 
          element={<LoginForm />}
        />
        <Route 
          path="/about" 
          element={
            <>
              <h1>About</h1>
              <p>This is a simple todo list application built with React and Flask.</p>
              <a href="/">Back to Home</a>
            </>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;