import os
from typing import Dict, List, Tuple, Optional
import torch
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
from transformers import RobertaTokenizer, RobertaForSequenceClassification
import pandas as pd
import numpy as np
from sklearn.metrics import classification_report, confusion_matrix
import logging
import re
from datetime import datetime
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load Hugging Face token from environment or .env and ensure Transformers can use it
def _configure_hf_authentication() -> None:
    """Ensure HF auth token is available in environment for model downloads.
    Loads from project-root .env or current directory .env if present.
    Accepts any of: HUGGINGFACE_HUB_TOKEN, HF_TOKEN, HUGGINGFACE_TOKEN.
    Sets both HUGGINGFACE_HUB_TOKEN and HF_TOKEN for maximum compatibility.
    """
    try:
        # Try loading .env from project root and current working directory
        project_root_env = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
        load_dotenv(dotenv_path=project_root_env)
        load_dotenv()  # fallback to CWD

        token = (
            os.getenv("HUGGINGFACE_HUB_TOKEN")
            or os.getenv("HF_TOKEN")
            or os.getenv("HUGGINGFACE_TOKEN")
        )

        if token:
            # Export to both common env var names
            os.environ["HUGGINGFACE_HUB_TOKEN"] = token
            os.environ["HF_TOKEN"] = token
            # Some tools also read this name
            os.environ.setdefault("TRANSFORMERS_TOKEN", token)
            logger.info("Hugging Face token configured from environment/.env")
        else:
            logger.warning("Hugging Face token not found; model downloads may require authentication")
    except Exception as e:
        logger.warning(f"Could not configure Hugging Face authentication: {e}")

_configure_hf_authentication()

# Check GPU availability
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
logger.info(f"Using device: {device}")

