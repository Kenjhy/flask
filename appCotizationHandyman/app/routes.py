import boto3
import os
from flask import request, jsonify
from app import app, db
from app.models import Company
from app.schemas import CompanySchema
from datetime import datetime
import re, base64, logging
from io import BytesIO

company_schema = CompanySchema()
companies_schema = CompanySchema(many=True)

# Initialize logging
logging.basicConfig(level=logging.INFO)

#Initialize SE client
s3 = boto3.client('s3')


@app.route('/api/companies', methods=['GET'])
def get_companies():
    companies = Company.query.all()
    return jsonify(companies_schema.dump(companies))

@app.route('/api/companies', methods=['POST'])
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

    #Safely parse(date_srt):
    def parse_date(date_str):
        if date_str is None:
            return None
        try:
            return datetime.strptime(date_str, '%Y-%m-%d')
        except ValueError:
            return None

    # Process other fields and create Company instance
    new_company = Company(
        image_path=image_url,
        company_name=data.get('company_name', ''),
        contact_name=data['contact_name'],
        phone=data['phone'],
        skills=data.get('skills',''),
        # creation_date=datetime.strptime(data['creation_date'], '%Y-%m-%d') if data.get('creation_date') else None,
        date_of_contact=parse_date(data.get('date_of_contact')),
        date_start_works=parse_date(data.get('date_start_works')),
        working_time=int(data.get('working_time', 0)) if data.get('working_time') else None,
        meeting=parse_date(data.get('meeting')),
        hour_meet=data['hour_meet'] if data.get('hour_meet') else None,
        average_price=float(data.get('average_price', 0)),
        final_price=float(data.get('final_price', 0)),
        workplace=data.get('workplace', ''),
        methods_of_payment=data.get('methods_of_payment', ''),
        work_method=data.get('work_method', ''),
        quote=data.get('quote', ''),
        state=data.get('state', ''),
        online_view=data.get('online_view', ''),
        on_site_view=data.get('on_site_view', ''),
        calification=float(data.get('calification', 0)),
        link=data.get('link', ''),
        details=data.get('details', '')
    )
    
    # Code to add a company, ad new company to database session and confirm
    db.session.add(new_company)
    db.session.commit()
    return jsonify(company_schema.dump(new_company)), 201
    # return company_schema.jsonify(new_company), 201 


@app.route('/api/companies/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def handle_company(id):
    company = Company.query.get_or_404(id)
    if request.method == 'GET':
        return jsonify(company_schema.dump(company))
    elif request.method == 'PUT':
        # Update company details
        return jsonify(company_schema.dump(company))
    elif request.method == 'DELETE':
        db.session.delete(company)
        db.session.commit()
        return jsonify({'message': 'Deleted'})
    

@app.route('/get', methods=['GET'])
def get_companiestwo():
    return jsonify({"Hello": "World"})