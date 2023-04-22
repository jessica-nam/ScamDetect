# Python backend made using Flask
from flask import Flask, request, jsonify, render_template
#import streamlit as st
import pickle
import string
import nltk
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
import sys

app = Flask(__name__)
ps = PorterStemmer()

# misc: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
# virtual env activation: .\venv\Scripts\Activate
# compilation: streamlit run app.py

def transform_text(text):
    text = text.lower()
    text = nltk.word_tokenize(text)
    
    y = []
    for i in text:
        if i.isalnum():
            y.append(i)
            
    text = y[:]
    y.clear()
    
    for i in text:
        if i not in stopwords.words('english') and i not in string.punctuation:
            y.append(i)
            
    text = y[:]
    y.clear()
    
    for i in text:
        y.append(ps.stem(i))
            
    return " ".join(y)

tfidf = pickle.load(open('vectorizer.pkl', 'rb'))
model = pickle.load(open('model.pkl', 'rb'))


# st.title("Sus of a scam?")
# input_sms = st.text_input("Copy and paste it here!")

# # preprocess
# transformed_sms = transform_text(input_sms)

# # vectorize
# vector_input = tfidf.transform([transformed_sms])

# # predict
# result = model.predict(vector_input)[0]

# # display
# if result == 1:
#     st.header("Spam")
# else:
#     st.header("Not spam")

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    input_sms = request.json['input_sms']
    transformed_sms = transform_text(input_sms)
    vector_input = tfidf.transform([transformed_sms])
    result = model.predict(vector_input)[0]
    
    print("Input SMS:", input_sms, file=sys.stderr)
    print("Transformed SMS:", transformed_sms, file=sys.stderr)
    print("Result:", result, file=sys.stderr)
    
    return jsonify({'result': int(result)})

if __name__ == '__main__':
    app.run(debug=True)