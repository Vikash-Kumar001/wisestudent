import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";

const FeelingsFlashcards = () => {
    const location = useLocation();

    // Get game data
    const gameId = "parent-education-3";
    const gameData = getParentEducationGameById(gameId);

    // Get game props from location.state or gameData
    const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
    const totalLevels = gameData?.totalQuestions || 5;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [showGameOver, setShowGameOver] = useState(false);

    // Emotion cards with emojis representing facial expressions
    const emotionCards = [
        {
            id: "calm",
            label: "Calm",
            emoji: "😌",
            description: "Peaceful and relaxed",
        },
        {
            id: "irritated",
            label: "Irritated",
            emoji: "😤",
            description: "Annoyed and frustrated",
        },
        {
            id: "hopeful",
            label: "Hopeful",
            emoji: "🤗",
            description: "Optimistic and positive",
        },
        {
            id: "proud",
            label: "Proud",
            emoji: "😊",
            description: "Satisfied and accomplished",
        },
        {
            id: "anxious",
            label: "Anxious",
            emoji: "😰",
            description: "Worried and nervous",
        },
        {
            id: "grateful",
            label: "Grateful",
            emoji: "🙏",
            description: "Thankful and appreciative",
        },
        {
            id: "disappointed",
            label: "Disappointed",
            emoji: "😞",
            description: "Let down and sad",
        },
        {
            id: "excited",
            label: "Excited",
            emoji: "🤩",
            description: "Energetic and enthusiastic",
        },
        {
            id: "tired",
            label: "Tired",
            emoji: "😴",
            description: "Exhausted and drained",
        },
        {
            id: "confused",
            label: "Confused",
            emoji: "😕",
            description: "Uncertain and puzzled",
        },
        {
            id: "content",
            label: "Content",
            emoji: "😌",
            description: "Satisfied and at ease",
        },
        {
            id: "frustrated",
            label: "Frustrated",
            emoji: "😠",
            description: "Annoyed and blocked",
        },
        {
            id: "joyful",
            label: "Joyful",
            emoji: "😄",
            description: "Happy and elated",
        },
        {
            id: "worried",
            label: "Worried",
            emoji: "😟",
            description: "Concerned and anxious",
        },
        {
            id: "peaceful",
            label: "Peaceful",
            emoji: "☺️",
            description: "Calm and serene",
        },
        {
            id: "overwhelmed",
            label: "Overwhelmed",
            emoji: "😵",
            description: "Stressed and overloaded",
        },
        {
            id: "lonely",
            label: "Lonely",
            emoji: "😔",
            description: "Isolated and sad",
        },
        {
            id: "confident",
            label: "Confident",
            emoji: "😎",
            description: "Self-assured and strong",
        },
        {
            id: "embarrassed",
            label: "Embarrassed",
            emoji: "😳",
            description: "Self-conscious and awkward",
        },
    ];

    // Scenarios: Match facial expression to emotion card
    const scenarios = [
        {
            id: 1,
            facialExpression: "😌",
            description: "A relaxed face with a gentle smile, eyes soft and peaceful",
            correctEmotion: "calm",
            options: ["calm", "content", "peaceful", "tired"],
            reflection:
                "Recognizing 'calm' helps you identify when you're in a good emotional state. When you notice this feeling, you can say: 'I'm feeling calm right now.' This awareness helps you return to this state when stress arises.",
            parentTip:
                "Use the 'calm' card with your child to help them recognize peaceful moments. Say: 'Look, this is what calm feels like. Can you remember a time you felt this way?' This builds emotional vocabulary and self-awareness.",
        },
        {
            id: 2,
            facialExpression: "😤",
            description:
                "A face showing irritation, with a slight frown and tense expression",
            correctEmotion: "irritated",
            options: ["irritated", "frustrated", "angry", "overwhelmed"],
            reflection:
                "Identifying 'irritated' helps you pause before reacting. When you notice this feeling, you can say: 'I'm feeling irritated. Let me take a breath before I respond.' This prevents overreaction and models emotional regulation.",
            parentTip:
                "The 'irritated' card helps children name their frustration. When your child seems upset, show them this card and say: 'Are you feeling irritated? It's okay to feel this way. Let's talk about what's bothering you.' This teaches emotional naming and validation.",
        },
        {
            id: 3,
            facialExpression: "🤗",
            description:
                "A warm, open expression with arms spread, showing optimism and warmth",
            correctEmotion: "hopeful",
            options: ["hopeful", "excited", "joyful", "confident"],
            reflection:
                "Recognizing 'hopeful' helps you maintain a positive outlook during challenges. When you feel this way, you can say: 'I'm feeling hopeful about this situation.' This positive emotion can help you stay motivated and resilient.",
            parentTip:
                "Use the 'hopeful' card to teach optimism. When facing a challenge, show your child this card and say: 'Even when things are hard, we can feel hopeful. What are you hopeful about today?' This builds resilience and positive thinking.",
        },
        {
            id: 4,
            facialExpression: "😊",
            description: "A bright, satisfied smile showing accomplishment and pride",
            correctEmotion: "proud",
            options: ["proud", "joyful", "confident", "excited"],
            reflection:
                "Acknowledging 'proud' helps you celebrate achievements, both yours and your child's. When you feel this way, you can say: 'I'm feeling proud of what we accomplished.' This reinforces positive experiences and builds self-esteem.",
            parentTip:
                "The 'proud' card is perfect for celebrating achievements. When your child does something well, show them this card and say: 'I'm proud of you! Can you feel proud of yourself too?' This teaches self-appreciation and builds confidence.",
        },
        {
            id: 5,
            facialExpression: "😰",
            description:
                "A worried face with wide eyes and a tense expression, showing anxiety",
            correctEmotion: "anxious",
            options: ["anxious", "worried", "overwhelmed", "confused"],
            reflection:
                "Naming 'anxious' helps you address your worries directly. When you notice this feeling, you can say: 'I'm feeling anxious. Let me identify what's worrying me and take steps to address it.' This prevents anxiety from controlling your responses.",
            parentTip:
                "The 'anxious' card helps children express their worries. When your child seems nervous, show them this card and say: 'It looks like you might be feeling anxious. That's okay. What's making you feel this way?' This creates a safe space for sharing fears and builds trust.",
        },
    ];

    const handleEmotionSelect = (questionIndex, emotionId) => {
        const newSelectedAnswers = {
            ...selectedAnswers,
            [questionIndex]: emotionId,
        };
        setSelectedAnswers(newSelectedAnswers);

        // Check if answer is correct
        const scenario = scenarios[questionIndex];
        if (emotionId === scenario.correctEmotion) {
            setScore((prev) => prev + 1);
        }

        // Move to next question after a short delay
        setTimeout(() => {
            if (questionIndex < scenarios.length - 1) {
                setCurrentQuestion(questionIndex + 1);
            } else {
                // All questions answered
                setShowGameOver(true);
            }
        }, 2000); // 2 second delay to show feedback
    };

    const getEmotionCardStyle = (questionIndex, emotionId) => {
        const selected = selectedAnswers[questionIndex] === emotionId;
        const scenario = scenarios[questionIndex];
        const isCorrect = emotionId === scenario.correctEmotion;
        const showFeedback = selected;

        let backgroundColor = "bg-white";
        let borderColor = "border-gray-300";
        let textColor = "text-gray-700";
        let scale = "";

        if (showFeedback) {
            if (isCorrect) {
                backgroundColor = "bg-green-50";
                borderColor = "border-green-500";
                textColor = "text-green-700";
                scale = "scale-105";
            } else {
                backgroundColor = "bg-red-50";
                borderColor = "border-red-500";
                textColor = "text-red-700";
            }
        } else if (selected) {
            backgroundColor = "bg-blue-50";
            borderColor = "border-blue-500";
            textColor = "text-blue-700";
        }

        return `${backgroundColor} ${borderColor} ${textColor} ${scale}`;
    };

    const currentScenario = scenarios[currentQuestion];
    const availableOptions = currentScenario.options
        .map((opt) => emotionCards.find((card) => card.id === opt))
        .filter(Boolean);

    return (
        <ParentGameShell
            title={gameData?.title || "Feelings Flashcards"}
            subtitle={
                gameData?.description ||
                "Build an emotional vocabulary for family conversations"
            }
            showGameOver={showGameOver}
            score={score}
            gameId={gameId}
            gameType="parent-education"
            totalLevels={totalLevels}
            totalCoins={totalCoins}
            currentQuestion={currentQuestion}
        >
            {currentQuestion < scenarios.length ? (
                <div className="w-full max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-gray-500">
                                    Flashcard {currentQuestion + 1} of {scenarios.length}
                                </span>
                                <span className="text-sm font-medium text-gray-500">
                                    Score: {score}/{scenarios.length}
                                </span>
                            </div>
                        </div>

                        {/* Facial Expression Display */}
                        <div className="mb-8">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
                                <div className="text-center">
                                    <div className="text-9xl mb-4 animate-bounce-slow">
                                        {currentScenario.facialExpression}
                                    </div>
                                    <p className="text-lg text-gray-700 font-medium">
                                        {currentScenario.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">
                            Which emotion card matches this facial expression?
                        </h2>

                        {/* Emotion Card Options */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {availableOptions.map((emotionCard) => {
                                const isSelected =
                                    selectedAnswers[currentQuestion] === emotionCard.id;
                                const isCorrect =
                                    emotionCard.id === currentScenario.correctEmotion;
                                const showFeedback = isSelected;

                                return (
                                    <button
                                        key={emotionCard.id}
                                        onClick={() =>
                                            !selectedAnswers[currentQuestion] &&
                                            handleEmotionSelect(currentQuestion, emotionCard.id)
                                        }
                                        disabled={!!selectedAnswers[currentQuestion]}
                                        className={`p-4 rounded-xl border-2 transition-all text-center ${getEmotionCardStyle(
                                            currentQuestion,
                                            emotionCard.id
                                        )} ${selectedAnswers[currentQuestion]
                                                ? "cursor-not-allowed"
                                                : "cursor-pointer hover:shadow-lg hover:scale-105"
                                            }`}
                                    >
                                        <div className="text-5xl mb-2">{emotionCard.emoji}</div>
                                        <div className="font-bold text-sm mb-1">
                                            {emotionCard.label}
                                        </div>
                                        <div className="text-xs opacity-75">
                                            {emotionCard.description}
                                        </div>
                                        {showFeedback && (
                                            <div className="mt-2 text-xl">
                                                {isCorrect ? "✓" : "✗"}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Reflection Message */}
                        {selectedAnswers[currentQuestion] !== undefined && (
                            <div
                                className={`mt-6 p-4 rounded-xl border-2 ${selectedAnswers[currentQuestion] ===
                                        currentScenario.correctEmotion
                                        ? "bg-green-50 border-green-200"
                                        : "bg-orange-50 border-orange-200"
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`text-2xl flex-shrink-0 ${selectedAnswers[currentQuestion] ===
                                                currentScenario.correctEmotion
                                                ? "text-green-600"
                                                : "text-orange-600"
                                            }`}
                                    >
                                        {selectedAnswers[currentQuestion] ===
                                            currentScenario.correctEmotion
                                            ? "💡"
                                            : "📝"}
                                    </div>
                                    <div className="flex-1">
                                        <h4
                                            className={`font-bold mb-2 ${selectedAnswers[currentQuestion] ===
                                                    currentScenario.correctEmotion
                                                    ? "text-green-800"
                                                    : "text-orange-800"
                                                }`}
                                        >
                                            {selectedAnswers[currentQuestion] ===
                                                currentScenario.correctEmotion
                                                ? "Reflection"
                                                : "Learning Moment"}
                                        </h4>
                                        <p
                                            className={`text-sm leading-relaxed mb-2 ${selectedAnswers[currentQuestion] ===
                                                    currentScenario.correctEmotion
                                                    ? "text-green-700"
                                                    : "text-orange-700"
                                                }`}
                                        >
                                            {currentScenario.reflection}
                                        </p>
                                        <div className="bg-white/60 rounded-lg p-3 mt-3 border border-blue-200">
                                            <p className="text-xs font-semibold text-blue-800 mb-1">
                                                Parent Tip:
                                            </p>
                                            <p className="text-xs text-blue-700">
                                                {currentScenario.parentTip}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : null}

            <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
        </ParentGameShell>
    );
};

export default FeelingsFlashcards;
