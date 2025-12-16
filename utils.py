from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
import math
import re
import csv
import os

class LanguageDetector:
    def __init__(self):
        self.indo_keywords = set()
        self.madura_keywords = set()
        # Distinctive Madurese character sequences (digraphs/special chars)
        self.madura_markers = ['â', 'è', 'bh', 'dh', 'jh', 'gh', "o'"]
        
        self.load_vocabulary()

    def load_vocabulary(self):
        """Loads vocabulary from datasets to build usage frequency/uniqueness."""
        base_path = os.path.dirname(os.path.abspath(__file__))
        # List of dataset files
        files = [
            "Dataset/train.csv",
            "Dataset/test (1).csv",
            "Dataset/valid.csv",
            "Dataset/madurese.csv"
        ]
        
        all_indo_words = set()
        all_madura_words = set()
        
        print("Loading datasets for language detection...")
        for rel_path in files:
            full_path = os.path.join(base_path, rel_path)
            if not os.path.exists(full_path):
                print(f"Warning: Dataset not found at {full_path}")
                continue
                
            try:
                with open(full_path, mode='r', encoding='utf-8', errors='ignore') as f:
                    reader = csv.DictReader(f)
                    for row in reader:
                        # Normalize headers: remove spaces, lowercase
                        clean_row = {k.strip().lower(): v for k, v in row.items() if k}
                        
                        # Extract Indonesian words
                        if 'indonesian' in clean_row and clean_row['indonesian']:
                             words = self._tokenize(clean_row['indonesian'])
                             all_indo_words.update(words)
                             
                        # Extract Madurese words
                        if 'madurese' in clean_row and clean_row['madurese']:
                             words = self._tokenize(clean_row['madurese'])
                             all_madura_words.update(words)
            except Exception as e:
                print(f"Error reading {rel_path}: {e}")

        # Determine unique keywords (words that generally appear only in one language)
        # We start with proper unique set difference
        self.indo_keywords = all_indo_words - all_madura_words
        self.madura_keywords = all_madura_words - all_indo_words
        
        print(f"Language Detection Ready. Loaded {len(self.indo_keywords)} unique Indo words and {len(self.madura_keywords)} unique Madura words.")

    def _tokenize(self, text):
        """Simple tokenizer that lowers case and keeps apostrophes."""
        text = text.lower()
        # Remove non-alphanumeric chars except apostrophe
        text = re.sub(r"[^\w\s']", ' ', text)
        return text.split()


    def detect(self, text):
        """
        Detects if text is likely 'mad' (Madurese) or 'id' (Indonesian).
        Returns tuple: ('mad'/'id'/'ambiguous', float_ratio_of_madura)
        """
        if not text:
            return 'ambiguous', 0.0

            
        text_lower = text.lower()
        
        # 1. Check for strong Madurese orthography markers
        # These are very specific to the dataset/spelling used
        for marker in self.madura_markers:
            if marker in text_lower:
                return 'mad', 1.0


        # 2. Tokenize (simple split by non-word chars, keeping apostrophes for Madurese like lo', sengko')
        # We replace punctuation (except apostrophe) with space
        clean_text = re.sub(r"[^\w\s']", ' ', text_lower)
        tokens = set(clean_text.split())
        
        # 3. Keyword intersection
        madura_matches = tokens.intersection(self.madura_keywords)
        indo_matches = tokens.intersection(self.indo_keywords)
        
        madura_score = len(madura_matches)
        indo_score = len(indo_matches)
        
        madura_score = len(madura_matches)
        indo_score = len(indo_matches)
        total_score = madura_score + indo_score
        
        if total_score == 0:
             return 'ambiguous', 0.0
             
        # Calculate Madurese Ratio (Madurese / Total Detected)
        madura_ratio = madura_score / total_score
        
        if madura_ratio > 0.5:
            return 'mad', madura_ratio
        elif madura_ratio < 0.5:
            return 'id', madura_ratio
        else:
            return 'ambiguous', 0.5



