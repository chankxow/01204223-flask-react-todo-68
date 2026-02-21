import { useState } from 'react';
import './App.css';

function TodoItem({ todo, onUpdate }) {
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleTodo = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ done: !todo.done }),
      });
      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const deleteTodo = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:5000/api/todos/${todo.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          onUpdate();
        }
      } catch (error) {
        console.error('Failed to delete todo:', error);
      }
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/todos/${todo.id}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newComment }),
      });
      if (response.ok) {
        setNewComment('');
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/todos/${todo.id}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <li style={{ 
      padding: '15px', 
      marginBottom: '10px', 
      backgroundColor: '#f8f9fa', 
      borderRadius: '4px', 
      border: '1px solid #dee2e6'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <input
          type="checkbox"
          checked={todo.done}
          onChange={toggleTodo}
          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
        />
        <span style={{ 
          flex: 1, 
          textDecoration: todo.done ? 'line-through' : 'none',
          color: todo.done ? '#999' : '#000'
        }}>
          {todo.title}
        </span>
        <button 
          onClick={deleteTodo}
          style={{ 
            padding: '5px 10px', 
            backgroundColor: '#dc3545', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Delete
        </button>
      </div>

      {todo.comments && todo.comments.length > 0 ? (
        <>
          <p style={{ margin: '10px 0 5px 0', fontWeight: 'bold' }}>Comments ({todo.comments.length}):</p>
          <ul style={{ listStyle: 'none', padding: '0 0 0 20px', marginBottom: '10px' }}>
            {todo.comments.map((comment) => (
              <li key={comment.id} style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: '#e8f5e9', borderRadius: '4px', borderLeft: '4px solid #4caf50' }}>
                <span style={{ color: '#1b5e20', fontWeight: '500' }}>{comment.message}</span>
                <button
                  onClick={() => deleteComment(comment.id)}
                  style={{ fontSize: '12px', padding: '2px 5px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '2px', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p style={{ margin: '10px 0', color: '#999' }}>No comments yet</p>
      )}

      <form onSubmit={addComment} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{ flex: 1, padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '8px 15px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: loading ? 'not-allowed' : 'pointer' 
          }}
        >
          {loading ? '...' : 'Add'}
        </button>
      </form>
    </li>
  );
}

export default TodoItem;