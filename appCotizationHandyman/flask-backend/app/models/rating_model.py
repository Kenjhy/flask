from app import db

class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    classification = db.Column(db.String(50), unique=True, nullable=False)

    def __repr__(self):
        return f'<Rating {self.classification}>'