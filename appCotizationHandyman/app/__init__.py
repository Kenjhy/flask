from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__, template_folder='../templates')
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost/budget'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Corregido aquí

db = SQLAlchemy(app)

from app import routes