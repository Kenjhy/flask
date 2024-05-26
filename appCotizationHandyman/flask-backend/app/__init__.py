import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv

load_dotenv()  # Load the environment variables from the .env file

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost/budget'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app, resources={r"/api/*": {"origins": "*"}},  supports_credentials=True)

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Delay the import of route blueprints and schema initialization
def register_blueprints():
    from app.routes import company_bp, state_bp, rating_bp, report_bp
    app.register_blueprint(company_bp, url_prefix='/api')
    app.register_blueprint(state_bp, url_prefix='/api')
    app.register_blueprint(rating_bp, url_prefix='/api')
    app.register_blueprint(report_bp, url_prefix='/api')

def initialize_schemas():
    from app.schemas import init_app
    init_app(app)

register_blueprints()
initialize_schemas()