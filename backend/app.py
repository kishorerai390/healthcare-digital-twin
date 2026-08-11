from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.get('/')
def home():
    return jsonify({"message": "Healthcare Digital Twin API is running"})


@app.get('/api/health')
def health():
    return jsonify({
        "status": "ok",
        "patient": "Ava Nguyen",
        "risk_score": "low",
        "recovery_progress": 91,
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
