from app import db, app
from app.models import State, Rating

# Crear un contexto de aplicación
def init_db():
    with app.app_context():
        db.drop_all() # This will delete all existing tables
        db.create_all() # This will create the tables from scratch
        add_states() # Call to add the states within the same context
        add_ratings()
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

def add_ratings():
    ratings = ['1', '2', '3', '4', '5']
    existing_ratings = {rating.classification for rating in Rating.query.all()}
    for classification in ratings:
        if classification not in existing_ratings:
            new_rating = Rating(classification=classification)
            db.session.add(new_rating)
    db.session.commit()
    print("Ratings added to the database.")

if __name__ == '__main__':
    init_db()  # Create tables, Handles all 