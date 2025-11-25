from flask import Flask, render_template, request, jsonify
from utils import translator

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/translate', methods=['POST'])
def translate():
    data = request.get_json()
    text = data.get('text', '')
    direction = data.get('direction', 'id_to_mad')
    
    translated_text = translator.translate(text, direction)
    
    return jsonify({'translated_text': translated_text})

if __name__ == '__main__':
    app.run(debug=True)
