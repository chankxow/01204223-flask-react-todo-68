import { BrowserRouter, Routes, Route } from "react-router-dom";
//import { AuthProvider } from './context/AuthContext.jsx';
import LoginForm from './LoginForm.jsx';
import './App.css'

import TodoList from './Todolist.jsx'

function App() {
  const TODOLIST_API_URL = 'http://localhost:5000/api/login/';

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <TodoList apiUrl={TODOLIST_API_URL}/>
          } 
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
        <Route
          path="/login"
          element={
            <LoginForm loginUrl={TODOLIST_API_URL} />
          }
        />
      </Routes>
      <br/>
      <a href="/about">About</a>
      <br/>
      <a href="/login">Login</a> 
    </BrowserRouter>
    
  )
}

export default App