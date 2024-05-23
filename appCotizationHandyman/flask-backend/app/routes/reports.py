from flask import Blueprint, jsonify
from app import db
from app.models.company_model import Company
from . import report_bp


@report_bp.route('/report', methods=['GET'], strict_slashes=False)
def get_report_data():
    companies = Company.query.order_by(Company.average_price.desc()).all()
    report_data = [
        {
            'contact_name': company.contact_name,
            'average_price': company.average_price,
            'rating': int(company.rating.classification) if company.rating else 0
        }
        for company in companies
    ]
    return jsonify(report_data)
