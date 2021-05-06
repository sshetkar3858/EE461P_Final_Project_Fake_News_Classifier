from flask import Flask, jsonify, request
from flask_cors import CORS
from catboost import CatBoostClassifier
import pandas as pd

app = Flask(__name__)
CORS(app)

model = None
train = None


def load_catboost():
    global model
    model = CatBoostClassifier()
    model.load_model('best_catboost')
    global train
    train = pd.read_csv('train.tsv', delimiter='\t', header=None)
    rename_columns = ['ID', 'label', 'statement', 'subjects', 'speaker', 'speaker_job_title', 'state_info',
                      'party_affiliation', 'barely_true', 'false', 'half_true', 'mostly_true', 'pants_on_fire',
                      'context'
                      ]
    train.columns = rename_columns


@app.route('/', methods=['GET', 'POST'])
def index():
    for key in request.json:
        print(key)
        print(request.json.get(key))

    data_point = pd.DataFrame()
    speaker = request.json.get('speaker')

    # get associated data
    global train
    assoc_data = train[train['speaker'] == speaker].iloc[0]
    print(assoc_data)

    data_point['statement'] = [request.json.get('statement')]
    data_point['subjects'] = [request.json.get('subjects')]
    data_point['speaker'] = [speaker]
    data_point['party_affiliation'] = [assoc_data['party_affiliation']]
    data_point['barely_true'] = [assoc_data['barely_true']]
    data_point['false'] = [assoc_data['false']]
    data_point['half_true'] = [assoc_data['half_true']]
    data_point['mostly_true'] = [assoc_data['mostly_true']]
    data_point['pants_on_fire'] = [assoc_data['pants_on_fire']]
    data_point['context'] = [request.json.get('context')]

    print(data_point)

    # predict
    # probs = (0.1, 0.9)
    global model
    probs = model.predict_proba(data_point)
    print(probs)

    return jsonify({'probTrue': probs[0][1]})


if __name__ == '__main__':
    load_catboost()
    app.run()
