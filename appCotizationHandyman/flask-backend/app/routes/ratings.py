from flask import Blueprint, jsonify
from flask_cors import cross_origin
from . import rating_bp
from app.models import Rating

@rating_bp.route('/ratings', methods=['GET'], strict_slashes=False)
@cross_origin()
def get_ratings():
    ratings = Rating.query.all()
    return jsonify([{'id': rating.id, 'classification': rating.classification} for rating in ratings])
