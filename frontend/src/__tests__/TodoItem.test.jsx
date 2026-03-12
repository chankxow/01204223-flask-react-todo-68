import { render, screen, waitFor } from '@testing-library/react'
import { expect, vi, describe, it } from 'vitest'
import TodoItem from '../TodoItem.jsx'
import userEvent from '@testing-library/user-event'

// Mock the API functions
vi.mock('../config/api.js', () => ({
  apiRequest: vi.fn()
}));

// Mock window.confirm
const mockConfirm = vi.fn();
Object.defineProperty(window, 'confirm', {
  value: mockConfirm,
});

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

describe('TodoItem', () => {
    it('renders with no comments correctly', () => {
        render(<TodoItem todo={baseTodo} onUpdate={() => {}} />);
        expect(screen.getByText('Sample Todo')).toBeInTheDocument();
        expect(screen.getByText('No comments yet')).toBeInTheDocument();
    });

    it('renders with comments correctly', () => {
        const todoWithComment = {
            ...baseTodo,
            comments: [
                { id: 1, message: 'First comment' },
                { id: 2, message: 'Another comment' },
            ]
        };
        render(<TodoItem todo={todoWithComment} onUpdate={() => {}} />);
        expect(screen.getByText('Sample Todo')).toBeInTheDocument();
        
        expect(screen.getByText('First comment')).toBeInTheDocument();
        expect(screen.getByText('Another comment')).toBeInTheDocument();
        expect(screen.getByText(/2/)).toBeInTheDocument();
    });

    it('does not show no comments message when it has a comment', () => {
        const todoWithComment = {
            ...baseTodo,
            comments: [{ id: 1, message: 'First comment' }]
        };
        render(<TodoItem todo={todoWithComment} onUpdate={() => {}} />);
        expect(screen.queryByText('No comments yet')).not.toBeInTheDocument();
    });

    it('makes callback to toggleDone when checkbox is clicked', async () => {
        const onUpdate = vi.fn();
        
        const { apiRequest } = await import('../config/api.js');
        apiRequest.mockResolvedValue({ ok: true });
        
        render(<TodoItem todo={baseTodo} onUpdate={onUpdate} />);
        
        const checkbox = screen.getByRole('checkbox');
        await userEvent.click(checkbox);
        
        await waitFor(() => {
            expect(onUpdate).toHaveBeenCalled();
        });
    });

    it('makes callback to deleteTodo when delete button is clicked', async () => {
        const onUpdate = vi.fn();
        mockConfirm.mockReturnValue(true); // Mock confirm dialog
        
        const { apiRequest } = await import('../config/api.js');
        apiRequest.mockResolvedValue({ ok: true });
        
        render(<TodoItem todo={baseTodo} onUpdate={onUpdate} />);

        const deleteButton = screen.getByText('Delete');
        await userEvent.click(deleteButton);
        
        await waitFor(() => {
            expect(onUpdate).toHaveBeenCalled();
        });
    });

    it('makes callback to addNewComment when a new comment is added', async () => {
        const onUpdate = vi.fn();
        
        const { apiRequest } = await import('../config/api.js');
        apiRequest.mockResolvedValue({ ok: true });
        
        render(<TodoItem todo={baseTodo} onUpdate={onUpdate} />);

        const input = screen.getByRole('textbox');
        await userEvent.type(input, 'New comment');

        const addButton = screen.getByText('Add');
        await userEvent.click(addButton);

        await waitFor(() => {
            expect(onUpdate).toHaveBeenCalled();
        });
    });
});