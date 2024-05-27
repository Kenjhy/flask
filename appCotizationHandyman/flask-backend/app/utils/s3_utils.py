import os
import boto3
import base64
import re
import logging
from io import BytesIO

#Initialize SE client
s3 = boto3.client('s3')
BUCKET_NAME = os.getenv('S3_BUCKET_NAME')

def upload_image_to_s3(image_base64, company_name):
    if image_base64:
        try:
            # Extract content type and decode the image, deparate header from base64 content
            content_type, encoded = image_base64.split(';base64,')
            # Decode the base64 portion to bytes
            image_data = base64.b64decode(encoded)
            #Extract header image type
            image_type = re.search(r'image/(.+)', content_type).group(1)
            # Generate a fle name
            image_key = f"images/{company_name}.{image_type}"
            # Upload the file to s3
            s3.upload_fileobj(
                BytesIO(image_data), 
                BUCKET_NAME, 
                image_key,
                ExtraArgs={'ContentType': content_type.replace('data:', '')}
            )
            # Construct the image URL
            return f"https://{BUCKET_NAME}.s3.amazonaws.com/{image_key}"
        except Exception as e:
            logging.error("Failed to process image: %s", e)
            return None
    return None

def delete_image_from_s3(image_path):
    if image_path:
        image_key_parts = image_path.split(f"{BUCKET_NAME}.s3.amazonaws.com/")
        if len(image_key_parts) == 2:
            image_key = image_key_parts[1]
            s3.delete_object(Bucket=BUCKET_NAME, Key=image_key)
