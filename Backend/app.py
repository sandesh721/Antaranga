from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS  

app = Flask(__name__)
CORS(app)  

sentiment_analysis = pipeline("sentiment-analysis")

@app.route('/analyze', methods=['POST'])
def analyze_comments():
    data = request.json
    comments = data.get('comments', [])

    comment_texts = [comment['comment'] for comment in comments]

    sentiment_results = sentiment_analysis(comment_texts)

    
    sentiment_counts = {'positive': 0, 'neutral': 0, 'negative': 0}

    for result in sentiment_results:
        if result['label'] == 'POSITIVE':
            sentiment_counts['positive'] += 1
        elif result['label'] == 'NEGATIVE':
            sentiment_counts['negative'] += 1
        else:
            sentiment_counts['neutral'] += 1

    return jsonify(sentiment_counts)

if __name__ == '__main__':
    app.run(debug=True)
