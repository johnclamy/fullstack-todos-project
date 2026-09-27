from copy import deepcopy
from datetime import datetime

import pytest

from app.data import mock_db as data
from app.model.todos_schema import TodoCreate, TodoResponse, TodoUpdate
from app.service import todos as code


@pytest.fixture
def mock_database(monkeypatch):
	created_at = datetime(2024, 1, 1, 12, 0)
	database = {
		"authors": {
			1: {"id": 1, "name": "Alice Smith", "email": "alice@example.com"},
			2: {"id": 2, "name": "Bob Johnson", "email": "bob@example.com"},
		},
		"todos": {
			10: {
				"id": 10,
				"title": "First todo",
				"description": "Initial description",
				"is_completed": False,
				"author_id": 1,
				"created_at": created_at,
				"updated_at": created_at,
			},
			11: {
				"id": 11,
				"title": "Second todo",
				"description": "Another description",
				"is_completed": True,
				"author_id": 2,
				"created_at": created_at,
				"updated_at": created_at,
			},
		},
	}
	monkeypatch.setattr(data, "db", deepcopy(database))
	monkeypatch.setattr(data, "todo_id_counter", 11)
	return data.db


def test_get_all_returns_all_todos_as_responses(mock_database):
	todos = code.get_all()

	assert [todo.id for todo in todos] == [10, 11]
	assert all(isinstance(todo, TodoResponse) for todo in todos)


def test_get_by_id_returns_todo_when_it_exists(mock_database):
	todo = code.get_by_id(10)

	assert isinstance(todo, TodoResponse)
	assert todo.title == "First todo"
	assert todo.author_id == 1


def test_get_by_id_returns_none_when_todo_does_not_exist(mock_database):
	assert code.get_by_id(999) is None


def test_create_adds_todo_for_existing_author(mock_database):
	todo = code.create(
		TodoCreate(title="New todo", description="New description", author_id=1)
	)

	assert isinstance(todo, TodoResponse)
	assert todo.id == 12
	assert todo.title == "New todo"
	assert todo.description == "New description"
	assert todo.author_id == 1
	assert todo.is_completed is False
	assert todo.created_at == todo.updated_at
	assert mock_database["todos"][12]["title"] == "New todo"


def test_create_rejects_unknown_author_without_mutating_database(mock_database):
	with pytest.raises(ValueError, match="Author 999 does not exist"):
		code.create(TodoCreate(title="Orphan todo", author_id=999))

	assert set(mock_database["todos"]) == {10, 11}
	assert data.todo_id_counter == 11


def test_update_changes_only_provided_fields_and_updates_timestamp(mock_database):
	original = deepcopy(mock_database["todos"][10])

	todo = code.update(10, TodoUpdate(title="Updated title", is_completed=True))

	assert todo is not None
	assert todo.title == "Updated title"
	assert todo.description == "Initial description"
	assert todo.is_completed is True
	assert todo.created_at == original["created_at"]
	assert todo.updated_at > original["updated_at"]


def test_update_with_no_changes_keeps_timestamp(mock_database):
	original_timestamp = mock_database["todos"][10]["updated_at"]

	todo = code.update(10, TodoUpdate())

	assert todo is not None
	assert todo.updated_at == original_timestamp


def test_update_returns_none_when_todo_does_not_exist(mock_database):
	assert code.update(999, TodoUpdate(title="Missing")) is None


def test_update_rejects_unknown_author_without_mutating_todo(mock_database):
	original = deepcopy(mock_database["todos"][10])

	with pytest.raises(ValueError, match="Author 999 does not exist"):
		code.update(10, TodoUpdate(author_id=999))

	assert mock_database["todos"][10] == original


def test_delete_removes_todo_and_returns_removed_record(mock_database):
	todo = code.delete(10)

	assert isinstance(todo, TodoResponse)
	assert todo.id == 10
	assert 10 not in mock_database["todos"]
	assert code.get_by_id(10) is None


def test_delete_returns_none_when_todo_does_not_exist(mock_database):
	assert code.delete(999) is None



