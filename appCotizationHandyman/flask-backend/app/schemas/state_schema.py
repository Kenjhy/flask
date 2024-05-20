from . import ma
from app.models.state_model import State

class StateSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = State
        load_instance = True