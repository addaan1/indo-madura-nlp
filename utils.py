from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import os

class Translator:
    def __init__(self):
        base_path = os.path.dirname(os.path.abspath(__file__))
        self.models = {}
        self.tokenizers = {}
        
        # Paths to models
        # Menggunakan path relative terhadap file utils.py
        path_id_mad = os.path.join(base_path, 'Project_Madura', 'model_indo_ke_madura')
        path_mad_id = os.path.join(base_path, 'Project_Madura', 'model_madura_ke_indo')
        
        try:
            print("Loading Indo -> Madura model...")
            self.tokenizers['id_to_mad'] = AutoTokenizer.from_pretrained(path_id_mad)
            self.models['id_to_mad'] = AutoModelForSeq2SeqLM.from_pretrained(path_id_mad)
            
            print("Loading Madura -> Indo model...")
            self.tokenizers['mad_to_id'] = AutoTokenizer.from_pretrained(path_mad_id)
            self.models['mad_to_id'] = AutoModelForSeq2SeqLM.from_pretrained(path_mad_id)
            print("Models loaded successfully.")
        except Exception as e:
            print(f"Error loading models: {e}")
            # Biarkan kosong atau handle error sesuai kebutuhan
            self.models = {}

    def translate(self, text, direction):
        """
        Translates text using the loaded models.
        Args:
            text (str): Text to translate.
            direction (str): 'id_to_mad' or 'mad_to_id'.
        Returns:
            str: Translated text.
        """
        if not text:
            return ""
            
        if direction not in self.models:
            return "Model belum dimuat atau arah terjemahan salah."

        try:
            tokenizer = self.tokenizers[direction]
            model = self.models[direction]
            
            # Tokenize
            inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=128)
            
            # Generate translation
            outputs = model.generate(**inputs, max_length=128, num_beams=4, early_stopping=True, repetition_penalty=1.2, no_repeat_ngram_size=3)
            
            # Decode
            translated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            return translated_text
        except Exception as e:
            return f"Error during translation: {e}"

# Singleton instance
translator = Translator()

import whisper

class Transcriber:
    def __init__(self):
        try:
            print("Loading Whisper model (base)...")
            self.model = whisper.load_model("base")
            print("Whisper model loaded successfully.")
        except Exception as e:
            print(f"Error loading Whisper model: {e}")
            self.model = None

    def transcribe_audio(self, file_path):
        """
        Transcribes audio file to text using Whisper.
        Args:
            file_path (str): Path to the audio file.
        Returns:
            str: Transcribed text.
        """
        if not self.model:
            return "Error: Whisper model not loaded."
        
        try:
            result = self.model.transcribe(file_path)
            return result["text"].strip()
        except Exception as e:
            return f"Error during transcription: {e}"

# Singleton instance
transcriber = Transcriber()
