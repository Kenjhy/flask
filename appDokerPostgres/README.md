py -m venv .venv
.venv\Scripts\activate
python -m pip install --upgrade pip
pip freeze
 "" > requirements.txt
docker ps -a
docker compose up -d flask_db
docker compose up flask_app  
docker compose up --build flask_app

uvicorn main:app --reload


https://github.com/FrancescoXX/flask-crud-live/tree/main
https://www.youtube.com/watch?v=fHQWTsWqBdE&ab_channel=FrancescoCiulla