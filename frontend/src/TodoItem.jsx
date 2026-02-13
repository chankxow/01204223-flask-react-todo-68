import { useState } from 'react'
import './App.css'

function TodoItem({todo}) {
  return (
    <li key={todo.id}>
      <span className={todo.done ? "done" : ""}>{todo.title}</span>
      <button onClick={() => {toggleDone(todo.id)}}>Toggle</button>
      <button onClick={() => {deleteTodo(todo.id)}}>❌</button>
      {(todo.comments) && (todo.comments.length > 0) && (
        <>
          // ละไว้
        </>
      )}
      <div className="new-comment-forms">
        // ละไว้
        <button onClick={() => {addNewComment(todo.id)}}>Add Comment</button>
      </div>
    </li>
  )
}

export default TodoItem