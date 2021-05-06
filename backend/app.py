from flask import Flask, jsonify, request
from flask_cors import CORS
from catboost import CatBoostClassifier

app = Flask(__name__)
CORS(app)

model = None


def load_catboost():
    global model
    model = CatBoostClassifier()
    model.load_model('best_catboost')


@app.route('/', methods=['GET', 'POST'])
def index():
    for key in request.json:
        print(key)
        print(request.json.get(key))
    return jsonify({'probTrue': 0.9})


if __name__ == '__main__':
    app.run(debug=True)
