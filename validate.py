from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from detoxify import Detoxify

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017")
db = client["users"]
collection = db["users"]

@app.route('/validate', methods=['POST'])
def validate_user():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required"}), 400

    user = collection.find_one({"email": email})
    if user and (user["password"] == password):
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401


@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"success": False, "message": "All fields are required"}), 400

    if collection.find_one({"email": email}):
        return jsonify({"success": False, "message": "User already exists"}), 400
    collection.insert_one({
        "name": name,
        "email": email,
        "password": password,
    })

    return jsonify({"success": True, "message": "User registered successfully"}), 201


@app.route('/check', methods=['POST'])
def check_toxicity():
    try:
        data = request.json
        if not data or 'text' not in data:
            return jsonify({'error': 'Invalid request. Text field is required.'}), 400
        text = data['text']
        results = Detoxify('unbiased').predict(text)
        results = {key: float(value) for key, value in results.items()}
        return jsonify(results), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=False)
