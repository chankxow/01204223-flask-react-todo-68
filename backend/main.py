import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from models import db, TodoItem, Comment, User
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from flask_jwt_extended import JWTManager
import click

app = Flask(__name__)

# Configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'todo.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

CORS(app)


# ================================
# Authentication Routes
# ================================

@app.route('/api/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already registered'}), 400

    user = User(email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=user.id)
    return jsonify({
        'message': 'User registered successfully',
        'token': token,
        'user': user.to_dict()
    }), 201


@app.route('/api/login', methods=['POST'])
def login():
    """Login user"""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'message': 'Invalid email or password'}), 401

    token = create_access_token(identity=user.id)
    return jsonify({
        'token': token,
        'user': user.to_dict()
    }), 200


@app.route('/api/verify', methods=['GET'])
@jwt_required()
def verify():
    """Verify current token and get user info"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({'user': user.to_dict()}), 200


# ================================
# Todo Routes
# ================================

@app.route('/api/todos', methods=['GET'])
@jwt_required()
def get_todos():
    """Get all todos for current user"""
    user_id = get_jwt_identity()
    todos = TodoItem.query.filter_by(user_id=user_id).order_by(TodoItem.created_at.desc()).all()
    return jsonify({'todos': [todo.to_dict() for todo in todos]}), 200


@app.route('/api/todos', methods=['POST'])
@jwt_required()
def add_todo():
    """Create a new todo"""
    user_id = get_jwt_identity()
    data = request.get_json()
    title = data.get('title')

    if not title:
        return jsonify({'error': 'Title is required'}), 400

    todo = TodoItem(title=title, user_id=user_id)
    db.session.add(todo)
    db.session.commit()

    return jsonify(todo.to_dict()), 201


@app.route('/api/todos/<int:todo_id>', methods=['GET'])
@jwt_required()
def get_todo(todo_id):
    """Get a specific todo"""
    user_id = get_jwt_identity()
    todo = TodoItem.query.filter_by(id=todo_id, user_id=user_id).first()
    
    if not todo:
        return jsonify({'message': 'Todo not found'}), 404

    return jsonify(todo.to_dict()), 200


@app.route('/api/todos/<int:todo_id>', methods=['PUT'])
@jwt_required()
def update_todo(todo_id):
    """Update a todo"""
    user_id = get_jwt_identity()
    todo = TodoItem.query.filter_by(id=todo_id, user_id=user_id).first()

    if not todo:
        return jsonify({'message': 'Todo not found'}), 404

    data = request.get_json()
    if 'title' in data:
        todo.title = data['title']
    if 'done' in data:
        todo.done = data['done']

    db.session.commit()
    return jsonify(todo.to_dict()), 200


@app.route('/api/todos/<int:todo_id>/toggle', methods=['PATCH'])
@jwt_required()
def toggle_todo(todo_id):
    """Toggle todo completion status"""
    user_id = get_jwt_identity()
    todo = TodoItem.query.filter_by(id=todo_id, user_id=user_id).first()

    if not todo:
        return jsonify({'message': 'Todo not found'}), 404

    todo.done = not todo.done
    db.session.commit()
    return jsonify(todo.to_dict()), 200


@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
@jwt_required()
def delete_todo(todo_id):
    """Delete a todo"""
    user_id = get_jwt_identity()
    todo = TodoItem.query.filter_by(id=todo_id, user_id=user_id).first()

    if not todo:
        return jsonify({'message': 'Todo not found'}), 404

    db.session.delete(todo)
    db.session.commit()
    return jsonify({'message': 'Todo deleted successfully'}), 200


# ================================
# Comment Routes
# ================================

@app.route('/api/todos/<int:todo_id>/comments', methods=['POST'])
@jwt_required()
def add_comment(todo_id):
    """Add a comment to a todo"""
    user_id = get_jwt_identity()
    todo = TodoItem.query.filter_by(id=todo_id, user_id=user_id).first()

    if not todo:
        return jsonify({'error': 'Todo not found'}), 404

    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({'error': 'Comment message is required'}), 400

    comment = Comment(
        message=data['message'],
        todo_id=todo_id
    )
    db.session.add(comment)
    db.session.commit()

    return jsonify(comment.to_dict()), 201


@app.route('/api/todos/<int:todo_id>/comments/<int:comment_id>', methods=['DELETE'])
@jwt_required()
def delete_comment(todo_id, comment_id):
    """Delete a comment"""
    user_id = get_jwt_identity()
    todo = TodoItem.query.filter_by(id=todo_id, user_id=user_id).first()

    if not todo:
        return jsonify({'error': 'Todo not found'}), 404

    comment = Comment.query.filter_by(id=comment_id, todo_id=todo_id).first()
    if not comment:
        return jsonify({'error': 'Comment not found'}), 404

    db.session.delete(comment)
    db.session.commit()
    return jsonify({'message': 'Comment deleted successfully'}), 200


# ================================
# CLI Commands
# ================================

@app.cli.command("create-user")
@click.argument("email")
@click.argument("password")
def create_user(email, password):
    """Create a new user from CLI"""
    if User.query.filter_by(email=email).first():
        click.echo(f"Error: User with email {email} already exists")
        return

    user = User(email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    click.echo(f"User {email} created successfully")


@app.cli.command("init-db")
def init_db():
    """Initialize the database"""
    db.create_all()
    click.echo("Database initialized")


# ================================
# Error Handlers
# ================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'message': 'Resource not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({'message': 'Internal server error'}), 500


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)