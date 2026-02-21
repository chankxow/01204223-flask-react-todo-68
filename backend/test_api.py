import requests
import json

# Login first
login_response = requests.post(
    'http://localhost:5000/api/login',
    json={'username': 'testuser', 'password': 'password123'}
)

print("Login Response Status:", login_response.status_code)
print("Login Response:", login_response.json())

if login_response.status_code == 200:
    token = login_response.json()['token']
    
    # Try to add a todo
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    todo_response = requests.post(
        'http://localhost:5000/api/todos',
        json={'title': 'Test Todo'},
        headers=headers
    )
    
    print("\nAdd Todo Response Status:", todo_response.status_code)
    print("Add Todo Response:", todo_response.json())
