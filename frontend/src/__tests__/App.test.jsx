import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import LoginForm from '../LoginForm.jsx'

// Mock the API functions
vi.mock('../config/api.js', () => ({
  apiRequest: vi.fn()
}));

// Mock AuthContext
vi.mock('../context/AuthContext.jsx', () => ({
  useAuth: () => ({
    login: vi.fn(),
    register: vi.fn()
  })
}));

describe('App Components', () => {
  it('renders login form', () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
  });

  it('login form has required fields', () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('').length).toBe(2);
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });
});