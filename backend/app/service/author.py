from app.data import mock_db as data
from app.model.author_schema import AuthorCreate, AuthorResponse, AuthorUpdate


def get_all() -> list[AuthorResponse]:
	"""Retrieve all authors from the mock database."""
	return [AuthorResponse(**author) for author in data.db["authors"].values()]


def get_by_id(author_id: int) -> AuthorResponse | None:
	"""Retrieve one author by ID."""
	author = data.db["authors"].get(author_id)
	return AuthorResponse(**author) if author is not None else None


def create(author: AuthorCreate) -> AuthorResponse:
	"""Create an author with a unique email address."""
	email = str(author.email).casefold()
	if any(str(existing["email"]).casefold() == email for existing in data.db["authors"].values()):
		raise ValueError(f"An author with email {author.email} already exists")

	data.author_id_counter += 1
	new_author = {
		**author.model_dump(),
		"id": data.author_id_counter,
	}
	data.db["authors"][data.author_id_counter] = new_author
	return AuthorResponse(**new_author)


def update(author_id: int, changes: AuthorUpdate) -> AuthorResponse | None:
	"""Apply provided fields to an author."""
	author = data.db["authors"].get(author_id)
	if author is None:
		return None

	updates = changes.model_dump(exclude_unset=True, exclude_none=True)
	email = str(updates.get("email", author["email"])).casefold()
	if any(
		existing_id != author_id and str(existing["email"]).casefold() == email
		for existing_id, existing in data.db["authors"].items()
	):
		raise ValueError(f"An author with email {updates['email']} already exists")

	author.update(updates)
	return AuthorResponse(**author)


def delete(author_id: int) -> AuthorResponse | None:
	"""Delete an author if no todos are assigned to them."""
	author = data.db["authors"].get(author_id)
	if author is None:
		return None

	if any(todo["author_id"] == author_id for todo in data.db["todos"].values()):
		raise ValueError(f"Author {author_id} still owns todos")

	del data.db["authors"][author_id]
	return AuthorResponse(**author)
