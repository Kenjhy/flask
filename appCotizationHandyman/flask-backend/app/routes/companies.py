from flask import request, jsonify
from app import db
# from app.models import Company, State, Rating
from app.models.company_model import Company
from app.models.state_model import State
from app.models.rating_model import Rating
# from app.schemas import CompanySchema
from app.schemas.company_schema import CompanySchema
import boto3
import base64
import re
import logging
from io import BytesIO
from datetime import datetime
from . import company_bp

company_schema = CompanySchema()
companies_schema = CompanySchema(many=True)

# Initialize logging
logging.basicConfig(level=logging.INFO)

#Initialize SE client
s3 = boto3.client('s3')


"""Safely parses a date string to a datetime object."""
def parse_date(date_str):
    if date_str is None:
        return None
    try:
        return datetime.strptime(date_str, '%Y-%m-%d')
    except ValueError:
        return None
    
def parse_datetime(datetime_str):
    """Safely parses a datetime string to a datetime object including time with timezone."""
    if datetime_str is None:
        return None
    try:
        # Parse the datetime string to include the timezone information if present
        return datetime.fromisoformat(datetime_str)
    except ValueError:
        return None

def safe_float(value, default=None):
    """Try to convert a value to float. Return a default value if the conversion fails."""
    try:
        return float(value)
    except (TypeError, ValueError):
        return default
    

@company_bp.route('/companies', methods=['GET'], strict_slashes=False)
def get_companies():
    companies = Company.query.all()
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
    image_url = None
    image_base64 = data['image_base64']
    if image_base64:
        try:
            # Extract content type and decode the image, deparate header from base64 content
            content_type, encoded = image_base64.split(';base64,')
            # Decode the base64 portion to bytes
            image_data = base64.b64decode(encoded)
            #Extract header image type
            image_type = re.search(r'image/(.+)', content_type).group(1) # Extract the type of the image (e.g. jpg, png)
            # Generate a fle name
            image_key = f"images/{data['company_name']}.{image_type}"
            # Upload the file to s3
            s3.upload_fileobj(
                BytesIO(image_data), 
                'cuotization-handyman-mgs', 
                image_key,
                ExtraArgs={'ContentType': content_type.replace('data:', '')}
            )
            # Construct the image URL
            image_url = f"https://cuotization-handyman-mgs.s3.amazonaws.com/{image_key}"
        except Exception as e:
            logging.error("Failed to process image: %s", e)
            return jsonify({"error": "Failed to process the image.", "details": str(e)}), 500
        

    # Manejar el estado opcionalmente
    state_id = None
    if data.get('state_id'):
        state = State.query.get(data['state_id'])
        if not state:
            return jsonify({"error": "Invalid state provided"}), 400
        state_id = state.id

    rating_id = None
    if data.get('rating_id'):
        rating = Rating.query.get(data['rating_id'])
        if not rating:
            return jsonify({"error": "Invalid rating provided"}), 400
        rating_id = rating.id
    
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
        image_base64 = data.get('image_base64')
        if image_base64:
            try: 
                content_type_header, encoded = image_base64.split(';base64,')
                image_data = base64.b64decode(encoded)
                image_type = re.search(r'image/(.+)', content_type_header).group(1)
                image_key = f"images/{data['company_name']}.{image_type}"
                s3.upload_fileobj(
                    BytesIO(image_data),
                    'cuotization-handyman-mgs', 
                    image_key,
                    ExtraArgs={'ContentType': content_type_header.replace('data:', '')},
                )
                company.image_path = f"https://cuotization-handyman-mgs.s3.amazonaws.com/{image_key}"
            except Exception as e:
                logging.error("Failed to update image: %s", e)
                return jsonify({"error": "Failed to update the image.", "details": str(e)}), 500
         
        # Update other fields
        company.company_name = data.get('company_name', company.company_name)
        company.contact_name = data.get('contact_name', company.contact_name)
        company.phone = data.get('phone', company.phone)
        company.skills = data.get('skills', company.skills)
        company.date_of_contact = parse_date(data.get('date_of_contact'))
        company.date_start_works = parse_date(data.get('date_start_works'))
        company.working_time = int(data['working_time']) if data.get('working_time') is not None else company.working_time
        company.meeting = parse_datetime(data.get('meeting'))
        company.average_price = float(data['average_price']) if data.get('average_price') is not None else company.average_price
        company.final_price = float(data['final_price']) if data.get('final_price') is not None else company.final_price
        company.workplace = data.get('workplace', company.workplace)
        company.methods_of_payment = data.get('methods_of_payment', company.methods_of_payment)
        company.work_method = data.get('work_method', company.work_method)
        company.quote = data.get('quote', company.quote)
        # Handle state update
        state_id = data.get('state_id')
        if state_id:
            state = State.query.get(state_id)
            if not state:
                return jsonify({"error": "Invalid state provided"}), 400
            company.state_id = state.id
        else:
            company.state_id = None  # Allow null state if no state_id is provided
            
        company.online_view = data.get('online_view', company.online_view)
        company.on_site_view = data.get('on_site_view', company.on_site_view)

        rating_id = data.get('rating_id')
        if rating_id:
            rating = Rating.query.get(rating_id)
            if not rating:
                return jsonify({"error": "Invalid rating provided"}), 400
            company.rating_id = rating.id
        else:
            company.rating_id = None
            
        company.link = data.get('link', company.link)
        company.details = data.get('details', company.details)

        db.session.commit()
        return jsonify(company_schema.dump(company))
    elif request.method == 'DELETE':
        if not company:
            logging.info("Attempt todelete  non-exixtent company with ID: {id}")
            return jsonify({'message': 'Company not found'}), 404
        
        try:    
            db.session.delete(company)
            db.session.commit()
            logging.info(f"Company with {id} was successfully deleted.")
            return jsonify({'message': 'Company successfully deleted.'}), 200
        except Exception as e:
            db.session.rollback() # Rollback the session in case of an error
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