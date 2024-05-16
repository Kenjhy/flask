from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
# from flask_marshmallow import Marshmallow

import os

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost/budget'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)  # Initialize Flask-Migrate
# ma = Marshmallow(app)

from app import routes