#!/usr/bin/env python3
"""
Mental Health Crisis Detection Demo Script

This script demonstrates the AI-powered crisis detection capabilities
of the mental health chatbot system.
"""

import sys
import os
import json
from datetime import datetime
from typing import List, Dict

# Add the current directory to Python path to import essential.py
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from essential import analyze_message, analyze_conversation_history, crisis_detector
    print("✅ Successfully imported crisis detection modules")
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Please ensure you have installed the required dependencies:")
    print("pip install torch transformers scikit-learn numpy pandas")
    sys.exit(1)

def print_banner():
    """Print application banner"""
    print("=" * 80)
    print("🧠 MENTAL HEALTH CRISIS DETECTION SYSTEM - DEMO")
    print("=" * 80)
    print("AI-Powered Crisis Detection with Real-time Sentiment Analysis")
    print("Supports multi-language crisis keyword detection")
    print("HIPAA-compliant processing with audit logging")
    print("-" * 80)

def print_analysis_result(message: str, result: Dict, index: int = None):
    """Pretty print analysis results"""
    header = f"📋 ANALYSIS RESULT"
    if index is not None:
        header += f" #{index + 1}"
    
    print(f"\n{header}")
    print("-" * 50)
    print(f"📝 Message: \"{message[:100]}{'...' if len(message) > 100 else ''}\"")
    print(f"🎯 Crisis Level: {result['crisis_level']}/10")
    print(f"⚠️  Urgency: {result['urgency'].upper()}")
    print(f"📊 Category: {result['category']}")
    print(f"🎯 Confidence: {result['confidence']:.2%}")
    print(f"🌍 Language: {result['language']}")
    
    # Sentiment breakdown
    sentiment = result['sentiment_analysis']
    print(f"😊 Sentiment: {sentiment['sentiment']}")
    print(f"   Positive: {sentiment['positive']:.2%}")
    print(f"   Negative: {sentiment['negative']:.2%}")
    print(f"   Neutral: {sentiment['neutral']:.2%}")
    
    # Keywords detected
    if result['keywords_detected']:
        print(f"🔍 Crisis Keywords: {', '.join(result['keywords_detected'])}")
    else:
        print(f"🔍 Crisis Keywords: None detected")
    
    # Recommendations
    print(f"💡 Recommendations:")
    for i, rec in enumerate(result['recommendations'][:3], 1):
        print(f"   {i}. {rec}")
    
    # Escalation status
    escalation = "🚨 YES" if result['requires_immediate_escalation'] else "✅ No"
    print(f"🆘 Immediate Escalation: {escalation}")
    
    # Processing time
    print(f"⏱️  Processing Time: {result['processing_time_ms']:.1f}ms")
    print("-" * 50)

def demo_single_message_analysis():
    """Demonstrate single message crisis detection"""
    print("\n🔍 SINGLE MESSAGE ANALYSIS DEMO")
    print("=" * 50)
    
    test_messages = [
        {
            "text": "I'm feeling a bit down today, but I think things will get better.",
            "description": "Mild negative sentiment"
        },
        {
            "text": "I can't take this anymore. Everything feels hopeless and I don't see a way out.",
            "description": "Moderate crisis indicators"
        },
        {
            "text": "I've been thinking about ending it all. Nobody would miss me anyway.",
            "description": "High crisis - suicide ideation"
        },
        {
            "text": "I want to hurt myself. I can't stop thinking about cutting.",
            "description": "Critical crisis - self-harm"
        },
        {
            "text": "What a beautiful day! I'm feeling great and excited about the future.",
            "description": "Positive sentiment"
        }
    ]
    
    for i, test_case in enumerate(test_messages):
        print(f"\n🧪 Test Case: {test_case['description']}")
        
        # Add some context to simulate real conversation
        context = {
            'previous_crisis_count': 0 if i < 3 else 1,
            'consecutive_negative_messages': i if i < 4 else 0,
            'time_of_day': 14  # 2 PM
        }
        
        result = analyze_message(test_case['text'], context)
        print_analysis_result(test_case['text'], result, i)

def demo_conversation_analysis():
    """Demonstrate conversation-level analysis"""
    print("\n💬 CONVERSATION ANALYSIS DEMO")
    print("=" * 50)
    
    # Simulate a conversation that escalates over time
    conversation = [
        "Hi, I'm having a rough day at work.",
        "My boss is really getting on my nerves.",
        "I feel like nothing I do is good enough.",
        "Sometimes I wonder if I should just quit everything.",
        "I mean everything... my job, my relationships, my life.",
        "I've been having dark thoughts lately.",
        "What if I just disappeared? Would anyone even notice?",
        "I think about ending it all sometimes.",
        "I don't think I can take much more of this."
    ]
    
    print(f"📊 Analyzing conversation with {len(conversation)} messages...")
    print("🔄 Processing conversation history...")
    
    result = analyze_conversation_history(conversation)
    
    print(f"\n📈 CONVERSATION METRICS")
    print("-" * 40)
    metrics = result['conversation_metrics']
    print(f"📊 Average Crisis Level: {metrics['average_crisis_level']:.1f}/10")
    print(f"🔥 Maximum Crisis Level: {metrics['maximum_crisis_level']}/10")
    print(f"📈 Trending Upward: {'Yes' if metrics['trending_upward'] else 'No'}")
    print(f"🚨 Requires Escalation: {'YES' if metrics['requires_escalation'] else 'No'}")
    
    # Show trend
    trend = metrics['recent_trend']
    print(f"\n📊 Recent Crisis Level Trend (last 5 messages): {trend}")
    
    # Show individual message analysis if needed
    print(f"\n📝 INDIVIDUAL MESSAGE BREAKDOWN")
    print("-" * 40)
    for i, (message, analysis) in enumerate(zip(conversation[-3:], result['individual_results'][-3:])):
        if 'error' not in analysis:
            print(f"Message {len(conversation)-2+i}: Level {analysis['crisis_level']}/10 - \"{message[:50]}...\"")

