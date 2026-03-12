# 📝 Todo App - React + Flask

A modern todo application with React frontend and Flask backend, featuring user authentication and real-time todo management.

## ✨ Features

- 🔐 **User Authentication** - Register, login, and JWT-based authentication
- 📝 **Todo Management** - Create, read, update, delete todos
- 💬 **Comments** - Add comments to todos
- 🎨 **Modern UI** - Clean, responsive React interface
- 📱 **Mobile Friendly** - Works on all devices

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **React Router** - Client-side routing
- **Vite** - Fast build tool
- **CSS** - Custom styling

### Backend
- **Flask** - Python web framework
- **Flask-SQLAlchemy** - ORM
- **Flask-JWT-Extended** - JWT authentication
- **SQLite** - Database (development)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/todo-app.git
cd todo-app
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will be available at `http://localhost:5173`

### 3. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Backend API will be available at `http://localhost:5000`

## 📁 Project Structure

```
todo-app/
├── backend/                 # Flask backend
│   ├── main.py             # Main Flask app
│   ├── models.py           # Database models
│   ├── requirements.txt    # Python dependencies
│   └── tests/              # Backend tests
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context
│   │   └── config/         # Configuration
│   ├── public/             # Static assets
│   └── package.json        # Node dependencies
├── docs/                   # Documentation
├── .github/workflows/      # GitHub Actions
├── render.yaml            # Render configuration
└── README.md              # This file
```

## 🔧 Environment Variables

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Update with your values:
- `JWT_SECRET_KEY` - Change this in production!
- `SQLALCHEMY_DATABASE_URI` - Database connection string
- `PRODUCTION_URL` - Frontend URL (for CORS)

## 🌐 Deployment

### Free Deployment Options

#### Frontend: GitHub Pages
1. Push code to GitHub
2. Enable GitHub Pages in repository settings
3. Select "GitHub Actions" as source
4. Auto-deploys on push to main branch

#### Backend: Render
1. Create account at [render.com](https://render.com)
2. Connect GitHub repository
3. Configure with `render.yaml`
4. Auto-deploys on push to main branch

### Manual Deployment

See `docs/FREE_DEPLOYMENT.md` for detailed deployment instructions.

## 📡 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `GET /api/verify` - Verify JWT token

### Todos
- `GET /api/todos` - Get user's todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `PATCH /api/todos/:id/toggle` - Toggle todo status

### Comments
- `POST /api/todos/:id/comments` - Add comment
- `DELETE /api/todos/:id/comments/:id` - Delete comment

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
python -m pytest
```

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation
- Environment variable configuration

**Important**: Always change the default `JWT_SECRET_KEY` in production!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you have any questions or issues, please:
- Check the documentation in `docs/`
- Open an issue on GitHub
- Contact the project maintainer

---

**Made with ❤️ using React and Flask**
