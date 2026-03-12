import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { apiRequest } from './config/api.js';
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
      const response = await apiRequest('/todos');
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

    if (!newTodo.trim()) {
      alert('Please enter a todo title');
      return;
    }

    try {
      console.log('Sending todo:', { title: newTodo });

      const response = await apiRequest('/todos', {
        method: 'POST',
        body: JSON.stringify({ title: newTodo })
      });

      console.log('Response status:', response.status);

      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        setNewTodo('');
        fetchTodos();
      } else {
        const errorMsg = responseData.error || responseData.message || JSON.stringify(responseData);
        console.error('Error details:', errorMsg);
        alert(`Failed to add todo: ${errorMsg}`);
      }
    } catch (error) {
      console.error('Catch error:', error);
      alert(`Error: ${error.message}`);
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
          <span style={{ marginRight: '15px', fontWeight: 'bold' }}>👤 {user?.username}</span>
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
