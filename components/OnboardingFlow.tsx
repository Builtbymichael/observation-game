import React, { useState } from 'react';
import { Button } from './common/Button';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const steps = [
  {
    title: "Welcome to Observation",
    description: "A simple game designed to sharpen your memory and keep your mind active."
  },
  {
    title: "How It Works",
    description: "Each day, you'll set a question about something you observed. What did you eat? Who did you see? What did you read?"
  },
  {
    title: "The Challenge",
    description: "The next day (or later), you'll be asked to answer your question. The goal is to recall specific details from memory.",
    fact: "Actively trying to recall information is far more effective for long-term memory than simply re-reading it."
  },
  {
    title: "Track Your Progress",
    description: "Build streaks for correct answers and watch your recall improve over time. Ready to begin?"
  }
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-8 m-4 max-w-md w-full text-center shadow-2xl animate-fade-in border border-secondary">
        <h2 className="text-3xl font-serif mb-4">{currentStep.title}</h2>
        <p className="text-muted-foreground mb-6">{currentStep.description}</p>
        
        {currentStep.fact && (
            <p className="text-sm text-muted-foreground/80 italic border-t border-secondary pt-4 mb-6">
                "{currentStep.fact}"
            </p>
        )}

        <Button onClick={handleNext} variant="primary">
          {step === steps.length - 1 ? "Let's Begin" : "Next"}
        </Button>
      </div>
    </div>
  );
};
