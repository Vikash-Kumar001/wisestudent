import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";

const EmotionalRepairPractice = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-29";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedSteps, setSelectedSteps] = useState({});
  const [connectionScore, setConnectionScore] = useState(0);
  const [showOutcome, setShowOutcome] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Repair steps: Admit, Acknowledge, Hug, Heal
  const repairSteps = {
    admit: {
      id: 'admit',
      label: 'Admit',
      description: 'Take responsibility for your actions and admit you were wrong',
      icon: '💭'
    },
    acknowledge: {
      id: 'acknowledge',
      label: 'Acknowledge',
      description: 'Acknowledge how your actions affected them emotionally',
      icon: '💙'
    },
    hug: {
      id: 'hug',
      label: 'Hug',
      description: 'Offer physical comfort and presence (or appropriate connection)',
      icon: '🤗'
    },
    heal: {
      id: 'heal',
      label: 'Heal',
      description: 'Discuss how to move forward and prevent this in the future',
      icon: '✨'
    }
  };

  // Scenarios where parent needs to repair connection
  const scenarios = [
    {
      id: 1,
      title: "Lost Temper Over Homework",
      situation: "You lost your temper earlier when helping with homework. You raised your voice, said some harsh words like 'Why can't you just understand this?' and walked away frustrated. Your child is now quiet and withdrawn. They're in their room with the door closed.",
      whatHappened: "You were tired after a long day, and when they couldn't understand the math problem after multiple explanations, you snapped. You shouted and left them to figure it out alone.",
      childFeeling: "Hurt, ashamed, afraid, like they're a burden",
      steps: [
        {
          step: 'admit',
          options: [
            {
              id: 'good',
              text: "I'm sorry. I lost my temper earlier, and that was my fault. I was frustrated, but that's not an excuse for how I treated you. I shouldn't have raised my voice or said those things.",
              score: 25,
              explanation: "This clearly admits fault without excuses. It takes full responsibility."
            },
            {
              id: 'partial',
              text: "I'm sorry I got upset. I was just really frustrated because you weren't getting it, and I had a long day.",
              score: 10,
              explanation: "This partially admits fault but includes excuses ('you weren't getting it', 'long day'), which shifts some blame."
            },
            {
              id: 'poor',
              text: "Look, I'm sorry, but you need to understand that homework needs to get done. I was frustrated, okay?",
              score: 0,
              explanation: "This doesn't really admit fault. It focuses on the child's responsibility and makes the apology conditional."
            }
          ]
        },
        {
          step: 'acknowledge',
          options: [
            {
              id: 'good',
              text: "I know my words and actions hurt you. I can see you're upset, and I'm so sorry that I made you feel like you're a burden or that you're not good enough. That must have felt really scary and sad.",
              score: 25,
              explanation: "This deeply acknowledges their emotional experience and validates their feelings without minimizing."
            },
            {
              id: 'partial',
              text: "I know you're probably feeling bad about this. It's okay, we all get frustrated sometimes.",
              score: 10,
              explanation: "This acknowledges some feeling but is vague and minimizes with 'we all get frustrated.'"
            },
            {
              id: 'poor',
              text: "Come on, you know I didn't mean it. Let's just move on, okay?",
              score: 0,
              explanation: "This dismisses their feelings entirely and rushes to move on without processing."
            }
          ]
        },
        {
          step: 'hug',
          options: [
            {
              id: 'good',
              text: "Can I give you a hug? I want you to know that I love you no matter what, and I'm here for you. Your feelings matter to me.",
              score: 25,
              explanation: "This offers comfort and reassurance, makes them feel safe and loved."
            },
            {
              id: 'partial',
              text: "Come here, let's hug it out. It's going to be okay.",
              score: 10,
              explanation: "This offers physical comfort but doesn't fully address the emotional repair needed."
            },
            {
              id: 'poor',
              text: "Fine, I'm sorry. Can we just move on now? I have things to do.",
              score: 0,
              explanation: "This doesn't offer genuine comfort or connection. It's dismissive and rushed."
            }
          ]
        },
        {
          step: 'heal',
          options: [
            {
              id: 'good',
              text: "I want to do better. When I get frustrated, I'll take a break before I react. And we can work together to find better ways to handle homework that work for both of us. How does that sound?",
              score: 25,
              explanation: "This creates a plan for prevention, involves the child in solutions, and shows commitment to change."
            },
            {
              id: 'partial',
              text: "I'll try to be more patient next time. Let's just make sure we get your homework done earlier so we're not both tired.",
              score: 10,
              explanation: "This acknowledges a need for change but focuses on logistics rather than emotional patterns and doesn't fully involve the child."
            },
            {
              id: 'poor',
              text: "Just don't let this happen again, okay? We both need to do better.",
              score: 0,
              explanation: "This shifts responsibility back to the child and doesn't create a real healing plan."
            }
          ]
        }
      ],
      whyItMatters: "Repairing after losing your temper teaches children that relationships can heal after conflict. It shows them that taking responsibility and apologizing is a strength, not a weakness."
    },
    {
      id: 2,
      title: "Snapped During Morning Rush",
      situation: "During this morning's rush, you snapped at your child for moving too slowly. You said 'Hurry up! You're making us late again!' in an angry tone and grabbed their backpack impatiently. Your child is now avoiding eye contact and seems anxious.",
      whatHappened: "You were stressed about being late for work, and when they were taking time to get ready, you lost patience and reacted harshly.",
      childFeeling: "Anxious, rushed, like they're a problem, worried about disappointing you",
      steps: [
        {
          step: 'admit',
          options: [
            {
              id: 'good',
              text: "I'm sorry I snapped at you this morning. I was stressed about being late, but that doesn't make it okay for me to treat you that way. I shouldn't have grabbed your things or spoken to you that harshly.",
              score: 25,
              explanation: "Clear admission of fault, takes responsibility for specific actions."
            },
            {
              id: 'partial',
              text: "I'm sorry I got upset. Mornings are just really stressful when we're running late.",
              score: 10,
              explanation: "Admits some fault but focuses on circumstances rather than taking full responsibility."
            },
            {
              id: 'poor',
              text: "I'm sorry, but you really do need to move faster in the mornings. We can't always be late.",
              score: 0,
              explanation: "Apology is conditional and shifts blame back to the child."
            }
          ]
        },
        {
          step: 'acknowledge',
          options: [
            {
              id: 'good',
              text: "I can see you're still feeling upset about this morning. My impatience and harsh tone must have made you feel like you're a problem or that you're always disappointing me. I'm so sorry I made you feel that way.",
              score: 25,
              explanation: "Deeply acknowledges their emotional state and validates their experience."
            },
            {
              id: 'partial',
              text: "I know mornings are hard. We both get stressed when we're running late.",
              score: 10,
              explanation: "Acknowledges the situation but doesn't fully address their emotional experience."
            },
            {
              id: 'poor',
              text: "You know I didn't mean to upset you. It's fine, we got there on time anyway.",
              score: 0,
              explanation: "Dismisses their feelings and minimizes the impact."
            }
          ]
        },
        {
          step: 'hug',
          options: [
            {
              id: 'good',
              text: "Can we have a hug? You're not a problem, and you're not disappointing me. I love you, and I want you to feel safe and calm, especially in the mornings.",
              score: 25,
              explanation: "Offers comfort and directly addresses their fears and insecurities."
            },
            {
              id: 'partial',
              text: "Come here, let's hug. It's okay, we're fine now.",
              score: 10,
              explanation: "Offers comfort but doesn't fully address the emotional impact."
            },
            {
              id: 'poor',
              text: "Alright, I said I'm sorry. Can we just move on?",
              score: 0,
              explanation: "No genuine comfort or reassurance offered."
            }
          ]
        },
        {
          step: 'heal',
          options: [
            {
              id: 'good',
              text: "Let's work together to make mornings better. I'll try to stay calmer, and we can find ways to help things go smoother. Maybe we can prepare more the night before. What ideas do you have?",
              score: 25,
              explanation: "Creates collaborative solution, shows commitment to change, involves child."
            },
            {
              id: 'partial',
              text: "I'll try to be more patient. Maybe we should both wake up a bit earlier so we're not rushed.",
              score: 10,
              explanation: "Acknowledges need for change but doesn't fully involve child in solution."
            },
            {
              id: 'poor',
              text: "Just try to be ready faster next time, and I'll try not to get so stressed.",
              score: 0,
              explanation: "Puts responsibility back on child, doesn't create meaningful change plan."
            }
          ]
        }
      ],
      whyItMatters: "Repairing after morning conflicts is especially important because how the day starts sets the tone. A good repair can reset the day and teach children that mistakes can be fixed."
    },
    {
      id: 3,
      title: "Yelled During Sibling Conflict",
      situation: "Earlier, when your children were fighting, you yelled at both of them to 'Stop it!' and sent them to their rooms without listening. You were overwhelmed and reacted harshly. Now one child is crying, and the other is angry. They're both hurt by your reaction.",
      whatHappened: "You were trying to work and the fighting was loud and disruptive. Instead of helping them resolve it, you reacted from frustration and punished them both without understanding what happened.",
      childFeeling: "Unfairly punished, unheard, like their problems don't matter, scared of your anger",
      steps: [
        {
          step: 'admit',
          options: [
            {
              id: 'good',
              text: "I'm sorry I yelled and sent you to your rooms without listening. I was overwhelmed and frustrated, but that's not an excuse. I should have helped you work through the problem instead of just reacting angrily.",
              score: 25,
              explanation: "Takes full responsibility, admits specific wrong actions, doesn't make excuses."
            },
            {
              id: 'partial',
              text: "I'm sorry I got so upset. I was trying to work and the fighting was just too much. I should have handled it better.",
              score: 10,
              explanation: "Admits some fault but includes excuses about circumstances."
            },
            {
              id: 'poor',
              text: "I'm sorry, but you two were fighting and being loud. I had to do something.",
              score: 0,
              explanation: "Justifies actions rather than taking responsibility."
            }
          ]
        },
        {
          step: 'acknowledge',
          options: [
            {
              id: 'good',
              text: "I know it must have felt really unfair to both of you when I didn't listen to your side of things. I can see you're both upset—one of you is crying and one is angry—and I'm sorry I made you feel unheard and scared.",
              score: 25,
              explanation: "Deeply acknowledges each child's experience and validates their feelings."
            },
            {
              id: 'partial',
              text: "I know you're both upset. I should have listened better before reacting.",
              score: 10,
              explanation: "Acknowledges some feeling but is more general and less specific."
            },
            {
              id: 'poor',
              text: "Come on, you know I had to stop the fighting. Let's just move past this.",
              score: 0,
              explanation: "Dismisses their feelings and rushes past the impact."
            }
          ]
        },
        {
          step: 'hug',
          options: [
            {
              id: 'good',
              text: "Can we all have a group hug? I want you both to know that your problems matter to me, and I'm sorry I didn't show that earlier. Your feelings are important, and I want to help you work through conflicts together.",
              score: 25,
              explanation: "Offers comfort to both, validates their importance, shows care for their problems."
            },
            {
              id: 'partial',
              text: "Come here, both of you. Let's hug and move on from this.",
              score: 10,
              explanation: "Offers physical comfort but doesn't fully address emotional needs."
            },
            {
              id: 'poor',
              text: "Alright, I said I'm sorry. Can we just get past this now?",
              score: 0,
              explanation: "No genuine comfort or connection offered."
            }
          ]
        },
        {
          step: 'heal',
          options: [
            {
              id: 'good',
              text: "I want to do better. Next time there's a conflict, I'll take a moment to calm down, then I'll listen to both of you and help you work through it together. No more yelling or sending you away. Let's practice this—can you tell me what happened earlier?",
              score: 25,
              explanation: "Creates specific plan, commits to change, offers to repair the original situation."
            },
            {
              id: 'partial',
              text: "I'll try to listen better next time and not react so quickly. We all need to work on handling conflicts better.",
              score: 10,
              explanation: "Acknowledges need for change but is vague and doesn't involve children in repair."
            },
            {
              id: 'poor',
              text: "Just try not to fight so much, and I'll try not to get so frustrated. Deal?",
              score: 0,
              explanation: "Shifts responsibility to children, doesn't create meaningful change."
            }
          ]
        }
      ],
      whyItMatters: "Repairing after conflict shows children that relationships can heal. It teaches them that even parents make mistakes and that taking responsibility is important."
    },
    {
      id: 4,
      title: "Criticized Bedtime Behavior",
      situation: "Last night, when your child resisted bedtime, you got frustrated and said some critical things like 'Why do you always do this? You're so difficult at bedtime!' Your child went to bed upset and quiet. Today they've been more distant and seem sad.",
      whatHappened: "You were exhausted and wanted some quiet time. When bedtime became a struggle, you reacted with criticism instead of understanding their resistance.",
      childFeeling: "Like they're difficult, like they're a problem, sad, worried they're disappointing you",
      steps: [
        {
          step: 'admit',
          options: [
            {
              id: 'good',
              text: "I'm sorry for what I said last night about you being difficult. That was wrong and hurtful. I was tired and frustrated, but those words weren't fair or true. I shouldn't have criticized you like that.",
              score: 25,
              explanation: "Takes full responsibility for specific harmful words, doesn't make excuses."
            },
            {
              id: 'partial',
              text: "I'm sorry I got frustrated last night. I was just really tired and bedtime was hard.",
              score: 10,
              explanation: "Admits frustration but doesn't take full responsibility for the criticism."
            },
            {
              id: 'poor',
              text: "I'm sorry, but bedtime really is a struggle every night. I just get frustrated.",
              score: 0,
              explanation: "Justifies the criticism rather than taking responsibility."
            }
          ]
        },
        {
          step: 'acknowledge',
          options: [
            {
              id: 'good',
              text: "I can see you're still feeling hurt from what I said. Those words must have made you feel like you're a problem or that you're always disappointing me. I can see you've been sad and distant today, and I'm so sorry I made you feel that way.",
              score: 25,
              explanation: "Deeply acknowledges their emotional state and validates their experience."
            },
            {
              id: 'partial',
              text: "I know you're probably still upset about last night. I shouldn't have said those things.",
              score: 10,
              explanation: "Acknowledges some feeling but is less specific about the impact."
            },
            {
              id: 'poor',
              text: "Come on, you know I didn't mean it. Let's just forget about it.",
              score: 0,
              explanation: "Dismisses their feelings and wants to move on without processing."
            }
          ]
        },
        {
          step: 'hug',
          options: [
            {
              id: 'good',
              text: "Can I give you a hug? You're not difficult, and you're not a problem. I love you exactly as you are. I want you to know that your feelings matter, and I'm sorry I made you feel like they don't.",
              score: 25,
              explanation: "Offers comfort and directly counters the harmful words, validates their worth."
            },
            {
              id: 'partial',
              text: "Come here, let's hug. I'm sorry about last night. It's okay now.",
              score: 10,
              explanation: "Offers comfort but doesn't fully address the specific hurt."
            },
            {
              id: 'poor',
              text: "I said I'm sorry. Can we just move on?",
              score: 0,
              explanation: "No genuine comfort or reassurance."
            }
          ]
        },
        {
          step: 'heal',
          options: [
            {
              id: 'good',
              text: "I want to understand what makes bedtime hard for you and find ways to make it better. Maybe we can create a calmer bedtime routine together. And I'll work on staying patient and kind, even when I'm tired. What would help you feel better at bedtime?",
              score: 25,
              explanation: "Shows commitment to understanding and change, involves child in creating solutions."
            },
            {
              id: 'partial',
              text: "I'll try to be more patient at bedtime. Let's both work on making bedtime smoother.",
              score: 10,
              explanation: "Acknowledges need for change but doesn't fully involve child in solution."
            },
            {
              id: 'poor',
              text: "Just try to be better at bedtime, and I'll try not to get so frustrated.",
              score: 0,
              explanation: "Puts responsibility on child, doesn't create meaningful change plan."
            }
          ]
        }
      ],
      whyItMatters: "Repairing after critical words is crucial because words can stick with children. A genuine repair can help heal the hurt and show them that they're loved and valued."
    },
    {
      id: 5,
      title: "Ignored Their Feelings",
      situation: "Earlier today, your child was upset about something and tried to tell you about it. You were busy and distracted, and you dismissed them by saying 'That's not a big deal, just get over it.' They're now withdrawn and haven't wanted to talk to you since.",
      whatHappened: "You were focused on something else and didn't take the time to listen. When they tried to share their feelings, you minimized them and moved on.",
      childFeeling: "Unheard, unimportant, like their feelings don't matter, rejected, alone",
      steps: [
        {
          step: 'admit',
          options: [
            {
              id: 'good',
              text: "I'm sorry I dismissed your feelings earlier when you tried to tell me what was bothering you. I was distracted and busy, but that's not an excuse. Your feelings matter, and I should have listened. I was wrong to say it wasn't a big deal.",
              score: 25,
              explanation: "Takes full responsibility, admits dismissing their feelings, doesn't make excuses."
            },
            {
              id: 'partial',
              text: "I'm sorry I wasn't really listening earlier. I was just really busy with something else.",
              score: 10,
              explanation: "Admits not listening but includes excuse about being busy."
            },
            {
              id: 'poor',
              text: "I'm sorry, but you know I was busy. You can't expect me to drop everything all the time.",
              score: 0,
              explanation: "Justifies the dismissal rather than taking responsibility."
            }
          ]
        },
        {
          step: 'acknowledge',
          options: [
            {
              id: 'good',
              text: "I can see you're hurt and withdrawn. When I dismissed your feelings, I must have made you feel like what you feel doesn't matter to me, like you're not important. That must have felt really lonely and hurtful, and I'm so sorry.",
              score: 25,
              explanation: "Deeply acknowledges their emotional experience and validates their hurt."
            },
            {
              id: 'partial',
              text: "I know you're probably still upset about earlier. I should have listened better.",
              score: 10,
              explanation: "Acknowledges some feeling but is less specific about the emotional impact."
            },
            {
              id: 'poor',
              text: "Come on, you know I care. Let's just move past this.",
              score: 0,
              explanation: "Dismisses their feelings again and wants to rush past it."
            }
          ]
        },
        {
          step: 'hug',
          options: [
            {
              id: 'good',
              text: "Can we talk now? I'm here and I'm listening. Your feelings are important to me, and I want to hear what you were trying to tell me earlier. I'm so sorry I made you feel like you don't matter—you absolutely do.",
              score: 25,
              explanation: "Offers presence and listening, validates their importance, addresses their hurt."
            },
            {
              id: 'partial',
              text: "Come here, let's talk. I'll listen now, I promise.",
              score: 10,
              explanation: "Offers to listen but doesn't fully address the emotional impact."
            },
            {
              id: 'poor',
              text: "I said I'm sorry. Can we just forget about it?",
              score: 0,
              explanation: "No genuine offer to repair the original situation."
            }
          ]
        },
        {
          step: 'heal',
          options: [
            {
              id: 'good',
              text: "I want to do better. When you need to talk, I'll stop what I'm doing and really listen. Your feelings are always important, even when I'm busy. Can you tell me now what you were trying to share earlier? I'm ready to listen.",
              score: 25,
              explanation: "Creates commitment to change, validates ongoing importance of feelings, offers to repair by listening now."
            },
            {
              id: 'partial',
              text: "I'll try to listen better when you want to talk. I know your feelings matter.",
              score: 10,
              explanation: "Acknowledges need for change but doesn't fully repair the original situation."
            },
            {
              id: 'poor',
              text: "Just try to tell me when I'm not so busy next time, okay?",
              score: 0,
              explanation: "Shifts responsibility to child rather than taking ownership."
            }
          ]
        }
      ],
      whyItMatters: "Repairing after dismissing feelings is especially important because it teaches children that their emotions are valid and that they matter, even when parents make mistakes."
    }
  ];

  const handleStepChoice = (stepId, optionId) => {
    if (selectedSteps[`${currentScenario}-${stepId}`]) return; // Already answered

    const currentStepData = scenarios[currentScenario].steps.find(s => s.step === stepId);
    const selectedOption = currentStepData.options.find(opt => opt.id === optionId);
    
    // Create the updated steps object
    const updatedSteps = {
      ...selectedSteps,
      [`${currentScenario}-${stepId}`]: {
        step: stepId,
        option: optionId,
        score: selectedOption.score
      }
    };
    
    setSelectedSteps(updatedSteps);

    // Update connection score
    setConnectionScore(prev => prev + selectedOption.score);

    // Check if all steps are completed for this scenario (check against updated state)
    const allStepsKeys = scenarios[currentScenario].steps.map(step => `${currentScenario}-${step.step}`);
    const completedSteps = allStepsKeys.filter(key => updatedSteps[key]);
    
    if (completedSteps.length === scenarios[currentScenario].steps.length) {
      // All steps completed for this scenario
      const scenarioSteps = scenarios[currentScenario].steps.length;
      const totalPossible = scenarioSteps * 25;
      const currentTotal = allStepsKeys.reduce((sum, key) => {
        return sum + (updatedSteps[key]?.score || 0);
      }, 0);
      
      const scenarioScore = Math.round((currentTotal / totalPossible) * 100);
      if (scenarioScore >= 80) {
        setScore(prev => prev + 1);
      }
      setTimeout(() => {
        setShowOutcome(true);
      }, 500);
    }
  };

  const handleNext = () => {
    setShowOutcome(false);
    setConnectionScore(0); // Reset for next scenario
    if (currentScenario < totalLevels - 1) {
      const nextScenario = currentScenario + 1;
      setCurrentScenario(nextScenario);
      // Keep all selections (they're keyed by scenario-step, so they won't interfere)
    } else {
      setShowGameOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentScenario(0);
    setSelectedSteps({});
    setConnectionScore(0);
    setShowOutcome(false);
    setScore(0);
    setShowGameOver(false);
  };

  const current = scenarios[currentScenario];
  const progress = ((currentScenario + 1) / totalLevels) * 100;
  
  // Calculate current scenario score
  const currentScenarioSteps = Object.keys(selectedSteps)
    .filter(key => key.startsWith(`${currentScenario}-`))
    .map(key => selectedSteps[key]);
  const currentScenarioScore = currentScenarioSteps.reduce((sum, step) => sum + (step.score || 0), 0);
  const maxScenarioScore = current.steps.length * 25;
  const scenarioPercentage = maxScenarioScore > 0 ? Math.round((currentScenarioScore / maxScenarioScore) * 100) : 0;

  // Get score label
  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Connection';
    if (score >= 60) return 'Strong Connection';
    if (score >= 40) return 'Moderate Connection';
    return 'Weak Connection';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-blue-500 to-indigo-600';
    if (score >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-600';
  };

  // Game content
  const gameContent = (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <motion.div
        key={currentScenario}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Scenario {currentScenario + 1} of {totalLevels}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
            />
          </div>
        </div>

        {/* Connection Score */}
        {currentScenarioSteps.length > 0 && (
          <div className={`bg-gradient-to-r ${getScoreColor(scenarioPercentage)} rounded-xl p-4 shadow-lg mb-6`}>
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-sm font-medium opacity-90">Connection Score</p>
                <p className="text-2xl font-bold">{scenarioPercentage}%</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium opacity-90">{getScoreLabel(scenarioPercentage)}</p>
              </div>
            </div>
          </div>
        )}

        {!showOutcome ? (
          <>
            {/* Scenario description */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 mb-8 shadow-xl border-2 border-indigo-200">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {current.title}
                </h2>
                <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    {current.situation}
                  </p>
                  <div className="bg-indigo-100 rounded-lg p-4 mb-3">
                    <p className="text-sm text-indigo-800 font-medium mb-2">
                      <strong>What happened:</strong> {current.whatHappened}
                    </p>
                    <p className="text-sm text-indigo-800 font-medium">
                      <strong>How they're feeling:</strong> {current.childFeeling}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xl font-semibold text-gray-800 mb-2">
                  Practice Emotional Repair
                </p>
                <p className="text-sm text-gray-600">
                  Follow the steps: Admit → Acknowledge → Hug → Heal
                </p>
              </div>
            </div>

            {/* Repair Steps */}
            <div className="space-y-6 mb-6">
              {current.steps.map((stepData, index) => {
                const stepInfo = repairSteps[stepData.step];
                const selected = selectedSteps[`${currentScenario}-${stepData.step}`];
                
                return (
                  <div key={stepData.step} className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-3xl">{stepInfo.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Step {index + 1}: {stepInfo.label}
                        </h3>
                        <p className="text-sm text-gray-600">{stepInfo.description}</p>
                      </div>
                      {selected && (
                        <div className="ml-auto">
                          <span className="text-sm font-semibold text-green-600">
                            +{selected.score} pts
                          </span>
                        </div>
                      )}
                    </div>

                    {!selected ? (
                      <div className="grid grid-cols-1 gap-3">
                        {stepData.options.map((option) => (
                          <motion.button
                            key={option.id}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleStepChoice(stepData.step, option.id)}
                            className={`p-4 rounded-lg border-2 text-left transition-all ${
                              option.id === 'good'
                                ? 'border-green-300 bg-green-50 hover:bg-green-100 hover:shadow-md'
                                : option.id === 'partial'
                                ? 'border-yellow-300 bg-yellow-50 hover:bg-yellow-100 hover:shadow-md'
                                : 'border-red-300 bg-red-50 hover:bg-red-100 hover:shadow-md'
                            }`}
                          >
                            <p className="text-sm text-gray-700 italic mb-2">"{option.text}"</p>
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-medium ${
                                option.id === 'good' ? 'text-green-700' :
                                option.id === 'partial' ? 'text-yellow-700' :
                                'text-red-700'
                              }`}>
                                {option.id === 'good' ? '✓ Strong' :
                                 option.id === 'partial' ? '○ Moderate' :
                                 '✗ Weak'}
                              </span>
                              <span className="text-xs text-gray-600">+{option.score} pts</span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-700 italic mb-2">
                          "{stepData.options.find(opt => opt.id === selected.option).text}"
                        </p>
                        <p className="text-xs text-gray-600">
                          {stepData.options.find(opt => opt.id === selected.option).explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Outcome display */
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Final Score */}
              <div className={`bg-gradient-to-r ${getScoreColor(scenarioPercentage)} rounded-2xl p-8 shadow-xl text-white text-center`}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="text-6xl mb-4"
                >
                  {scenarioPercentage >= 80 ? '💚' : scenarioPercentage >= 60 ? '💙' : scenarioPercentage >= 40 ? '💛' : '❤️'}
                </motion.div>
                <h3 className="text-3xl font-bold mb-2">Connection Score: {scenarioPercentage}%</h3>
                <p className="text-xl opacity-90">{getScoreLabel(scenarioPercentage)}</p>
              </div>

              {/* Summary */}
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Repair Steps Summary:</h4>
                <div className="space-y-3">
                  {current.steps.map((stepData, index) => {
                    const stepInfo = repairSteps[stepData.step];
                    const selected = selectedSteps[`${currentScenario}-${stepData.step}`];
                    const option = stepData.options.find(opt => opt.id === selected?.option);
                    
                    return (
                      <div key={stepData.step} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-xl">{stepInfo.icon}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{stepInfo.label}</p>
                          <p className="text-sm text-gray-600 italic mt-1">"{option?.text}"</p>
                          <p className="text-xs text-gray-500 mt-1">+{option?.score || 0} points</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Why it matters */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <p className="text-blue-800 font-semibold">
                  💡 {current.whyItMatters}
                </p>
              </div>

              {/* Parent tip */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                delay={0.3}
                className="bg-amber-50 border border-amber-200 rounded-xl p-6"
              >
                <p className="text-sm text-amber-800 leading-relaxed">
                  <strong>💡 Parent Tip:</strong> A calm apology teaches emotional maturity far better than perfection. 
                  When you lose your temper and then repair the connection, you show your child that mistakes can be fixed, 
                  that taking responsibility is a strength, and that relationships can heal after conflict. This is one of the most 
                  important skills you can model for your children.
                </p>
              </motion.div>

              {/* Next button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {currentScenario < totalLevels - 1 ? 'Next Scenario' : 'View Results'}
              </motion.button>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );

  return (
    <ParentGameShell
      gameId={gameId}
      gameData={gameData}
      totalCoins={totalCoins}
      totalLevels={totalLevels}
      currentLevel={currentScenario + 1}
      score={score}
      showGameOver={showGameOver}
      onRestart={handleRestart}
      progress={progress}
    >
      {gameContent}
    </ParentGameShell>
  );
};

export default EmotionalRepairPractice;

