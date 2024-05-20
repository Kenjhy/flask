from . import ma
from app.models.rating_model import Rating

class RatingSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Rating
        load_instance = True