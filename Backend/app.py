from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load a sentiment analysis model
sentiment_model_name = "nlptown/bert-base-multilingual-uncased-sentiment"
sentiment_tokenizer = AutoTokenizer.from_pretrained(sentiment_model_name)
sentiment_model = AutoModelForSequenceClassification.from_pretrained(sentiment_model_name)
sentiment_pipeline = pipeline("text-classification", model=sentiment_model, tokenizer=sentiment_tokenizer)

# Load a toxicity detection model
toxicity_model_name = "cardiffnlp/twitter-roberta-base-sentiment"
toxicity_tokenizer = AutoTokenizer.from_pretrained(toxicity_model_name)
toxicity_model = AutoModelForSequenceClassification.from_pretrained(toxicity_model_name)
toxicity_pipeline = pipeline("text-classification", model=toxicity_model, tokenizer=toxicity_tokenizer)

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the API!"})

@app.route('/analyze', methods=['POST'])
def analyze_comments():
    data = request.get_json()
    print("Received data:", data)  # Log the received data
    
    # Ensure that 'comments' key is present in the request body
    if not data or 'comments' not in data:
        return jsonify({"error": "No comments provided"}), 400
    
    comments = data['comments']

    # Extract comment text
    comment_texts = [comment['comment'] for comment in comments if 'comment' in comment]

    # Check if there are any comments to analyze
    if not comment_texts:
        return jsonify({"error": "No valid comment texts to analyze"}), 400

    # Detect sentiments using the chosen sentiment model
    sentiment_results = sentiment_pipeline(comment_texts)

    # Detect toxicity using the chosen toxicity model
    toxicity_results = toxicity_pipeline(comment_texts)

    # Count sentiments
    sentiment_counts = {
        'positive': 0,
        'neutral': 0,
        'negative': 0,
        'toxic': 0,
        'other': 0  # To capture other emotions
    }

    # Analyze the results
    # Modify the sentiment mapping based on model-specific labels
    for sentiment_result, toxicity_result in zip(sentiment_results, toxicity_results):
        sentiment_label = sentiment_result['label'].lower()
        toxicity_label = toxicity_result['label'].lower()

        # Categorize based on stars for the sentiment model
        if '5 stars' in sentiment_label or '4 stars' in sentiment_label:
            sentiment_counts['positive'] += 1
        elif '3 stars' in sentiment_label:
            sentiment_counts['neutral'] += 1
        elif '1 star' in sentiment_label or '2 stars' in sentiment_label:
            sentiment_counts['negative'] += 1
        else:
            sentiment_counts['other'] += 1

        # Categorize toxicity based on labels
        if 'negative' in toxicity_label:
            sentiment_counts['toxic'] += 1


    return jsonify(sentiment_counts)

if __name__ == '__main__':
    app.run(debug=True)