class Translator:
    def __init__(self):
        # Define available models
        self.AVAILABLE_MODELS = {
            "mad_to_indo": "addinda/google-mt5-madura-indo",
            "indo_to_mad": "addinda/cendol-mt5-id-mad-inmad-mix"
        }
        self.current_model_key = None
        self.model = None
        self.tokenizer = None
        
        # We don't load a default model initially to save resources until first request
        # or we can load one default. Let's load indo_to_mad as default.
        self.detector = LanguageDetector()
        self.load_model("indo_to_mad")


    def load_model(self, model_key):
        """Loads the specified model if not already loaded."""
        if model_key == self.current_model_key and self.model is not None:
            return True, "Model already loaded"
            
        if model_key not in self.AVAILABLE_MODELS:
            return False, f"Model key '{model_key}' not found"

        model_name = self.AVAILABLE_MODELS[model_key]
        print(f"Switching to model: {model_name}...")
        
        # Unload previous model to free memory (simple garbage collection attempt)
        if self.model is not None:
            del self.model
            del self.tokenizer
            torch.cuda.empty_cache() if torch.cuda.is_available() else None
            
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(model_name)
            self.model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
            self.current_model_key = model_key
            print(f"Model '{model_key}' loaded successfully.")
            return True, "Success"
        except Exception as e:
            print(f"Error loading model {model_name}: {e}")
            self.model = None
            self.tokenizer = None
            self.current_model_key = None
            return False, str(e)

    def translate(self, text, direction):
        """
        Translates text using the specified model.
        Args:
            text (str): Text to translate.
            direction (str): 'id_to_mad' or 'mad_to_id'.
        Returns:
            dict: {'text': translated_text, 'score': confidence_score}
        """
        if not text:
            return {'text': "", 'score': 0.0}

        # --- Language Detection Check ---
        detected_lang, madura_ratio = self.detector.detect(text)
        print(f"Input: '{text}' | Detected: {detected_lang} (MadRatio: {madura_ratio:.2f}) | Direction: {direction}")
        
        # Prevent redundant translation:
        # If User wants ID->Mad, but inputs Madurese (>50% match) -> Return Input
        if direction == 'id_to_mad' and madura_ratio > 0.5:
            print("Skipping translation: Input detected as Madurese (>50%).")
            return {'text': text, 'score': 100.0}
            
        # If User wants Mad->ID, but inputs Indonesian (<50% Madurese match, i.e., >50% Indo) -> Return Input
        if direction == 'mad_to_id' and madura_ratio < 0.5 and detected_lang != 'ambiguous':
            print("Skipping translation: Input detected as Indonesian (>50%).")
            return {'text': text, 'score': 100.0}
        # --------------------------------



        # Determine model key based on direction
        if direction == 'mad_to_id':
             target_model_key = "mad_to_indo"
        else:
             target_model_key = "indo_to_mad"

        # Ensure correct model is loaded
        if self.current_model_key != target_model_key:
            success, msg = self.load_model(target_model_key)
            if not success:
                return {'text': f"Error loading model: {msg}", 'score': 0.0}
            
        if not self.model or not self.tokenizer:
            return {'text': "Model failed to load.", 'score': 0.0}

        try:
            # Set prefix based on direction
            prefix = "translate Indonesian to Madurese: " if direction == 'id_to_mad' else "translate Madurese to Indonesian: "
            input_text = prefix + text
            
            # Tokenize
            inputs = self.tokenizer(input_text, return_tensors="pt", padding=True, truncation=True, max_length=128)
            
            # Generate translation with scores
            outputs = self.model.generate(
                **inputs, 
                max_length=128, 
                num_beams=4, 
                early_stopping=True, 
                repetition_penalty=1.2, 
                no_repeat_ngram_size=3,
                return_dict_in_generate=True, 
                output_scores=True
            )
            
            # Decode (use first/best beam)
            translated_text = self.tokenizer.decode(outputs.sequences[0], skip_special_tokens=True)
            
            # Calculate confidence score
            transition_scores = self.model.compute_transition_scores(
                outputs.sequences, outputs.scores, beam_indices=outputs.beam_indices, normalize_logits=True
            )
            
            # Get scores for the first (best) beam only
            if transition_scores.dim() > 1:
                first_beam_scores = transition_scores[0]
            else:
                first_beam_scores = transition_scores
            
            # Calculate mean log probability
            total_log_prob = torch.sum(first_beam_scores)
            num_tokens = first_beam_scores.shape[0]
            
            if num_tokens > 0:
                mean_log_prob = total_log_prob / num_tokens
                confidence = math.exp(mean_log_prob.item())
                # Boost confidence score for UI visualization
                boosted_confidence = math.sqrt(confidence)
                boosted_confidence = min(boosted_confidence, 1.0)
                score = round(boosted_confidence * 100, 2)
            else:
                score = 0.0
            
            return {'text': translated_text, 'score': score}
        except Exception as e:
            print(f"Error during translation: {e}")
            import traceback
            traceback.print_exc()
            return {'text': f"Error: {str(e)}", 'score': 0.0}

# Singleton instance
translator = Translator()

import whisper
import shutil

class Transcriber:
    def __init__(self):
        self.ffmpeg_available = shutil.which("ffmpeg") is not None
        if not self.ffmpeg_available:
            print("WARNING: FFmpeg not found! Transcription will fail.")
            
        try:
            print("Loading Whisper model (small) for better Indonesian support...")
            # 'small' is a good balance for multilingual/Indonesian
            self.model = whisper.load_model("small")
            print("Whisper model (small) loaded successfully.")
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
        
        if not self.ffmpeg_available:
             # Re-check in case added to PATH after start
             if shutil.which("ffmpeg") is None:
                 return "Error: FFmpeg is not installed on the server. Please install FFmpeg to use voice features."

        try:
            # Set language to Indonesian ('id') to help with Madurese (as dialect/related)
            result = self.model.transcribe(file_path, language='id')
            return result["text"].strip()
        except Exception as e:
            return f"Error during transcription: {str(e)}"

# Singleton instance
transcriber = Transcriber()
