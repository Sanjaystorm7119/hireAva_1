"use client";
import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Sparkles,
  ArrowRight,
  Clock,
  User,
  Bot,
  Download,
  Share2,
} from "lucide-react";

function InterviewComplete() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    setShowConfetti(true);

    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 3);
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(stepTimer);
    };
  }, []);

  const confettiPieces = Array.from({ length: 50 }, (_, i) => (
    <div
      key={i}
      className={`absolute w-2 h-2 opacity-80 animate-ping`}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
        ][Math.floor(Math.random() * 5)],
        animationDelay: `${Math.random() * 2}s`,
        animationDuration: `${1 + Math.random() * 2}s`,
      }}
    />
  ));

  const nextSteps = [
    {
      icon: Clock,
      text: "Review in Progress",
      desc: "Our AI is analyzing your responses",
    },
    {
      icon: User,
      text: "Human Review",
      desc: "Our team will evaluate your fit",
    },
    {
      icon: CheckCircle,
      text: "Decision Coming",
      desc: "Expect results within a days",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {confettiPieces}
        </div>
      )}

      <div
        className={`relative z-10 flex items-center justify-center min-h-screen p-8 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-4xl w-full">
          {/* Main Success Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 text-center mb-8">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4 animate-bounce">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Interview Completed!
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-2">
                Thanks for joining us today
              </p>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                You've successfully completed your AI-powered interview. We're
                impressed by your engagement and responses!
              </p>
            </div>

            {/* Stats */}
            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-center mb-2">
                  <Bot className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white">AI</div>
                <div className="text-sm text-gray-400">Powered</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">15m</div>
                <div className="text-sm text-gray-400">Duration</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-center mb-2">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-sm text-gray-400">Complete</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-center mb-2">
                  <User className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white">You</div>
                <div className="text-sm text-gray-400">Rock!</div>
              </div>
            </div> */}

            {/* Action Buttons */}
            {/* <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Download Summary
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 border border-white/20 flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" />
                Share Experience
              </button>
            </div> */}
          </div>

          {/* Next Steps */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              What Happens Next?
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {nextSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === index;
                return (
                  <div
                    key={index}
                    className={`relative p-4 rounded-xl border transition-all duration-500 ${
                      isActive
                        ? "bg-white/10 border-white/30 scale-105"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isActive ? "bg-blue-500" : "bg-gray-600"
                        }`}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-white text-sm">
                          {step.text}
                        </h3>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">{step.desc}</p>
                    {isActive && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Message */}
          <div className="text-center mt-8 text-gray-400">
            <p className="text-sm">
              Questions? Contact our team at{" "}
              <span className="text-blue-400 cursor-pointer hover:text-blue-300">
                careers@hireEva.com
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewComplete;