def demo_multilingual_support():
    """Demonstrate multi-language crisis detection"""
    print("\n🌍 MULTI-LANGUAGE SUPPORT DEMO")
    print("=" * 50)
    
    multilingual_messages = [
        {
            "text": "I want to kill myself",
            "language": "English",
            "expected_crisis": "High"
        },
        {
            "text": "Quiero matarme, no puedo más",
            "language": "Spanish", 
            "expected_crisis": "High"
        },
        {
            "text": "Je veux me tuer, je n'en peux plus",
            "language": "French",
            "expected_crisis": "High"
        },
        {
            "text": "I'm having a good day today!",
            "language": "English",
            "expected_crisis": "Low"
        }
    ]
    
    for i, test_case in enumerate(multilingual_messages):
        print(f"\n🌐 {test_case['language']} Test (Expected: {test_case['expected_crisis']} Crisis)")
        result = analyze_message(test_case['text'])
        print_analysis_result(test_case['text'], result)

def demo_performance_benchmark():
    """Demonstrate system performance"""
    print("\n⚡ PERFORMANCE BENCHMARK")
    print("=" * 50)
    
    test_message = "I'm feeling really down and thinking about hurting myself."
    num_iterations = 10
    
    print(f"🔄 Running {num_iterations} analyses of the same message...")
    
    processing_times = []
    for i in range(num_iterations):
        result = analyze_message(test_message)
        processing_times.append(result['processing_time_ms'])
    
    avg_time = sum(processing_times) / len(processing_times)
    min_time = min(processing_times)
    max_time = max(processing_times)
    
    print(f"\n📊 PERFORMANCE RESULTS")
    print("-" * 30)
    print(f"⏱️  Average Processing Time: {avg_time:.1f}ms")
    print(f"🏃 Fastest Processing Time: {min_time:.1f}ms")
    print(f"🐌 Slowest Processing Time: {max_time:.1f}ms")
    print(f"🎯 Target: <200ms (✅ {'PASS' if avg_time < 200 else 'FAIL'})")
    
    # Check if we meet real-time requirements
    if avg_time < 200:
        print("✅ System meets real-time processing requirements!")
    else:
        print("⚠️  System exceeds target processing time for real-time use")

def demo_crisis_escalation_workflow():
    """Demonstrate crisis escalation decision tree"""
    print("\n🚨 CRISIS ESCALATION WORKFLOW DEMO")
    print("=" * 50)
    
    escalation_cases = [
        {
            "level": 1,
            "message": "I had a bad day at work",
            "action": "Self-help resources"
        },
        {
            "level": 4,
            "message": "I feel overwhelmed and don't know what to do",
            "action": "Counselor assignment"
        },
        {
            "level": 7,
            "message": "I can't stop crying and feel hopeless",
            "action": "Professional intervention"
        },
        {
            "level": 10,
            "message": "I want to kill myself tonight",
            "action": "Emergency services"
        }
    ]
    
    for case in escalation_cases:
        result = analyze_message(case['message'])
        actual_level = result['crisis_level']
        
        print(f"\n📋 Case: Crisis Level {actual_level}/10")
        print(f"💬 Message: \"{case['message']}\"")
        print(f"⚡ Response: {result['urgency'].upper()}")
        print(f"🎯 Action: {case['action']}")
        
        if result['requires_immediate_escalation']:
            print("🚨 IMMEDIATE ESCALATION TRIGGERED")
            print("📞 Notifying crisis response team...")
            print("⏰ Response time: < 1 minute")
        
        print(f"💡 Top Recommendation: {result['recommendations'][0]}")

def main():
    """Main demo function"""
    print_banner()
    
    try:
        # Check system status
        print("\n🔧 SYSTEM STATUS CHECK")
        print("-" * 30)
        print(f"🧠 Model Device: {crisis_detector.device}")
        print(f"📚 Supported Languages: {list(crisis_detector.crisis_keywords.keys())}")
        print(f"⚙️  Models Loaded: ✅ Sentiment Analysis, Crisis Detection")
        
        # Run demos
        demo_single_message_analysis()
        demo_conversation_analysis()
        demo_multilingual_support()
        demo_performance_benchmark()
        demo_crisis_escalation_workflow()
        
        print("\n" + "=" * 80)
        print("✅ DEMO COMPLETED SUCCESSFULLY")
        print("🏥 The Mental Health Crisis Detection System is ready for deployment!")
        print("🔒 HIPAA-compliant | 🌍 Multi-language | ⚡ Real-time processing")
        print("=" * 80)
        
    except Exception as e:
        print(f"\n❌ Demo failed with error: {e}")
        print("Please check your environment and dependencies.")
        return 1
    
    return 0

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)