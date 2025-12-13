from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
import math

class Translator:
    def __init__(self):
        self.model_name = "addinda/cendol-mt5-id-mad-15ep"
        try:
            print(f"Loading HuggingFace model: {self.model_name}...")
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            self.model = AutoModelForSeq2SeqLM.from_pretrained(self.model_name)
            print("Model loaded successfully.")
        except Exception as e:
            print(f"Error loading model: {e}")
            self.model = None
            self.tokenizer = None

    def translate(self, text, direction):
        """
        Translates text using the loaded model.
        Args:
            text (str): Text to translate.
            direction (str): 'id_to_mad' or 'mad_to_id'.
        Returns:
            dict: {'text': translated_text, 'score': confidence_score}
        """
        if not text:
            return {'text': "", 'score': 0.0}
            
        if not self.model or not self.tokenizer:
            return {'text': "Model belum dimuat.", 'score': 0.0}

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
            # Since we use beam search, we get multiple sequences
            # We'll use the first (best) sequence for scoring
            transition_scores = self.model.compute_transition_scores(
                outputs.sequences, outputs.scores, beam_indices=outputs.beam_indices, normalize_logits=True
            )
            
            # Get scores for the first (best) beam only
            # transition_scores shape: (batch_size, sequence_length)
            # Since batch_size=1 and we have beams, we take the first beam
            if transition_scores.dim() > 1:
                first_beam_scores = transition_scores[0]  # Get first beam
            else:
                first_beam_scores = transition_scores
            
            # Calculate mean log probability
            # Sum the log probabilities and divide by number of tokens
            total_log_prob = torch.sum(first_beam_scores)
            num_tokens = first_beam_scores.shape[0]
            
            if num_tokens > 0:
                mean_log_prob = total_log_prob / num_tokens
                # Convert to confidence (exp of mean log prob)
                # This gives us a value between 0 and 1
                confidence = math.exp(mean_log_prob.item())
                
                # Boost confidence score for UI visualization
                # Raw probability is often low for sequences (e.g. 0.2-0.4 is actually good)
                # We apply a square root transformation to boost it: 0.25 -> 0.5, 0.49 -> 0.7
                boosted_confidence = math.sqrt(confidence)
                
                # Clip to reasonable range and convert to percentage
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
