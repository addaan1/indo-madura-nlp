from flask import Flask, render_template, request, jsonify
from utils import translator, transcriber
import os
import tempfile

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

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
    
    audio_file = request.files['audio']
    if audio_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Save to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_audio:
        temp_path = temp_audio.name
        audio_file.save(temp_path)
    
    try:
        # Transcribe
        transcribed_text = transcriber.transcribe_audio(temp_path)
        return jsonify({'transcribed_text': transcribed_text})
    finally:
        # Clean up
        if os.path.exists(temp_path):
            os.remove(temp_path)

if __name__ == '__main__':
    app.run(debug=True)
