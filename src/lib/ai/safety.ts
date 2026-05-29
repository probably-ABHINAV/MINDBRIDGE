import { CRISIS_RESOURCES } from "../constants";

// High-risk keywords that trigger immediate safety protocols
const CRISIS_KEYWORDS = [
  "suicide", "kill myself", "end my life", "want to die", 
  "better off dead", "no reason to live", "harm myself", 
  "cut myself", "overdose", "jump", "abuse", "beaten", 
  "hitting me", "rape", "assault"
];

export interface SafetyCheckResult {
  isSafe: boolean;
  reason?: string;
  crisisResponse?: string;
}

export function checkSafety(userInput: string): SafetyCheckResult {
  const lowerInput = userInput.toLowerCase();
  
  // Check for crisis keywords
  const triggeredKeyword = CRISIS_KEYWORDS.find(keyword => 
    lowerInput.includes(keyword)
  );

  if (triggeredKeyword) {
    return {
      isSafe: false,
      reason: "crisis_keyword_detected",
      crisisResponse: `I'm so sorry you're feeling this way, but please know you don't have to carry this alone. This sounds like an emergency, and I am an AI, not a human. Please reach out to someone who can help you right now.\n\n${CRISIS_RESOURCES.helplines.map(h => `📞 **${h.name}**: ${h.number}`).join('\n')}\n\nPlease call them. Your life matters deeply.`
    };
  }

  // If safe, return true
  return {
    isSafe: true
  };
}
