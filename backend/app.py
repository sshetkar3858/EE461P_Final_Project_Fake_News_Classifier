from flask import Flask, jsonify, request
from flask_cors import CORS
from catboost import CatBoostClassifier
import pandas as pd

app = Flask(__name__)
CORS(app)

model = None
model_multi_class = None
model_statement = None
train = None


def load_catboost():
    print(' * Loading Catboost...')
    global model
    model = CatBoostClassifier()
    model.load_model('best_catboost')
    global model_multi_class
    model_multi_class = CatBoostClassifier()
    model_multi_class.load_model('best_catboost_multi_class')
    global model_statement
    model_statement = CatBoostClassifier()
    model_statement.load_model('catboost_just_statement')
    global train
    train = pd.read_csv('train.tsv', delimiter='\t', header=None)
    rename_columns = ['ID', 'label', 'statement', 'subjects', 'speaker', 'speaker_job_title', 'state_info',
                      'party_affiliation', 'barely_true', 'false', 'half_true', 'mostly_true', 'pants_on_fire',
                      'context'
                      ]
    train.columns = rename_columns
load_catboost()

@app.route('/', methods=['GET', 'POST'])
def index():
    for key in request.json:
        print(key)
        print(request.json.get(key))

    data_point = pd.DataFrame()
    speaker = request.json.get('speaker')

    # get associated data
    global train
    try:
        assoc_data = train[train['speaker'] == speaker].iloc[0]
    except:
        load_catboost()
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
    probs_best_model = model.predict_proba(data_point)
    print(probs_best_model)

    global model_multi_class
    probs_best_model_multi_class = model_multi_class.predict_proba(data_point)
    maxIdx = -1
    maxVal = -1
    for i in range(len(probs_best_model_multi_class[0])):
        curr = probs_best_model_multi_class[0][i]
        if curr > maxVal:
            maxVal = curr
            maxIdx = i
    print(probs_best_model_multi_class)

    global model_statement
    probs_model_statement = model_statement.predict_proba(
        pd.DataFrame(data_point['statement']))
    print(probs_model_statement)

    return jsonify({'probTrueBest': probs_best_model[0][1], 'probTrueBestMultiIdx': maxIdx, 'probTrueBestMultiVal': maxVal, 'probTrueStatement': probs_model_statement[0][1]})


if __name__ == '__main__':
    load_catboost()
    app.run()
