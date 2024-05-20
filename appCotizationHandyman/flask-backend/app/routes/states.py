from flask import Blueprint, jsonify
from flask_cors import cross_origin
from . import state_bp
from app.models import State

@state_bp.route('/states', methods=['GET'], strict_slashes=False)
@cross_origin()
def get_states():
    states = State.query.all()
    return jsonify([{'id': state.id, 'name': state.name} for state in states])