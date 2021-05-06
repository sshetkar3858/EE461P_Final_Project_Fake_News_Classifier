from catboost import CatBoostClassifier
import pandas as pd

if __name__ == '__main__':
    model = CatBoostClassifier()
    model.load_model('best_catboost')

    data_point = pd.DataFrame()

    data_point['statement'] = [
        'The federal minimum wage is worth about 20 percent less than it was when Ronald Reagan gave his first address to a joint session of Congress.']
    data_point['subjects'] = ['economy,history,income,workers']
    data_point['speaker'] = ['barack-obama']
    data_point['party_affiliation'] = ['democrat']
    data_point['barely_true'] = [70]
    data_point['false'] = [71]
    data_point['half_true'] = [160]
    data_point['mostly_true'] = [163]
    data_point['pants_on_fire'] = [9]
    data_point['context'] = ['the State of the Union address']

    probs = model.predict_proba(data_point)
    print(probs)
