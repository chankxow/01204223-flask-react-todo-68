import { render, screen } from '@testing-library/react'
import { expect, vi, describe, it } from 'vitest' // เพิ่ม vi เข้ามา
import TodoItem from '../TodoItem.jsx'
import App from '../App.jsx' // อย่าลืม import App
import userEvent from '@testing-library/user-event'

const baseTodo = {
    id: 1,
    title: 'Sample Todo',
    done: false,
    comments: [],
};

const todoItem1 = { id: 1, title: 'First todo', done: false, comments: [] };
const todoItem2 = { id: 2, title: 'Second todo', done: false, comments: [
    { id: 1, message: 'First comment' },
    { id: 2, message: 'Second comment' },
] };

const originalTodoList = [
    todoItem1,
    todoItem2,
]

const mockResponse = (data) => Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data),
});

describe('App', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
    });

    it('renders correctly', async () => {
        global.fetch.mockImplementationOnce(() =>
            mockResponse(originalTodoList)
        );
        render(<App />);
        expect(await screen.findByText('First todo')).toBeInTheDocument();
        expect(await screen.findByText('Second todo')).toBeInTheDocument();
    });

    it('toggles done on a todo item', async () => {
        const toggledTodoItem1 = { ...todoItem1, done: true };

        global.fetch
            .mockImplementationOnce(() => mockResponse(originalTodoList))
            .mockImplementationOnce(() => mockResponse(toggledTodoItem1));

        render(<App />);

        const todoText = await screen.findByText('First todo');
        expect(todoText).not.toHaveClass('done');

        const toggleButtons = await screen.findAllByRole('button', { name: /toggle/i });
        await userEvent.click(toggleButtons[0]); 

        expect(await screen.findByText('First todo')).toHaveClass('done');
        expect(global.fetch).toHaveBeenLastCalledWith(expect.stringMatching(/1\/toggle/), expect.objectContaining({ method: 'PATCH' }));
    });
});

describe('TodoItem', () => {
    it('renders with no comments correctly', () => {
        render(<TodoItem todo={baseTodo} />);
        expect(screen.getByText('Sample Todo')).toBeInTheDocument();
        expect(screen.getByText('No comments')).toBeInTheDocument();
    });

    it('renders with comments correctly', () => {
        const todoWithComment = {
            ...baseTodo,
            comments: [
                { id: 1, message: 'First comment' },
                { id: 2, message: 'Another comment' },
            ]
        };
        render(<TodoItem todo={todoWithComment} />);
        expect(screen.getByText('Sample Todo')).toBeInTheDocument();
        
        // Assertion 
        expect(screen.getByText('First comment')).toBeInTheDocument();
        expect(screen.getByText('Another comment')).toBeInTheDocument();
        //  TodoItem.jsx  Comments
        expect(screen.getByText(/2/)).toBeInTheDocument();
    });

    it('does not show no comments message when it has a comment', () => {
        const todoWithComment = {
            ...baseTodo,
            comments: [{ id: 1, message: 'First comment' }]
        };
        render(<TodoItem todo={todoWithComment} />);
        expect(screen.queryByText('No comments')).not.toBeInTheDocument();
    });

    it('makes callback to toggleDone when Toggle button is clicked', async () => {
        const onToggleDone = vi.fn();
        render(<TodoItem todo={baseTodo} toggleDone={onToggleDone} />);
        
        const button = screen.getByRole('button', { name: /toggle/i });
        await userEvent.click(button);
        
        expect(onToggleDone).toHaveBeenCalledWith(baseTodo.id);
    });

    it('makes callback to deleteTodo when delete button is clicked', async () => {
        const deleteTodoMock = vi.fn();
        render(<TodoItem todo={baseTodo} deleteTodo={deleteTodoMock} />);

        const deleteButton = screen.getByText('❌');
        await userEvent.click(deleteButton);
        
        expect(deleteTodoMock).toHaveBeenCalledWith(baseTodo.id);
    });

    it('makes callback to addNewComment when a new comment is added', async () => {
        const onAddNewComment = vi.fn();
        render(<TodoItem todo={baseTodo} addNewComment={onAddNewComment} />);

        const input = screen.getByRole('textbox');
        await userEvent.type(input, 'New comment');

        const addButton = screen.getByText('Add Comment');
        await userEvent.click(addButton);

        expect(onAddNewComment).toHaveBeenCalledWith(baseTodo.id, 'New comment');
    });
});