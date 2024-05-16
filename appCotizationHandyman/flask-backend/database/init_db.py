from app import db, app
from app.models import State

# Crear un contexto de aplicación
def init_db():
    with app.app_context():
        db.drop_all() # This will delete all existing tables
        db.create_all() # This will create the tables from scratch
        add_states() # Call to add the states within the same context
        print("All tables created.")


def add_states():
    """Populate the database with initial state data."""
    states = ['Negotiation', 'No answer', 'Cancelled', 'Accepted', 'In Process', 'Active', 'Inactive']
    existing_states = {state.name for state in State.query.all()}
    for name in states:
        if name not in existing_states:
            new_state = State(name=name)
            db.session.add(new_state)
    db.session.commit()
    print("States added to the database.")

if __name__ == '__main__':
    init_db()  # Create tables, Handles all 