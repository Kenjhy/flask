from flask_marshmallow import Marshmallow

# Initialize Marshmallow without binding it to the app here.
ma = Marshmallow()

from .company_schema import CompanySchema
from .state_schema import StateSchema
from .rating_schema import RatingSchema

def init_app(app):
    # Bind Marshmallow with app here instead of at the import time.
    ma.init_app(app)