from flask_marshmallow import Marshmallow
from app import app
from app.models import Company

ma = Marshmallow(app)

class CompanySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Company
        load_instance = True


def init_app(app):
    ma.init_app(app)


# class CompanySchema(ma.Schema):
#     class Meta:
#         fields=('id','image_path','company_name',
#                 'contact_name','phone','skills',
#                 'creation_date','date_of_contact',
#                 'date_start_works','working_time',
#                 'meeting','hour_meet','average_price',
#                 'final_price','workplace','methods_of_payment',
#                 'work_method','quote','state',
#                 'online_view','on_site_view','calification',
#                 'link','details')
        
# companySchema = CompanySchema()
# companySchema = CompanySchema(many=True)