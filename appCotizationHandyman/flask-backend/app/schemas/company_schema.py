from . import ma
from app.models.company_model import Company
from .state_schema import StateSchema
from .rating_schema import RatingSchema

class CompanySchema(ma.SQLAlchemyAutoSchema):
    state = ma.Nested(StateSchema)
    rating = ma.Nested(RatingSchema)

    class Meta:
        model = Company
        load_instance = True
        include_fk = True  # Include foreign keys in the serialization
        include_relationships = True  # Explicitly include relationship data