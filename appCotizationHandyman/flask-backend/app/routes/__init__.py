from flask import Blueprint

company_bp = Blueprint('company_bp', __name__)
state_bp = Blueprint('state_bp', __name__)
rating_bp = Blueprint('rating_bp', __name__)

from .companies import *
from .states import *
from .ratings import *