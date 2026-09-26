from datetime import datetime, timedelta


# Simulating database tables

db = {
    "authors": {
        1: {"id": 1, "name": "Alice Smith", "email": "alice@example.com"},
        2: {"id": 2, "name": "Bob Johnson", "email": "bob@example.com"}
    },
    "todos": {
        101: {
            "id": 101,
            "title": "Setup FastAPI project",
            "description": "Install dependencies and write basic endpoints",
            "is_completed": False,
            "author_id": 1,
            "created_at": datetime.now() - timedelta(hours=3),
            "updated_at": datetime.now() - timedelta(hours=3),
        },
        102: {
            "id": 102,
            "title": "Write unit tests",
            "description": "Ensure all endpoints are covered with tests",
            "is_completed": False,
            "author_id": 2,
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
        }
    }
}


# Counters for simulating auto-incrementing IDs
author_id_counter = 2
todo_id_counter = 102
