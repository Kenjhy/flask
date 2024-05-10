from app import db
from datetime import datetime

class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image_path = db.Column(db.String(255))
    company_name = db.Column(db.String(100))
    contact_name = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    skills = db.Column(db.String(200))
    date_of_contact = db.Column(db.DateTime)
    date_start_works = db.Column(db.DateTime)
    working_time = db.Column(db.Integer)
    meeting = db.Column(db.DateTime)
    hour_meet = db.Column(db.String(10))
    average_price = db.Column(db.Float)
    final_price = db.Column(db.Float)
    workplace = db.Column(db.String(100))
    methods_of_payment = db.Column(db.String(200))
    work_method = db.Column(db.String(100))
    quote = db.Column(db.String(50))
    state = db.Column(db.String(50))
    online_view = db.Column(db.String(50))
    on_site_view = db.Column(db.String(50))
    calification = db.Column(db.Float)
    link = db.Column(db.String(200))
    details = db.Column(db.String(500))

    def __repr__(self):
        return f'<Company {self.company_name}>'
    