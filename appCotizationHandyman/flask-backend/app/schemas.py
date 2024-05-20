from flask_marshmallow import Marshmallow
from app import app
from app.models import Company, State, Rating

ma = Marshmallow(app)

class StateSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = State
        load_instance = True

class RatingSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Rating
        load_instance = True

class CompanySchema(ma.SQLAlchemyAutoSchema):
    state = ma.Nested(StateSchema)
    rating = ma.Nested(RatingSchema)

    class Meta:
        model = Company
        load_instance = True
        include_fk = True  # Include foreign keys in the serialization
        include_relationships = True  # Explicitly include relationship data


def init_app(app):
    ma.init_app(app)