class MentalHealthCrisisDetector:
    """
    Advanced AI pipeline for mental health crisis detection
    Combines sentiment analysis, keyword detection, and contextual analysis
    """
    
    def __init__(self):
        self.device = device
        self.sentiment_analyzer = None
        self.mental_health_model = None
        self.crisis_keywords = self._load_crisis_keywords()
        self.model_cache = {}
        
        # Initialize models
        self._load_models()
    
    def _load_models(self):
        """Load pre-trained models for sentiment analysis and crisis detection"""
        try:
            # Primary sentiment analysis model - using a publicly available model
            logger.info("Loading sentiment analysis model...")
            self.sentiment_analyzer = pipeline(
                "sentiment-analysis",
                model="distilbert-base-uncased-finetuned-sst-2-english",
                device=0 if torch.cuda.is_available() else -1
            )
            
            # Mental health specific model fallback - use general sentiment for demo
            logger.info("Using general sentiment model for mental health analysis...")
            self.mental_health_model = self.sentiment_analyzer
            
            logger.info("Models loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading models: {e}")
            logger.warning("Falling back to simple keyword-based analysis")
            self.sentiment_analyzer = None
            self.mental_health_model = None
    
    def _load_crisis_keywords(self) -> Dict[str, List[str]]:
        """Load crisis detection keywords by language and severity"""
        return {
            'en': {
                'suicide': ['suicide', 'kill myself', 'end it all', 'better off dead', 'want to die', 
                           'take my own life', 'end my life', 'no point living', 'suicidal thoughts'],
                'self_harm': ['cut myself', 'hurt myself', 'self harm', 'self-harm', 'cutting',
                             'burning myself', 'self injury', 'self-injury'],
                'violence': ['hurt someone', 'kill someone', 'violent thoughts', 'harm others',
                            'murder', 'attack', 'violent urges'],
                'substance': ['overdose', 'too many pills', 'drink myself to death', 'substance abuse'],
                'emergency': ['emergency', 'urgent', 'help me now', 'crisis', 'immediate help']
            },
            'es': {
                'suicide': ['suicidio', 'matarme', 'terminar todo', 'mejor muerto', 'quiero morir'],
                'self_harm': ['cortarme', 'lastimarme', 'autolesión', 'hacerme daño'],
                'violence': ['lastimar a alguien', 'matar a alguien', 'pensamientos violentos'],
                'emergency': ['emergencia', 'urgente', 'ayuda ahora', 'crisis']
            },
            # Add more languages as needed
        }
    
    def detect_language(self, text: str) -> str:
        """Simple language detection (would use proper ML model in production)"""
        # Basic heuristic for demo
        spanish_words = ['el', 'la', 'es', 'de', 'que', 'y', 'en']
        words = text.lower().split()
        spanish_count = sum(1 for word in words if word in spanish_words)
        
        if spanish_count > len(words) * 0.3:
            return 'es'
        return 'en'  # Default to English
    
    def analyze_sentiment(self, text: str) -> Dict:
        """Analyze sentiment with confidence scores"""
        try:
            if self.sentiment_analyzer is None:
                # Fallback to simple keyword-based sentiment
                return self._simple_sentiment_analysis(text)
            
            result = self.sentiment_analyzer(text)[0]
            
            # Normalize scores for different model formats
            if result['label'] in ['NEGATIVE']:
                sentiment = 'negative'
                negative_score = result['score']
                positive_score = 1 - result['score']
            elif result['label'] in ['POSITIVE']:
                sentiment = 'positive'
                positive_score = result['score']
                negative_score = 1 - result['score']
            else:
                sentiment = 'neutral'
                positive_score = 0.33
                negative_score = 0.33
            
            return {
                'sentiment': sentiment,
                'positive': positive_score,
                'negative': negative_score,
                'neutral': 1 - positive_score - negative_score,
                'confidence': result['score']
            }
        except Exception as e:
            logger.error(f"Error in sentiment analysis: {e}")
            return self._simple_sentiment_analysis(text)
    
    def _simple_sentiment_analysis(self, text: str) -> Dict:
        """Simple keyword-based sentiment analysis fallback"""
        text_lower = text.lower()
        
        negative_words = ['sad', 'angry', 'hate', 'terrible', 'awful', 'bad', 'horrible', 
                         'depressed', 'anxious', 'worried', 'stressed', 'hurt', 'pain', 
                         'suffer', 'miserable', 'hopeless', 'worthless', 'useless']
        positive_words = ['good', 'great', 'awesome', 'excellent', 'wonderful', 'amazing',
                         'happy', 'joy', 'love', 'fantastic', 'perfect', 'beautiful',
                         'brilliant', 'outstanding', 'superb']
        
        negative_count = sum(1 for word in negative_words if word in text_lower)
        positive_count = sum(1 for word in positive_words if word in text_lower)
        
        if negative_count > positive_count:
            sentiment = 'negative'
            negative_score = 0.7 + (negative_count * 0.1)
            positive_score = 1 - negative_score
        elif positive_count > negative_count:
            sentiment = 'positive'
            positive_score = 0.7 + (positive_count * 0.1)
            negative_score = 1 - positive_score
        else:
            sentiment = 'neutral'
            positive_score = 0.4
            negative_score = 0.4
        
        return {
            'sentiment': sentiment,
            'positive': min(positive_score, 1.0),
            'negative': min(negative_score, 1.0),
            'neutral': max(0.0, 1 - positive_score - negative_score),
            'confidence': min(0.8, 0.5 + ((negative_count + positive_count) * 0.1))
        }
    
    def detect_crisis_keywords(self, text: str, language: str = 'en') -> Dict:
        """Detect crisis-related keywords with severity scoring"""
        text_lower = text.lower()
        detected_keywords = []
        severity_scores = []
        
        lang_keywords = self.crisis_keywords.get(language, self.crisis_keywords['en'])
        
        for category, keywords in lang_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    detected_keywords.append(keyword)
                    # Assign severity based on category
                    if category == 'suicide':
                        severity_scores.append(10)
                    elif category == 'self_harm':
                        severity_scores.append(8)
                    elif category == 'violence':
                        severity_scores.append(9)
                    elif category == 'substance':
                        severity_scores.append(7)
                    elif category == 'emergency':
                        severity_scores.append(6)
                    else:
                        severity_scores.append(5)
        
        return {
            'keywords': detected_keywords,
            'severity_scores': severity_scores,
            'max_severity': max(severity_scores) if severity_scores else 0,
            'keyword_count': len(detected_keywords)
        }
    
    def calculate_crisis_level(self, text: str, context: Optional[Dict] = None) -> Dict:
        """Main crisis detection function combining all analysis methods"""
        start_time = datetime.now()
        
        # Language detection
        language = self.detect_language(text)
        
        # Sentiment analysis
        sentiment_result = self.analyze_sentiment(text)
        
        # Keyword detection
        keyword_result = self.detect_crisis_keywords(text, language)
        
        # Calculate base crisis score
        base_score = sentiment_result['negative'] * 5  # 0-5 range
        keyword_bonus = min(keyword_result['max_severity'], 5)  # 0-5 range
        
        # Contextual factors
        context_multiplier = 1.0
        if context:
            # Time of day factor
            hour = datetime.now().hour
            if hour >= 22 or hour <= 6:  # Late night/early morning
                context_multiplier *= 1.2
            
            # Previous crisis history
            if context.get('previous_crisis_count', 0) > 0:
                context_multiplier *= 1.1
            
            # Consecutive negative messages
            consecutive_negative = context.get('consecutive_negative_messages', 0)
            if consecutive_negative >= 3:
                context_multiplier *= 1.3
        
        # Final crisis level calculation
        raw_score = (base_score + keyword_bonus) * context_multiplier
        crisis_level = min(max(int(round(raw_score)), 1), 10)
        
        # Determine urgency
        if crisis_level <= 3:
            urgency = 'low'
            category = 'LOW'
        elif crisis_level <= 6:
            urgency = 'moderate'
            category = 'MODERATE'
        elif crisis_level <= 8:
            urgency = 'high'
            category = 'HIGH'
        else:
            urgency = 'critical'
            category = 'CRITICAL'
        
        # Generate recommendations
        recommendations = self._generate_recommendations(crisis_level, keyword_result['keywords'])
        
        # Processing time
        processing_time = (datetime.now() - start_time).total_seconds()
        
        return {
            'crisis_level': crisis_level,
            'urgency': urgency,
            'category': category,
            'confidence': min(sentiment_result['confidence'] + (keyword_result['keyword_count'] * 0.1), 1.0),
            'sentiment_analysis': sentiment_result,
            'keywords_detected': keyword_result['keywords'],
            'language': language,
            'recommendations': recommendations,
            'requires_immediate_escalation': crisis_level >= 8 or 'suicide' in str(keyword_result['keywords']),
            'processing_time_ms': processing_time * 1000,
            'timestamp': datetime.now().isoformat(),
            'model_version': '1.0.0'
        }
    
    def _generate_recommendations(self, crisis_level: int, keywords: List[str]) -> List[str]:
        """Generate action recommendations based on crisis level"""
        recommendations = []
        
        if crisis_level <= 3:
            recommendations = [
                "Provide self-help resources and coping strategies",
                "Offer peer support connections",
                "Schedule follow-up check-in within 24 hours"
            ]
        elif crisis_level <= 6:
            recommendations = [
                "Assign qualified counselor immediately",
                "Provide crisis intervention resources",
                "Schedule professional consultation within 2 hours",
                "Monitor conversation closely"
            ]
        elif crisis_level <= 8:
            recommendations = [
                "Immediate professional intervention required",
                "Contact crisis response team",
                "Notify emergency contacts if available",
                "Prepare for potential emergency escalation"
            ]
        else:
            recommendations = [
                "CRITICAL: Immediate emergency response required",
                "Contact emergency services if imminent danger",
                "Activate crisis intervention protocol",
                "Notify all emergency contacts immediately",
                "Maintain continuous monitoring"
            ]
        
        # Add specific keyword-based recommendations
        if any('suicide' in keyword for keyword in keywords):
            recommendations.append("SUICIDE RISK: Immediate suicide prevention protocol")
        
        if any('hurt' in keyword or 'harm' in keyword for keyword in keywords):
            recommendations.append("SELF-HARM RISK: Safety plan activation required")
        
        return recommendations
    
    def batch_process(self, texts: List[str], contexts: Optional[List[Dict]] = None) -> List[Dict]:
        """Process multiple texts for crisis detection"""
        results = []
        contexts = contexts or [None] * len(texts)
        
        for i, text in enumerate(texts):
            try:
                result = self.calculate_crisis_level(text, contexts[i])
                results.append(result)
            except Exception as e:
                logger.error(f"Error processing text {i}: {e}")
                results.append({
                    'error': str(e),
                    'crisis_level': 1,
                    'urgency': 'low',
                    'confidence': 0.0
                })
        
        return results

# Global instance
crisis_detector = MentalHealthCrisisDetector()

def analyze_message(text: str, context: Optional[Dict] = None) -> Dict:
    """Main function to analyze a single message for crisis indicators"""
    return crisis_detector.calculate_crisis_level(text, context)

def analyze_conversation_history(messages: List[str]) -> Dict:
    """Analyze entire conversation history for patterns"""
    results = crisis_detector.batch_process(messages)
    
    # Calculate conversation-level metrics
    avg_crisis_level = np.mean([r.get('crisis_level', 1) for r in results])
    max_crisis_level = max([r.get('crisis_level', 1) for r in results])
    crisis_trend = [r.get('crisis_level', 1) for r in results[-5:]]  # Last 5 messages
    
    return {
        'individual_results': results,
        'conversation_metrics': {
            'average_crisis_level': avg_crisis_level,
            'maximum_crisis_level': max_crisis_level,
            'recent_trend': crisis_trend,
            'trending_upward': len(crisis_trend) > 1 and crisis_trend[-1] > crisis_trend[0],
            'requires_escalation': max_crisis_level >= 7 or avg_crisis_level >= 5
        }
    }
