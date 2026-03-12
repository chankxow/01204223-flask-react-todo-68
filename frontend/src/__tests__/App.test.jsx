import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import App from '../App.jsx'

// Mock the API functions
vi.mock('../config/api.js', () => ({
  apiRequest: vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }))
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(() => 'mock-token'),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock AuthContext
vi.mock('../context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    AuthProvider: ({ children }) => children,
    useAuth: () => ({
      isAuthenticated: true,
      loading: false,
      user: { id: 1, username: 'testuser' },
      logout: vi.fn()
    })
  };
});

// Mock React Router
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    BrowserRouter: ({ children }) => children,
    Routes: ({ children }) => children,
    Route: ({ children }) => children,
    useNavigate: () => vi.fn()
  };
});

const mockResponse = (body, ok = true) =>
  Promise.resolve({
    ok,
    json: () => Promise.resolve(body),
  });

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders correctly with authentication', async () => {
    // Mock API calls
    const { apiRequest } = await import('../config/api.js');
    apiRequest.mockImplementation((endpoint) => {
      if (endpoint === '/todos') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            todos: [
              { id: 1, title: 'First todo', done: false, comments: [] },
              { id: 2, title: 'Second todo', done: false, comments: [
                { id: 1, message: 'First comment' },
                { id: 2, message: 'Second comment' },
              ] },
            ]
          })
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    render(<App />);

    expect(await screen.findByText('First todo')).toBeInTheDocument();
    expect(await screen.findByText('Second todo')).toBeInTheDocument();
    expect(await screen.findByText('First comment')).toBeInTheDocument();
    expect(await screen.findByText('Second comment')).toBeInTheDocument();
  });

  it('shows login form when not authenticated', async () => {
    // Mock AuthContext to return unauthenticated
    vi.doMock('../context/AuthContext', async (importOriginal) => {
      const actual = await importOriginal();
      return {
        ...actual,
        AuthProvider: ({ children }) => children,
        useAuth: () => ({
          isAuthenticated: false,
          loading: false,
          logout: vi.fn()
        })
      };
    });

    render(<App />);

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Username:')).toBeInTheDocument();
    expect(screen.getByText('Password:')).toBeInTheDocument();
  });
});