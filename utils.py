from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
import math

class Translator:
    def __init__(self):
        # Define available models
        self.AVAILABLE_MODELS = {
            "base": "addinda/cendol-mt5-id-mad-15ep",
            "mix": "addinda/cendol-mt5-id-mad-inmad-mix"
        }
        self.current_model_key = None
        self.model = None
        self.tokenizer = None
        
        # Load default model initially
        self.load_model("base")

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

    def translate(self, text, direction, model_key="base"):
        """
        Translates text using the specified model.
        Args:
            text (str): Text to translate.
            direction (str): 'id_to_mad' or 'mad_to_id'.
            model_key (str): Key of the model to use ('base' or 'mix').
        Returns:
            dict: {'text': translated_text, 'score': confidence_score}
        """
        if not text:
            return {'text': "", 'score': 0.0}

        # Ensure correct model is loaded
        if self.current_model_key != model_key:
            success, msg = self.load_model(model_key)
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
