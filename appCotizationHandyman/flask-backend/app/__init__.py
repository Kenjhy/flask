from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost/budget'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app, resources={r"/api/*": {"origins": "*"}},  supports_credentials=True)

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Import and register the route Blueprints
from app.routes import company_bp, state_bp, rating_bp
app.register_blueprint(company_bp, url_prefix='/api')
app.register_blueprint(state_bp, url_prefix='/api')
app.register_blueprint(rating_bp, url_prefix='/api')


