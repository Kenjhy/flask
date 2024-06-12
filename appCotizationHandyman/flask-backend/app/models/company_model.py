from app import db

class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image_path = db.Column(db.String(255))
    company_name = db.Column(db.String(100))
    contact_name = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    skills = db.Column(db.String(200))
    creation_date = db.Column(db.Date,  default=db.func.current_date())
    date_of_contact = db.Column(db.Date)
    date_start_works = db.Column(db.Date)
    working_time = db.Column(db.Integer)
    meeting = db.Column(db.DateTime)
    average_price = db.Column(db.Float)
    final_price = db.Column(db.Float)
    workplace = db.Column(db.String(100))
    methods_of_payment = db.Column(db.String(200))
    work_method = db.Column(db.String(100))
    quote = db.Column(db.String(50))
    years_of_experience = db.Column(db.Integer)
    state_id = db.Column(db.Integer, db.ForeignKey('state.id'), nullable=True)
    state = db.relationship('State')
    online_view = db.Column(db.String(50))
    on_site_view = db.Column(db.String(50))
    rating_id = db.Column(db.Integer, db.ForeignKey('rating.id'), nullable=True)
    rating = db.relationship('Rating')
    link = db.Column(db.String(200))
    details = db.Column(db.Text())

    def __repr__(self):
        return f'<Company {self.company_name}>'