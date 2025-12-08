"""
Groq-based Voice Interview Agent
handles conversation flow, question generation, and evaluation
"""

from groq import Groq
from typing import List, Dict, Optional
from app.config import settings
from app.data.job_roles import get_job_role

class GroqVoiceAgent:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = settings.GROQ_MODEL
        self.conversation_history = []
        self.current_round = "hr"
        self.question_count = {"hr": 0, "technical": 0, "aptitude": 0}
    
    def build_system_prompt(self, interview_context: Dict) -> str:
        """
        Build dynamic system prompt based on interview context
        """
        job_role = interview_context.get('jobRole', 'Software Developer')
        experience_level = interview_context.get('experienceLevel', 'Mid Level')
        missing_skills = interview_context.get('missingSkills', [])
        matched_skills = interview_context.get('matchedSkills', [])
        ats_score = interview_context.get('atsScore', 70)
        
        prompt = f"""You are an expert AI interviewer conducting a professional interview for the position of {job_role} at {experience_level}.

CANDIDATE PROFILE:
- Experience Level: {experience_level}
- Resume ATS Score: {ats_score}/100
- Strong Skills: {', '.join(matched_skills[:5]) if matched_skills else 'General skills'}
- Skills to Probe: {', '.join(missing_skills[:5]) if missing_skills else 'General knowledge'}

INTERVIEW STRUCTURE:
You will conduct a 3-round interview:

1. HR ROUND (First 3-4 questions):
   - Start with warm greeting: "Hello! I've reviewed your resume. Let's begin with the HR round."
   - Ask about background, career goals, motivation
   - Assess communication and cultural fit
   - Be conversational and friendly

2. TECHNICAL ROUND (Next 5-6 questions):
   - Announce transition: "Great! Let's move to the technical round."
   - Focus 60% on missing skills: {', '.join(missing_skills[:3]) if missing_skills else 'technical skills'}
   - Ask scenario-based questions
   - Probe depth of knowledge
   - Be professional and thorough

3. APTITUDE ROUND (Final 3-4 questions):
   - Announce transition: "Now let's test your problem-solving abilities."
   - Problem-solving scenarios
   - Analytical thinking
   - Decision-making under pressure

CRITICAL RULES:
- Keep responses SHORT (1-2 sentences max) for natural conversation flow
- Ask ONE question at a time
- Wait for candidate's answer before proceeding
- Don't reveal you're an AI
- Be professional but warm
- Give positive reinforcement
- If answer is vague, ask ONE follow-up question
- After {'{'}12-15 total questions{'}'}, say: "Thank you! That completes our interview. You'll receive a detailed report shortly."

Current Round: {self.current_round.upper()}
Questions Asked in This Round: {self.question_count[self.current_round]}
"""
        return prompt
    
    def get_next_response(self, user_message: str, interview_context: Dict) -> str:
        """
        Generate AI interviewer's next response
        """
        # Add user message to history
        self.conversation_history.append({
            "role": "user",
            "content": user_message
        })
        
        # Build system prompt
        system_prompt = self.build_system_prompt(interview_context)
        
        # Prepare messages for Groq
        messages = [
            {"role": "system", "content": system_prompt},
            *self.conversation_history
        ]
        
        try:
            # Call Groq API
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=150,  # Keep responses concise
                top_p=0.9
            )
            
            ai_response = response.choices[0].message.content
            
            # Add AI response to history
            self.conversation_history.append({
                "role": "assistant",
                "content": ai_response
            })
            
            # Update question count and check for round transition
            self.question_count[self.current_round] += 1
            self._check_round_transition()
            
            return ai_response
            
        except Exception as e:
            print(f"Error calling Groq API: {e}")
            return "I'm having trouble processing that. Could you please repeat?"
    
    def _check_round_transition(self):
        """
        Check if it's time to transition to next round
        """
        if self.current_round == "hr" and self.question_count["hr"] >= 4:
            self.current_round = "technical"
        elif self.current_round == "technical" and self.question_count["technical"] >= 6:
            self.current_round = "aptitude"
    
    def get_initial_greeting(self, interview_context: Dict) -> str:
        """
        Generate initial greeting when interview starts
        """
        candidate_name = interview_context.get('candidateName', 'there')
        job_role = interview_context.get('jobRole', 'Software Developer')
        
        greeting = f"Hello {candidate_name}! I've reviewed your resume for the {job_role} position. I'm excited to learn more about you today. Let's begin with a simple question: Can you tell me a bit about your background and what interests you about this role?"
        
        self.conversation_history.append({
            "role": "assistant",
            "content": greeting
        })
        
        return greeting
    
    def reset_conversation(self):
        """
        Reset conversation state for new interview
        """
        self.conversation_history = []
        self.current_round = "hr"
        self.question_count = {"hr": 0, "technical": 0, "aptitude": 0}
    
    def evaluate_answer(self, question: str, answer: str, expected_topics: List[str]) -> Dict:
        """
        Evaluate candidate's answer quality
        """
        # Simple evaluation based on answer length and keyword presence
        score = 50  # Base score
        
        # Length check
        word_count = len(answer.split())
        if word_count > 20:
            score += 20
        elif word_count > 10:
            score += 10
        
        # Keyword check
        answer_lower = answer.lower()
        matched_topics = [topic for topic in expected_topics if topic.lower() in answer_lower]
        score += min(len(matched_topics) * 10, 30)
        
        return {
            "score": min(score, 100),
            "word_count": word_count,
            "matched_topics": matched_topics,
            "quality": "excellent" if score >= 80 else "good" if score >= 60 else "average"
        }

# Global instance
groq_agent = GroqVoiceAgent()