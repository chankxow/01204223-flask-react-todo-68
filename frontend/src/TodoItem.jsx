import './App.css'
import { useState } from 'react';

function TodoItem({ todo, toggleDone, deleteTodo, addNewComment }) {
  const [newComment, setNewComment] = useState("");

  return (
    <li key={todo.id}>
      <span className={todo.done ? "done" : ""}>{todo.title}</span>
      <button onClick={() => toggleDone(todo.id)}>Toggle</button>
      <button onClick={() => deleteTodo(todo.id)}>❌</button>

      {todo.comments && todo.comments.length > 0 ? (
        <>
          <br />
          {/* expect(screen.getByText(/2/)) */}
          <b>Comments ({todo.comments.length}):</b> 
          <ul>
            {todo.comments.map((comment) => (
              <li key={comment.id}>{comment.message}</li>
            ))}
          </ul>
        </>
      ) : (
        /*  expect(screen.getByText('No comments')) */
        <p>No comments</p>
      )}

      <div className="new-comment-forms">
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        
        <button onClick={() => {
          addNewComment(todo.id, newComment);
          setNewComment("");
        }}>
          Add Comment
        </button>
      </div>
    </li>
  );
}

export default TodoItem;