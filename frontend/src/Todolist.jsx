import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import TodoItem from './TodoItem';

export default function TodoList() {
  const { isAuthenticated, loading, logout, user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loadingTodos, setLoadingTodos] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos();
    }
  }, [isAuthenticated]);

  const fetchTodos = async () => {
    try {
      setLoadingTodos(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/todos', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTodos(data.todos);
      } else if (response.status === 401) {
        logout();
        navigate('/login');
      }
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoadingTodos(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/todos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTodo }),
      });
      if (response.ok) {
        setNewTodo('');
        fetchTodos();
      }
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>My Todos</h1>
        <div>
          <span style={{ marginRight: '15px', fontWeight: 'bold' }}>👤 {user?.email}</span>
          <button 
            onClick={handleLogout}
            style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </div>

      <form onSubmit={addTodo} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new todo..."
          style={{ flex: 1, padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <button 
          type="submit"
          style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Add
        </button>
      </form>

      {loadingTodos ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Loading todos...</p>
      ) : todos.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>No todos yet. Add one to get started!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onUpdate={fetchTodos} />
          ))}
        </ul>
      )}
    </div>
  );
}
