##### Command Description

- python -m venv venv
- .\venv\Scripts\activate
- pip install Flask Flask-SQLAlchemy
- python -m pip install --upgrade pip
- pip freeze
- pip install psycopg2-binary
- pip freeze > requirements.txt
- - # Open a Python shell
    python
    >>> from app import db
    >>> db.create_all()
    >>> exit()
- python -m database.init_db = El uso de -m hace que Python encuentre el módulo database.init_db correctamente en su contexto.
- python run.py
- pip install boto3
- pip install awscli
- python check_connectivity.py
- -  python -m aws.check_connectivity.py
- aws s3 ls : test conection with s3
- pip install flask-marshmallow
- pip install marshmallow-sqlalchemy
- DB Migrate
- - pip install Flask-Cors
- - pip install Flask-Migrate
- - flask db init
- - flask db migrate -m "Added state model"
- - flask db upgrade



#### AWS Services
- Video example: https://youtu.be/ExZPp58jGSo
-   n virginia
- User aws: CuotizationHandyman 
- - Password : see path aws/.csv
- Descliption tyoe: credentials_CuotizationHandyman
- -  Secret key :  see path aws/.csv
- - access_key : see path aws/.csv
- Create file C:\Users\Daniel Vargas\.aws 
- - Create file credentials and save keys 
- - - [default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY

##### Guides

- https://github.com/users/Kenjhy/projects/3/views/1
- https://pypi.org/
- https://flask-sqlalchemy.palletsprojects.com/en/3.1.x/config/
- https://base64.guru/converter/decode/image
- 

####  Step to Setting up AWS credentials

- Step 1: Create or Obtain Access Keys
Create an IAM User:
Go to the AWS Management Console.
Navigate to the IAM (Identity and Access Management) dashboard.
Create a new user or use an existing one. Ensure this user has the correct permissions to access S3 (e.g., AmazonS3FullAccess or a specific bucket policy).
Generate Access Keys:
Under "Security credentials," generate new access keys for the IAM user if none are available.
Save the Access Key ID and Secret Access Key securely. You'll use these for configuration.
Step 2: Set up Credentials on Your System
You can configure AWS credentials in several ways. The two most common approaches are using a credentials file or environment variables.

Option 1: Using the Credentials File
Location: Create a file called credentials in ~/.aws/ (on Linux/macOS) or %USERPROFILE%\.aws\ (on Windows). You may need to create the .aws directory if it doesn't exist.
Structure: Add your credentials in the following structure:
ini
Copy code
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
Replace YOUR_ACCESS_KEY_ID and YOUR_SECRET_ACCESS_KEY with the values you obtained.
Option 2: Using Environment Variables
Set the Variables:
On Windows, you can set environment variables using set in the command prompt or the system properties.
On Linux/macOS, you can set them in your .bashrc or similar configuration file.
bash
Copy code
export AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY
Replace YOUR_ACCESS_KEY_ID and YOUR_SECRET_ACCESS_KEY with the appropriate values.
Step 3: Verify Credentials
After setting up your credentials, you can verify them using the AWS CLI or boto3 in Python.

AWS CLI:
Install the AWS CLI with pip install awscli.
Run aws s3 ls to verify your credentials by listing your available S3 buckets.
Boto3:
Use a simple script to check connectivity:
python
Copy code
import boto3

s3 = boto3.client('s3')
response = s3.list_buckets()
print([bucket['Name'] for bucket in response['Buckets']])
This should help you properly configure your AWS credentials. Let me know if you need help with any specific steps!


- Setting up AWS credentials is more about preparing your environment so that your Flask application can securely communicate with AWS services like S3. The credentials are not part of your project's codebase directly, but they are necessary for your code to access AWS.

Setting Up AWS Credentials
The two approaches (credentials file or environment variables) are meant to provide AWS SDKs and tools (like boto3) access to your AWS account. Here’s how to set up each method in more detail:

Option 1: Using the Credentials File
This is a common method for development on your local machine.

Create the AWS Credentials File:
On Windows: Go to your user directory (e.g., C:\Users\yourusername\) and create a folder named .aws if it doesn't already exist.
On Mac/Linux: This directory is typically in your home directory (~/.aws/).
Inside the .aws folder, create a file named credentials with the following content:

plaintext
Copy code
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
Replace YOUR_ACCESS_KEY_ID and YOUR_SECRET_ACCESS_KEY with the keys you obtained from AWS IAM.

Why This Matters: When you run your Flask application, the boto3 library will automatically look for this credentials file in the default location. You don't need to do anything in your Python code to specify this path; boto3 knows where to look.
Option 2: Using Environment Variables
This method is useful if you are deploying to production environments or prefer not to have credentials stored in a file.

Set Environment Variables:
On Windows:
Open the Start Search, type "env", and select "Edit the system environment variables" > "Environment Variables".
Under "User variables", click "New..." and add AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY with the respective values.
On Mac/Linux:
Open your terminal and edit your shell configuration file (like .bashrc, .zshrc, etc.) by adding:
bash
Copy code
export AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="YOUR_SECRET_ACCESS_KEY"
After saving the file, run source ~/.bashrc (or the appropriate file name) to reload the configuration.
Verifying Credentials
To verify that your credentials are set up correctly and can connect to AWS:

Create a Simple Python Script:
Create a new Python file, perhaps named check_aws.py, in your project directory or anywhere convenient.
Paste the following code:
python
Copy code
import boto3

s3 = boto3.client('s3')
response = s3.list_buckets()
print([bucket['Name'] for bucket in response['Buckets']])
Run this script using python check_aws.py. If your credentials are set up correctly, it will print out the list of S3 bucket names in your AWS account.
By following these steps, you're setting up a secure environment for your application to interact with AWS services without hardcoding sensitive information into your source code. This is crucial for maintaining security and manageability of your application, especially as it grows or moves into production.


#