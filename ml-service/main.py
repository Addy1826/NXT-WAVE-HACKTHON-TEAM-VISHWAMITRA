from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import asyncio
import logging
from datetime import datetime
import json
import os
import sys

# Add the parent directory to Python path to import essential.py
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from essential import crisis_detector, analyze_message, analyze_conversation_history

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Mental Health Crisis Detection API",
    description="AI-powered mental health crisis detection service with real-time sentiment analysis",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Request/Response Models
class MessageAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000, description="Text message to analyze")
    language: Optional[str] = Field("auto", description="Message language (auto-detect if not specified)")
    context: Optional[Dict[str, Any]] = Field(None, description="Additional context for analysis")
    user_id: Optional[str] = Field(None, description="User ID for tracking")

class ConversationAnalysisRequest(BaseModel):
    messages: List[str] = Field(..., min_items=1, max_items=100, description="List of messages in conversation")
    user_id: Optional[str] = Field(None, description="User ID for tracking")
    include_individual_results: bool = Field(True, description="Include individual message analysis")

class CrisisDetectionResponse(BaseModel):
    crisis_level: int = Field(..., ge=1, le=10, description="Crisis level from 1-10")
    urgency: str = Field(..., description="Urgency level: low, moderate, high, critical")
    category: str = Field(..., description="Crisis category: LOW, MODERATE, HIGH, CRITICAL")
    confidence: float = Field(..., ge=0, le=1, description="Confidence score of the prediction")
    sentiment_analysis: Dict[str, Any] = Field(..., description="Detailed sentiment analysis")
    keywords_detected: List[str] = Field(..., description="Crisis-related keywords found")
    language: str = Field(..., description="Detected language")
    recommendations: List[str] = Field(..., description="Recommended actions")
    requires_immediate_escalation: bool = Field(..., description="Whether immediate escalation is needed")
    processing_time_ms: float = Field(..., description="Processing time in milliseconds")
    timestamp: str = Field(..., description="Analysis timestamp")
    model_version: str = Field(..., description="Model version used")

class ConversationAnalysisResponse(BaseModel):
    individual_results: List[CrisisDetectionResponse]
    conversation_metrics: Dict[str, Any]

class HealthCheckResponse(BaseModel):
    status: str
    timestamp: str
    models_loaded: bool
    gpu_available: bool
    version: str

class BatchAnalysisRequest(BaseModel):
    requests: List[MessageAnalysisRequest] = Field(..., max_items=50)

# Authentication dependency (placeholder - implement proper auth)
async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    # In production, implement proper JWT verification
    token = credentials.credentials
    if not token or token == "invalid":
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    return token

# Health check endpoint
@app.get("/health", response_model=HealthCheckResponse)
async def health_check():
    """Health check endpoint for monitoring service status"""
    try:
        # Test model availability
        test_result = crisis_detector.analyze_sentiment("test message")
        models_loaded = test_result is not None
    except Exception:
        models_loaded = False
    
    return HealthCheckResponse(
        status="healthy" if models_loaded else "degraded",
        timestamp=datetime.now().isoformat(),
        models_loaded=models_loaded,
        gpu_available=crisis_detector.device.type == "cuda",
        version="1.0.0"
    )

# Main crisis detection endpoint
@app.post("/analyze/message", response_model=CrisisDetectionResponse)
async def analyze_message_endpoint(
    request: MessageAnalysisRequest,
    background_tasks: BackgroundTasks,
    token: str = Depends(verify_token)
):
    """
    Analyze a single message for mental health crisis indicators
    
    Returns detailed analysis including:
    - Crisis level (1-10)
    - Urgency classification
    - Sentiment analysis
    - Detected keywords
    - Recommended actions
    """
    try:
        logger.info(f"Analyzing message for user: {request.user_id}")
        
        # Perform crisis analysis
        result = analyze_message(request.text, request.context)
        
        # Log analysis for audit trail (background task)
        background_tasks.add_task(
            log_analysis,
            user_id=request.user_id,
            message=request.text,
            result=result
        )
        
        return CrisisDetectionResponse(**result)
        
    except Exception as e:
        logger.error(f"Error analyzing message: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

# Background task functions
async def log_analysis(user_id: str, message: str, result: Dict):
    """Log individual message analysis for audit trail"""
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "user_id": user_id,
        "message_length": len(message),
        "crisis_level": result.get("crisis_level"),
        "urgency": result.get("urgency"),
        "escalation_required": result.get("requires_immediate_escalation"),
        "processing_time_ms": result.get("processing_time_ms"),
        "keywords_count": len(result.get("keywords_detected", []))
    }
    
    # In production, save to database or logging service
    logger.info(f"Analysis logged: {json.dumps(log_entry)}")

if __name__ == "__main__":
    import uvicorn
    
    # Configuration
    HOST = os.getenv("ML_SERVICE_HOST", "0.0.0.0")
    PORT = int(os.getenv("ML_SERVICE_PORT", 8000))
    
    logger.info(f"Starting Mental Health Crisis Detection API on {HOST}:{PORT}")
    
    uvicorn.run(
        "main:app",
        host=HOST,
        port=PORT,
        reload=True,
        log_level="info"
    )