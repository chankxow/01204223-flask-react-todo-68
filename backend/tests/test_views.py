import pytest
from flask import g
from flask_jwt_extended.config import config
from http import HTTPStatus
from models import TodoItem, User, db

@pytest.fixture(autouse=True)
def no_jwt(monkeypatch):
    # from https://github.com/vimalloc/flask-jwt-extended/issues/171
    def no_verify(*args, **kwargs):
        g._jwt_extended_jwt = {
            config.identity_claim_key: '1'  # Use a valid user ID as string
        }
    from flask_jwt_extended import view_decorators
    monkeypatch.setattr(view_decorators, 'verify_jwt_in_request', no_verify)

def create_todo(title='Sample todo', done=False):
    # Create a user first since user_id is required
    user = User.query.filter_by(id=1).first()
    if not user:
        user = User(username='testuser')
        user.set_password('testpass')
        db.session.add(user)
        db.session.commit()
    
    todo = TodoItem(title=title, done=done, user_id=user.id)
    db.session.add(todo)
    db.session.commit()
    return todo

@pytest.fixture
def sample_todo_items(app_context):
    todo1 = create_todo(title='Todo 1', done=False)
    todo2 = create_todo(title='Todo 2', done=True)
    return [todo1, todo2]

def test_get_empty_todo_items(client):
    response = client.get('/api/todos')
    assert response.status_code == HTTPStatus.OK
    assert response.get_json() == {'todos': []}

def test_get_sample_todo_items(client, sample_todo_items):
    # Within this code, sample_todo_items will consist of todo1 and todo2 sent
    response = client.get('/api/todos')
    assert response.status_code == HTTPStatus.OK
    response_data = response.get_json()
    assert len(response_data['todos']) == 2
    
    # Check that both todos are present (order doesn't matter)
    response_titles = [todo['title'] for todo in response_data['todos']]
    sample_titles = [todo.title for todo in sample_todo_items]
    assert set(response_titles) == set(sample_titles)

def test_toggle_todo_item(client, sample_todo_items):
    item1, item2 = sample_todo_items
    response = client.patch(f'/api/todos/{item1.id}/toggle')
    assert response.status_code == HTTPStatus.OK
    data = response.get_json()
    assert data['done'] is True
    assert TodoItem.query.get(item1.id).done is True
