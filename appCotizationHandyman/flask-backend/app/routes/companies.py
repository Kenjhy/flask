import logging

from flask import request, jsonify
from app import db
# from app.models import Company, State, Rating
from app.models.company_model import Company
from app.models.state_model import State
from app.models.rating_model import Rating
# from app.schemas import CompanySchema
from app.schemas.company_schema import CompanySchema
from app.utils.s3_utils import upload_image_to_s3, delete_image_from_s3
from app.utils.date_utils import parse_date, parse_datetime
from app.utils.parsing_utils import safe_float
from . import company_bp

company_schema = CompanySchema()
companies_schema = CompanySchema(many=True)

# Initialize logging
logging.basicConfig(level=logging.INFO)

@company_bp.route('/companies', methods=['GET'], strict_slashes=False)
def get_companies():
    companies = Company.query.order_by(Company.id).all()
    return jsonify(companies_schema.dump(companies))

@company_bp.route('/companies', methods=['POST'], strict_slashes=False)
def add_company():
    # Code to handle company addition, including image handling as before
    # Assume that the requst contains a JSON with the necessary data
    data = request.json
    #Validation for required fields
    if not data.get('contact_name') or not data .get('phone'):
        return jsonify({"error": "Missing required fields: contact name and phone are required. "}), 400
    
    # Handle image upload
    image_url = upload_image_to_s3(data.get('image_base64'), data.get('company_name'))
    if data.get('image_base64') and not image_url:
        return jsonify({"error": "Failed to process the image."}), 500

    # Handle state optionally
    state_id = State.query.get(data.get('state_id')).id if data.get('state_id') else None
    rating_id = Rating.query.get(data.get('rating_id')).id if data.get('rating_id') else None
    
    try:
    # Process other fields and create Company instance
        new_company = Company(
            image_path=image_url,
            company_name=data.get('company_name', ''),
            contact_name=data['contact_name'],
            phone=data['phone'],
            skills=data.get('skills',''),
            date_of_contact=parse_date(data.get('date_of_contact')),
            date_start_works=parse_date(data.get('date_start_works')),
            working_time=int(data.get('working_time', 0)) if data.get('working_time') else None,
            meeting=parse_datetime(data.get('meeting')),
            average_price=safe_float(data.get('average_price', None)),
            final_price=safe_float(data.get('final_price', 0)),
            workplace=data.get('workplace', ''),
            methods_of_payment=data.get('methods_of_payment', ''),
            work_method=data.get('work_method', ''),
            quote=data.get('quote', ''),
            state_id=state_id,
            online_view=data.get('online_view', ''),
            on_site_view=data.get('on_site_view', ''),
            rating_id=rating_id,
            link=data.get('link', ''),
            details=data.get('details', '')
        )

        # Code to add a company, ad new company to database session and confirm
        db.session.add(new_company)
        db.session.commit()
        return jsonify(company_schema.dump(new_company)), 201
        # return company_schema.jsonify(new_company), 201 
    except Exception as e:
        db.session.rollback()
        logging.error(f"Failed to add new company: {str(e)}")
        return jsonify({"error": "Failed to add company", "details": str(e)}), 500


@company_bp.route('/companies/<int:id>', methods=['GET', 'PUT', 'DELETE'], strict_slashes=False)
def handle_company(id):
    company = Company.query.get_or_404(id)
    if request.method == 'GET':
        return jsonify(company_schema.dump(company))
    elif request.method == 'PUT':
        # Update company details
        data = request.json
        # Handle image update if provided
        image_url = upload_image_to_s3(data.get('image_base64'), data.get('company_name'))
        if data.get('image_base64') and not image_url:
            return jsonify({"error": "Failed to process the image."}), 500
        # Delete the old image if the key has changed
        if image_url and company.image_path != image_url:
            delete_image_from_s3(company.image_path)
            company.image_path = image_url
       
        # Update other fields
        company.company_name = data.get('company_name', company.company_name)
        company.contact_name = data.get('contact_name', company.contact_name)
        company.phone = data.get('phone', company.phone)
        company.skills = data.get('skills', company.skills)
        company.date_of_contact = parse_date(data.get('date_of_contact'))
        company.date_start_works = parse_date(data.get('date_start_works'))
        company.working_time = int(data['working_time']) if data.get('working_time') is not None else company.working_time
        company.meeting = parse_datetime(data.get('meeting'))
        company.average_price = float(data['average_price']) if data.get('average_price') else company.average_price
        company.final_price = float(data['final_price']) if data.get('final_price') else company.final_price
        company.workplace = data.get('workplace', company.workplace)
        company.methods_of_payment = data.get('methods_of_payment', company.methods_of_payment)
        company.work_method = data.get('work_method', company.work_method)
        company.quote = data.get('quote', company.quote)
        # Handle state update
        company.state_id = State.query.get(data.get('state_id')).id if data.get('state_id') else None # Allow null state if no state_id is provided
        company.online_view = data.get('online_view', company.online_view)
        company.on_site_view = data.get('on_site_view', company.on_site_view)
        company.rating_id = Rating.query.get(data.get('rating_id')).id if data.get('rating_id') else None
        company.link = data.get('link', company.link)
        company.details = data.get('details', company.details)

        db.session.commit()
        return jsonify(company_schema.dump(company))
    elif request.method == 'DELETE':
        if not company:
            logging.info("Attempt to delete  non-existent company with ID: {id}")
            return jsonify({'message': 'Company not found'}), 404
        
        try:
            delete_image_from_s3(company.image_path)
            db.session.delete(company)
            db.session.commit()
            logging.info(f"Company with {id} was successfully deleted.")
            return jsonify({'message': 'Company successfully deleted.'}), 200
        except Exception as e:
            db.session.rollback()
            logging.error(f"Failed to delete Company with {id}: {str(e)}")
            return jsonify({'error': 'Failed to delete company', 'details': str(e)}), 500


@company_bp.route('/company_routes/soft_delete/<int:id>', methods=['DELETE'], strict_slashes=False)
def soft_delete_company(id):
    company = Company.query.get_or_404(id)
    inactive_state = State.query.filter_by(name='Inactive').first()

    if not inactive_state:
        return jsonify({"error": "Inactive state not found"}), 500

    try:
        company.state_id = inactive_state.id
        db.session.commit()
        return jsonify({'message': 'Company successfully soft deleted'}), 200
    except Exception as e:
        db.session.rollback()
        logging.error(f"Failed to soft delete company: {e}")
        return jsonify({'error': 'Failed to soft delete company', 'details': str(e)}), 500