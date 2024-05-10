import boto3
import os
from flask import render_template, request, redirect, url_for
from app import app, db
from app.models import Company

#Initialize SE client
s3 = boto3.client('s3')

@app.route('/')
def index():
    companies = Company.query.all()
    print("hello", companies)
    return render_template('index.html', companies=companies)

@app.route('/add')
def add_page():
    return render_template('add.html')

@app.route('/add', methods=['POST'])
def add_company():
    # Handle image upload
    image_file = request.files['image']
    if image_file:
        image_key = f"images/{image_file.filename}"
        s3.upload_fileobj(
            image_file, 
            'cuotization-handyman-mgs', 
            image_key)
        image_url = f"https://cuotization-handyman-mgs.s3.amazonaws.com/{image_key}"
    else:
        image_url = None
    # Retreive form data
    company_name = request.form['company_name']
    contact_name = request.form['contact_name']
    phone = request.form['phone']
    skills = request.form['skills']
    date_of_contact = request.form['date_of_contact']
    date_start_works = request.form['date_start_works']
    working_time = request.form['working_time']
    meeting = request.form['meeting']
    hour_met = request.form['hour_met']
    average_price = request.form['average_price']
    final_price = request.form['final_price']
    workplace = request.form['workplace']
    methods_of_payment = request.form['methods_of_payment']
    work_method = request.form['work_method']
    quote = request.form['quote']
    state = request.form['state']
    online_view = request.form['online_view']
    on_site_view = request.form['on_site_view']
    calification = request.form['calification']
    link = request.form['link']
    details = request.form['details']


    # Create new company entry
    new_company = Company(
        image_path=image_url,
        company_name=company_name, 
        contact_name=contact_name, 
        phone=phone,
        skills=skills,
        date_of_contact=date_of_contact,
        date_start_works=date_start_works,
        working_time=working_time,
        meeting=meeting,
        hour_met=hour_met,
        average_price=average_price,
        final_price=final_price,
        workplace=workplace,
        methods_of_payment=methods_of_payment,
        work_method=work_method,
        quote=quote,
        state=state,
        online_view=online_view,
        on_site_view=on_site_view,
        calification=calification,
        link=link,
        details=details
        )
    
    # Code to add a company
    db.session.add(new_company)
    db.session.commit()

    return redirect(url_for('index'))


@app.route('/edit/<int:id>', methods=['GET', 'POST'])
def edit_company(id):
    # Code to edit a company
    return render_template('edit.html', company=company)

@app.route('/delete/<int:id>')
def delete_company(id):
    # Code to delete a company
    return redirect(url_for('index'))
