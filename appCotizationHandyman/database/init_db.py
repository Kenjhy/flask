from app import db, app

# Crear un contexto de aplicación
def init_db():
    with app.app_context():
        db.create_all()

if __name__ == '__main__':
    init_db()