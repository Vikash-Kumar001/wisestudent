import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";

const ActiveEmpathyRoleplay = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-26";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;
  
  const [currentScenario, setCurrentScenario] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState({});
  const [empathyLevel, setEmpathyLevel] = useState(50); // Start at neutral 50%
  const [showOutcome, setShowOutcome] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Interactive story scenarios with multiple decision points
  const scenarios = [
    {
      id: 1,
      title: "Tired Evening Argument",
      context: "It's 8 PM on a Thursday. You've had a long, stressful day at work. Dinner is late, and you're exhausted. Your child is tired too, and tensions are high.",
      steps: [
        {
          step: 0,
          story: "You've just finished a draining work call. Your 8-year-old comes into the kitchen crying because they can't find their favorite toy. They're whining and being clingy.",
          question: "How do you respond?",
          options: [
            {
              id: 'empathetic',
              text: "I can see you're really upset about your toy. It's frustrating when something important goes missing. Let's take a breath together and I'll help you look for it.",
              empathyChange: +15,
              outcome: "Your child feels heard and calms down slightly. The empathy you showed helps de-escalate the situation.",
              explanation: "Acknowledging their emotion and offering help creates connection and reduces stress for both of you."
            },
            {
              id: 'neutral',
              text: "Okay, we'll look for it after dinner. Right now I need to make dinner. Can you help me set the table?",
              empathyChange: 0,
              outcome: "Your child is still upset but slightly distracted. The situation remains tense but manageable.",
              explanation: "This response is practical but doesn't address the emotional need, which can leave tension unresolved."
            },
            {
              id: 'dismissive',
              text: "Stop crying! It's just a toy. You can't find something every five minutes. Go look for it yourself, I'm busy making dinner!",
              empathyChange: -20,
              outcome: "Your child becomes more upset and cries harder. The emotional distance increases, making everything harder.",
              explanation: "Dismissing their feelings increases their stress and your own. The situation escalates instead of resolving."
            }
          ]
        },
        {
          step: 1,
          story: "While you're helping look for the toy, your child knocks over a cup of water that was on the counter. Water spills everywhere, including on some papers you had sitting out.",
          question: "How do you respond?",
          options: [
            {
              id: 'empathetic',
              text: "I can see that was an accident. Accidents happen when we're stressed. Let's clean this up together, and then we can keep looking for your toy.",
              empathyChange: +10,
              outcome: "Your child feels less guilty and more supported. They help clean up willingly, and the connection strengthens.",
              explanation: "Recognizing it as an accident and maintaining empathy even when stressed models emotional regulation for your child."
            },
            {
              id: 'neutral',
              text: "Oh no. That's okay, accidents happen. Let me clean this up. Just be more careful next time.",
              empathyChange: -5,
              outcome: "Your child feels a bit guilty but understands. The situation is handled, but there's minimal emotional connection.",
              explanation: "This response is practical but doesn't fully acknowledge their emotional state or offer connection."
            },
            {
              id: 'dismissive',
              text: "Great! Just what I needed right now! Can't you be more careful? This is why I don't like you in the kitchen when I'm trying to get things done!",
              empathyChange: -25,
              outcome: "Your child feels shame and guilt. They shut down emotionally. The evening becomes more difficult for everyone.",
              explanation: "Reacting with frustration when you're tired is understandable, but it damages connection and increases everyone's stress."
            }
          ]
        },
        {
          step: 2,
          story: "After cleaning up, you realize dinner is even more behind schedule. Your child starts complaining that they're hungry and dinner is taking forever. They're being difficult about what to eat.",
          question: "How do you respond?",
          options: [
            {
              id: 'empathetic',
              text: "I know you're really hungry, and I'm working as fast as I can. This has been a stressful evening for both of us. Let's make something simple together that we both like.",
              empathyChange: +10,
              outcome: "Your child feels understood and becomes more patient. Working together actually makes dinner faster and improves the mood.",
              explanation: "Acknowledging both of your needs and finding a collaborative solution builds connection even when you're both stressed."
            },
            {
              id: 'neutral',
              text: "I'm doing my best. Dinner will be ready in 10 minutes. You can wait, or you can have some fruit now if you're that hungry.",
              empathyChange: -3,
              outcome: "Your child accepts the solution but still feels a bit ignored. The evening remains functional but disconnected.",
              explanation: "This response solves the practical problem but misses an opportunity for emotional connection and teaching patience."
            },
            {
              id: 'dismissive',
              text: "You know what, I give up! If you're going to complain about everything, you can just make your own dinner! I'm tired of this every night!",
              empathyChange: -30,
              outcome: "Your child feels rejected and hurt. The evening becomes a battle, and both of you feel worse. The connection is damaged.",
              explanation: "When we're exhausted, it's easy to react from frustration. This response teaches your child that their needs are burdensome."
            }
          ]
        },
        {
          step: 3,
          story: "During dinner, your child says they don't like what you made and pushes their plate away. You've had a long day, and this feels like the last straw.",
          question: "How do you respond?",
          options: [
            {
              id: 'empathetic',
              text: "I can see you're not feeling this meal tonight. We've both had a tough evening. Let's talk about what's really going on. Are you okay?",
              empathyChange: +15,
              outcome: "Your child opens up about feeling stressed and tired too. You have a meaningful conversation and find a solution together.",
              explanation: "Choosing empathy when you're at your breaking point is incredibly difficult but incredibly powerful. It models resilience."
            },
            {
              id: 'neutral',
              text: "I understand you don't like it, but this is what we have tonight. You need to eat something. Here, at least try a few bites.",
              empathyChange: -5,
              outcome: "Your child eats reluctantly. The meal is quiet and tense. The practical need is met, but the emotional need isn't addressed.",
              explanation: "This response maintains a boundary but doesn't explore what might be behind the behavior or offer emotional support."
            },
            {
              id: 'dismissive',
              text: "That's it! I'm done! You're being impossible tonight! Go to your room if you're not going to eat! I can't deal with this right now!",
              empathyChange: -35,
              outcome: "Your child feels abandoned and misunderstood. The evening ends with both of you upset and disconnected. Trust is damaged.",
              explanation: "When we're exhausted, our capacity for empathy decreases. This response comes from being overwhelmed, but it teaches children that their emotions are too much for us to handle."
            }
          ]
        },
        {
          step: 4,
          story: "Later in the evening, you're finally sitting down to relax. Your child comes to you and apologizes for being difficult. They look genuinely sorry and tired.",
          question: "How do you respond?",
          options: [
            {
              id: 'empathetic',
              text: "Thank you for apologizing. That means a lot to me. Tonight was hard for both of us, and I'm sorry I got frustrated too. We're both learning. I love you.",
              empathyChange: +20,
              outcome: "Your child feels fully seen and loved. The difficult evening ends with connection and understanding. Your relationship is stronger.",
              explanation: "Acknowledging your own struggles and meeting their apology with empathy and love repairs any damage and deepens connection."
            },
            {
              id: 'neutral',
              text: "That's okay. We all have tough days. Let's just move on and have a better day tomorrow.",
              empathyChange: +5,
              outcome: "The situation is resolved, but the emotional repair is incomplete. The connection feels okay but not deeply restored.",
              explanation: "This response accepts the apology but doesn't fully engage with the emotional repair that could strengthen your relationship."
            },
            {
              id: 'dismissive',
              text: "It's fine. Just don't let it happen again. You need to learn to handle yourself better when you're tired.",
              empathyChange: -10,
              outcome: "Your child's vulnerability is met with criticism. They learn that apologies aren't always met with understanding. Connection remains damaged.",
              explanation: "When children apologize, they're being vulnerable. Meeting that vulnerability with criticism teaches them to avoid apologizing."
            }
          ]
        }
      ],
      correctChoices: ['empathetic', 'empathetic', 'empathetic', 'empathetic', 'empathetic'],
      whyItMatters: "Practicing empathy when you're exhausted is one of the hardest but most important parenting skills. It teaches your child that emotions are manageable, that connection matters even when life is hard, and that they are worth your effort even when you're tired."
    },
    {
      id: 2,
      title: "Bedtime Battle",
      context: "It's been a long day and you're ready for some quiet time. Your child, however, is wired and refusing to go to bed. You need to get work done, but they keep coming out of their room.",
      steps: [
        {
          step: 0,
          story: "It's 9 PM, an hour past bedtime. You've asked your child to go to bed three times, but they keep coming out saying they're not tired and want to stay up.",
          question: "How do you respond?",
          options: [
            {
              id: 'empathetic',
              text: "I can see you're having trouble winding down tonight. Sometimes our bodies need help relaxing even when our minds feel awake. Let's do our bedtime routine together—it helps both of us calm down.",
              empathyChange: +15,
              outcome: "Your child feels understood and becomes more cooperative. The bedtime routine becomes a calming ritual rather than a battle.",
              explanation: "Acknowledging that they're struggling to wind down and offering to help creates connection and makes the transition easier."
            },
            {
              id: 'neutral',
              text: "It's bedtime now. You need to go to sleep because you have school tomorrow. Let's get ready for bed.",
              empathyChange: -5,
              outcome: "Your child reluctantly complies but the tension remains. Bedtime becomes a power struggle rather than a peaceful transition.",
              explanation: "This response focuses on rules and logic but doesn't address the emotional or physical need to wind down."
            },
            {
              id: 'dismissive',
              text: "I don't care if you're tired or not! Go to bed NOW! I've asked you three times already and I'm done asking!",
              empathyChange: -20,
              outcome: "Your child becomes more resistant and anxious. The bedtime battle escalates, and everyone becomes more stressed.",
              explanation: "Reacting with frustration increases everyone's stress. The child learns that their needs don't matter when you're tired."
            }
          ]
        },
        {
          step: 1,
          story: "Fifteen minutes later, your child is out of bed again, saying they're scared of the dark and can't sleep. You were just starting to relax and get some work done.",
          question: "How do you respond?",
          options: [
            {
              id: 'empathetic',
              text: "I hear that you're feeling scared. The dark can feel really overwhelming sometimes. Let's turn on a nightlight and I'll sit with you for a few minutes until you feel safer.",
              empathyChange: +12,
              outcome: "Your child feels safe and supported. The fear reduces, and they're able to relax. You still get your quiet time, just a bit later.",
              explanation: "Validating their fear and offering comfort addresses the real need. The few extra minutes of connection prevent hours of battles."
            },
            {
              id: 'neutral',
              text: "There's nothing to be scared of. It's just dark. Go back to bed and close your eyes. You'll fall asleep if you try.",
              empathyChange: -8,
              outcome: "Your child feels dismissed and still scared. They may come out again or have trouble sleeping, which means you'll be interrupted more.",
              explanation: "Dismissing fear doesn't make it go away. It just teaches children that their feelings aren't valid."
            },
            {
              id: 'dismissive',
              text: "I'm tired of this! You're too old to be scared of the dark! Just go to bed and stop bothering me! I need to work!",
              empathyChange: -25,
              outcome: "Your child feels abandoned with their fear. They may become more anxious or keep coming out because their emotional need isn't met.",
              explanation: "Rejecting their fear when you're tired is understandable but damaging. Children need help processing fear, not dismissal."
            }
          ]
        },
        {
          step: 2,
          story: "After helping them settle, they're finally quiet. But 20 minutes later, they're out again, asking for water and saying they can't sleep. You're getting frustrated.",
          question: "How do you respond?",
          options: [
            {
              id: 'empathetic',
              text: "I can see you're really having trouble settling tonight. Sometimes when we can't sleep, it's because something is on our mind. Want to tell me what you're thinking about?",
              empathyChange: +10,
              outcome: "Your child opens up about worries or thoughts keeping them awake. Addressing the root cause helps them actually settle.",
              explanation: "Choosing empathy when you're frustrated and just want peace takes effort, but it addresses the real issue and prevents more interruptions."
            },
            {
              id: 'neutral',
              text: "Here's some water. Now please try to sleep. It's getting really late and you need your rest.",
              empathyChange: -5,
              outcome: "Your child drinks the water but may still have trouble sleeping. The underlying issue isn't addressed, so they might come out again.",
              explanation: "This response is practical but doesn't explore why they're having so much trouble settling."
            },
            {
              id: 'dismissive',
              text: "This is the last time! I'm serious! If you come out again, there will be consequences! I need you to GO TO SLEEP!",
              empathyChange: -30,
              outcome: "Your child feels threatened and anxious. The stress makes it even harder to sleep. You may end up with more interruptions or a distressed child.",
              explanation: "Threats and frustration increase stress, which makes sleep harder. This creates a cycle that makes bedtime battles worse."
            }
          ]
        },
        {
          step: 3,
          story: "They've finally fallen asleep, but it's now 10:30 PM and you're exhausted. You realize you won't get any work done tonight, and you're feeling resentful about the lost time.",
          question: "How do you process this internally?",
          options: [
            {
              id: 'empathetic',
              text: "I'm tired and disappointed about not getting work done, but my child needed me tonight. They were struggling, and I helped them through it. That matters more than my to-do list.",
              empathyChange: +15,
              outcome: "You feel proud of choosing connection over productivity. You recognize that being there for your child is meaningful work. You sleep better knowing you met their needs.",
              explanation: "Reframing the situation with empathy helps you see the value in what you did. This reduces resentment and increases satisfaction."
            },
            {
              id: 'neutral',
              text: "Well, that's parenting. Sometimes things don't go as planned. I'll just have to catch up on work tomorrow. It is what it is.",
              empathyChange: 0,
              outcome: "You accept the situation but don't find meaning in it. You may still feel some resentment, and the experience doesn't feel particularly positive.",
              explanation: "Accepting the situation is better than resentment, but finding meaning in meeting your child's needs can increase satisfaction."
            },
            {
              id: 'dismissive',
              text: "This is so frustrating! My child is so needy and demanding. I never get anything done because they always need something! This isn't fair!",
              empathyChange: -20,
              outcome: "You feel resentful and negative. The experience feels like a burden rather than meaningful connection. You go to bed stressed and unhappy.",
              explanation: "Focusing on what you lost rather than what you gave increases resentment and makes parenting feel like a burden rather than a meaningful choice."
            }
          ]
        }
      ],
      correctChoices: ['empathetic', 'empathetic', 'empathetic', 'empathetic'],
      whyItMatters: "Bedtime battles are exhausting, especially when you need time for yourself. But practicing empathy during these challenging moments teaches your child that their needs matter even when it's inconvenient. It also models how to handle frustration with grace."
    },
    {
      id: 3,
      title: "Homework Meltdown",
      context: "You're trying to help your child with homework after a long day. They're frustrated, you're tired, and the homework is taking way longer than it should. Tensions are rising.",
      steps: [
        {
          step: 0,
          story: "Your child is struggling with math homework and getting increasingly frustrated. They're starting to cry and saying 'I can't do this! I'm stupid!' They throw their pencil down.",
          question: "How do you respond?",
          options: [
            {
              id: 'empathetic',
              text: "I can see this is really frustrating for you. Math can feel really hard sometimes, and that's okay. Let's take a break together. When we're this frustrated, our brains don't work as well.",
              empathyChange: +15,
              outcome: "Your child feels understood and their frustration decreases. After a break, they're more able to approach the problem with a clearer mind.",
              explanation: "Acknowledging their frustration and offering a break shows you understand their emotional state. This often helps them regulate and return to the task more successfully."
            },
            {
              id: 'neutral',
              text: "It's okay, you're not stupid. Math is just hard. Let's try again. Take a deep breath and we'll work through this together.",
              empathyChange: +3,
              outcome: "Your child calms down slightly, but the underlying frustration remains. The homework may still be a struggle.",
              explanation: "This response is supportive but doesn't fully address the emotional overwhelm. A break might be more helpful than pushing through."
            },
            {
              id: 'dismissive',
              text: "Stop saying you're stupid! You're not! Just focus and try harder! Throwing your pencil isn't helping! Let's just get this done!",
              empathyChange: -20,
              outcome: "Your child becomes more frustrated and feels misunderstood. The homework battle escalates, and learning becomes even harder.",
              explanation: "Trying to push through frustration often makes it worse. The child needs emotional support before they can learn effectively."
            }
          ]
        },
        {
          step: 1,
          story: "After the break, you try to help them understand the math problem again. But they're still struggling, and now you're getting frustrated too. You've explained it three different ways.",
          question: "How do you respond?",
          options: [
            {
              id: 'empathetic',
              text: "I'm feeling frustrated too, and I can see you are as well. This is hard for both of us. Maybe we need to try a different approach, or maybe we should ask your teacher for help tomorrow. That's okay.",
              empathyChange: +12,
              outcome: "Your child feels less pressure and more supported. You both feel relieved. The homework gets done later with help, or you communicate with the teacher.",
              explanation: "Being honest about your own frustration while maintaining empathy models emotional awareness. It also shows it's okay to ask for help."
            },
            {
              id: 'neutral',
              text: "This is challenging, but we need to keep trying. Let's try explaining it one more time, a different way.",
              empathyChange: -5,
              outcome: "You both continue to struggle. The frustration may increase, and the homework may or may not get completed successfully.",
              explanation: "Persistence can be good, but sometimes we need to recognize when a different approach or help is needed rather than repeating the same strategy."
            },
            {
              id: 'dismissive',
              text: "I've explained this three times! You're not even trying to listen! I'm done! Figure it out yourself!",
              empathyChange: -30,
              outcome: "Your child feels abandoned and incapable. Their confidence decreases, and they may develop anxiety about homework. The relationship is damaged.",
              explanation: "Giving up in frustration teaches children that you'll abandon them when things get hard. This can create lasting anxiety about learning."
            }
          ]
        },
        {
          step: 2,
          story: "Your child starts complaining that the homework is too hard and that other kids don't have this much trouble. They're comparing themselves negatively to classmates.",
          question: "How do you respond?",
          options: [
            {
              id: 'empathetic',
              text: "I hear that you're feeling like you're behind others, and that must feel really discouraging. Everyone learns at different speeds, and that's normal. What matters is that you're trying, and we'll find a way that works for you.",
              empathyChange: +15,
              outcome: "Your child feels validated and less alone. Their self-worth isn't tied to comparison. They become more open to learning.",
              explanation: "Addressing the emotional comparison while reinforcing their value helps build resilience and self-acceptance."
            },
            {
              id: 'neutral',
              text: "Don't compare yourself to others. Just focus on your own work. Everyone has different strengths.",
              empathyChange: -3,
              outcome: "Your child understands logically but may still feel the emotional weight of comparison. The underlying insecurity isn't fully addressed.",
              explanation: "Logical advice doesn't always address emotional needs. Children need their feelings acknowledged before they can internalize the logic."
            },
            {
              id: 'dismissive',
              text: "Well, maybe if you paid attention in class like the other kids, you wouldn't have this problem! Stop making excuses!",
              empathyChange: -25,
              outcome: "Your child feels shamed and criticized. Their confidence decreases further, and they may develop anxiety about school and their abilities.",
              explanation: "Shame and comparison damage self-esteem. This response increases the emotional burden rather than helping them cope."
            }
          ]
        }
      ],
      correctChoices: ['empathetic', 'empathetic', 'empathetic'],
      whyItMatters: "Homework battles are common and exhausting, especially after a long day. But maintaining empathy during these struggles teaches your child that learning challenges are normal and that they're supported regardless of how easy or hard things are for them."
    },
    {
      id: 4,
      title: "Sibling Conflict Escalation",
      context: "Your two children are fighting again, and you're trying to get dinner ready. The noise is overwhelming, and you just want five minutes of peace. The conflict keeps escalating.",
      steps: [
        {
          step: 0,
          story: "Your children are arguing loudly over a toy. Both are claiming the other took it first. The argument is getting louder and more heated. You're trying to focus on cooking.",
          question: "How do you respond?",
          options: [
            {
              id: 'empathetic',
              text: "I can see you're both really upset and both want this toy. Let me pause what I'm doing so we can figure this out together. What's happening?",
              empathyChange: +12,
              outcome: "Both children feel heard. They calm down slightly because they know you're listening. The conflict becomes more manageable.",
              explanation: "Taking a moment to pause and listen shows both children that their feelings matter, even when you're busy."
            },
            {
              id: 'neutral',
              text: "I need you both to stop fighting. Share the toy or take turns. I can't deal with this right now, I'm making dinner.",
              empathyChange: -5,
              outcome: "The children may stop temporarily, but the underlying conflict isn't resolved. They may fight again once you're not watching.",
              explanation: "This response stops the immediate conflict but doesn't address the emotions driving it, so it may resurface."
            },
            {
              id: 'dismissive',
              text: "I'm done with this! Both of you, go to your rooms RIGHT NOW! I can't listen to this fighting anymore!",
              empathyChange: -20,
              outcome: "Both children feel punished and misunderstood. The conflict may pause, but resentment builds, and they may fight more later.",
              explanation: "Reacting with frustration and punishment when overwhelmed is understandable but doesn't teach conflict resolution or address the root cause."
            }
          ]
        },
        {
          step: 1,
          story: "One child starts crying and says the other hit them. The other child denies it and says they were just trying to get the toy back. You didn't see what happened.",
          question: "How do you respond?",
          options: [
            {
              id: 'empathetic',
              text: "I can see someone got hurt, and that's serious. I can also see you're both upset and telling different stories. Let's talk about what happened and how we can solve this without anyone getting hurt.",
              empathyChange: +15,
              outcome: "Both children feel heard. You help them process what happened and find a solution. They learn conflict resolution skills.",
              explanation: "Addressing the hurt while maintaining empathy for both children helps them feel safe and teaches problem-solving."
            },
            {
              id: 'neutral',
              text: "No hitting. Both of you need to apologize. If this happens again, there will be consequences. Now go play somewhere else.",
              empathyChange: -8,
              outcome: "The immediate conflict stops, but the underlying issue isn't addressed. The children may continue to struggle with conflict resolution.",
              explanation: "Setting boundaries is important, but helping children process what happened and learn better ways to handle conflict is also valuable."
            },
            {
              id: 'dismissive',
              text: "I don't know who did what and I don't care! Both of you are in trouble! No TV for the rest of the week! Figure out how to get along!",
              empathyChange: -30,
              outcome: "Both children feel punished unfairly. They may blame each other more, and the sibling relationship suffers. Trust in you decreases.",
              explanation: "Punishing both without understanding the situation teaches children that fairness doesn't matter and that conflict leads to punishment rather than resolution."
            }
          ]
        },
        {
          step: 2,
          story: "The conflict seems resolved, but 10 minutes later they're fighting again about something else. You're getting really frustrated and feeling like nothing you do helps.",
          question: "How do you respond?",
          options: [
            {
              id: 'empathetic',
              text: "I'm feeling really frustrated because you're fighting again, and I'm wondering what's really going on. Are you both just having a tough day? Sometimes when we're tired or stressed, little things feel bigger. Let's talk about it.",
              empathyChange: +10,
              outcome: "Your children feel understood. They may open up about what's really bothering them. The conflicts decrease when underlying needs are met.",
              explanation: "Choosing empathy when you're frustrated is difficult but often reveals the real issues driving the conflicts."
            },
            {
              id: 'neutral',
              text: "You need to stop fighting. If you can't get along, you need to play in separate rooms until you can figure it out.",
              empathyChange: -5,
              outcome: "The children separate, but the underlying tension remains. They may find other ways to conflict or feel isolated.",
              explanation: "Separation can be necessary but doesn't address why the conflicts keep happening."
            },
            {
              id: 'dismissive',
              text: "That's it! I'm done! You're both being impossible! Go to your rooms and don't come out until I say so! I can't deal with you right now!",
              empathyChange: -35,
              outcome: "Your children feel rejected and abandoned. They may become more anxious or act out more. The family dynamic becomes more stressful.",
              explanation: "Rejecting children when you're overwhelmed is understandable but teaches them that your love and presence are conditional on their behavior."
            }
          ]
        }
      ],
      correctChoices: ['empathetic', 'empathetic', 'empathetic'],
      whyItMatters: "Sibling conflicts are exhausting, especially when they happen repeatedly. But maintaining empathy helps you understand what's really driving the conflicts and teaches your children how to resolve disagreements with understanding rather than power."
    },
    {
      id: 5,
      title: "Morning Rush Chaos",
      context: "It's Monday morning, everyone is running late, and you're trying to get everyone out the door. Your child is moving slowly and seems to be in their own world. You're stressed about being late for work.",
      steps: [
        {
          step: 0,
          story: "Your child is taking forever to get dressed and seems distracted. You've asked them three times to hurry up, but they're still not ready. You're going to be late.",
          question: "How do you respond?",
          options: [
            {
              id: 'empathetic',
              text: "I can see you're having trouble focusing this morning. Mornings can be hard, especially on Mondays. Let me help you finish getting ready so we're not late. What do you need help with?",
              empathyChange: +12,
              outcome: "Your child feels supported and actually moves faster with your help. The morning becomes more cooperative and less stressful.",
              explanation: "Offering help instead of just pressure addresses their actual need and creates cooperation rather than resistance."
            },
            {
              id: 'neutral',
              text: "You need to hurry up. We're running late. Please focus and get ready. We need to leave in 5 minutes.",
              empathyChange: -3,
              outcome: "Your child may speed up slightly, but the stress increases for everyone. The morning remains rushed and tense.",
              explanation: "This response communicates urgency but doesn't address why they're having trouble focusing or offer support."
            },
            {
              id: 'dismissive',
              text: "I'm so sick of this every morning! You're always slow! Just get dressed NOW or we're leaving without you! I don't have time for this!",
              empathyChange: -20,
              outcome: "Your child feels shamed and rushed. They may become anxious or move even slower due to stress. The morning becomes more difficult.",
              explanation: "Reacting with frustration and threats increases stress, which often makes children move slower, not faster."
            }
          ]
        },
        {
          step: 1,
          story: "While you're helping them, they spill their breakfast on their clean clothes. Now they need to change again, and you're even more behind schedule.",
          question: "How do you respond?",
          options: [
            {
              id: 'empathetic',
              text: "Oh no, that was an accident! Accidents happen, especially when we're rushing. Let's quickly change your shirt. We can still make it, we just need to work together.",
              empathyChange: +10,
              outcome: "Your child feels less guilty and stressed. You work together quickly, and while you're a bit late, the morning ends on a positive note.",
              explanation: "Maintaining empathy when accidents happen during stressful times models resilience and keeps the situation manageable."
            },
            {
              id: 'neutral',
              text: "Okay, accidents happen. Let's change your shirt quickly. We really need to hurry now.",
              empathyChange: -5,
              outcome: "The situation is handled, but the stress increases. The morning feels rushed and tense.",
              explanation: "This response is practical but doesn't fully address the emotional stress of the situation."
            },
            {
              id: 'dismissive',
              text: "Perfect! Just what we needed! Can't you be more careful? Now we're definitely going to be late! This is so frustrating!",
              empathyChange: -25,
              outcome: "Your child feels guilty and stressed. The anxiety makes everything take longer. You're both upset, and the morning becomes miserable.",
              explanation: "Reacting with frustration to accidents increases everyone's stress and often makes the situation worse."
            }
          ]
        },
        {
          step: 2,
          story: "You finally get everyone in the car, but you're definitely going to be late for work now. Your child can tell you're stressed and asks if you're mad at them.",
          question: "How do you respond?",
          options: [
            {
              id: 'empathetic',
              text: "I'm not mad at you, sweetie. I'm just stressed about being late for work. That's my stress, not your fault. We had a rough morning, but we made it through together. I love you.",
              empathyChange: +15,
              outcome: "Your child feels reassured and loved. They learn that your stress isn't about them. The morning ends with connection despite the chaos.",
              explanation: "Separating your stress from your child and reassuring them of your love protects their self-worth and maintains connection even when things are hard."
            },
            {
              id: 'neutral',
              text: "I'm not mad. We're just running late, that's all. Don't worry about it.",
              empathyChange: +2,
              outcome: "Your child feels slightly reassured but may still sense tension. The emotional repair is incomplete.",
              explanation: "This response reassures but doesn't fully address the emotional impact of the stressful morning."
            },
            {
              id: 'dismissive',
              text: "I'm stressed because we're late, and yes, I'm frustrated! Mornings shouldn't be this hard! But it's fine, we'll deal with it.",
              empathyChange: -15,
              outcome: "Your child feels like they're the problem. They may develop anxiety about mornings or feel responsible for your stress.",
              explanation: "Not separating your stress from your child can make them feel like they're the cause of your frustration, which is damaging to their self-worth."
            }
          ]
        }
      ],
      correctChoices: ['empathetic', 'empathetic', 'empathetic'],
      whyItMatters: "Morning rushes are inherently stressful, and it's easy to react from that stress. But maintaining empathy teaches your child that stress is manageable and that they're loved even when life is chaotic. It also models how to handle pressure with grace."
    }
  ];

  const handleChoice = (choiceId, empathyChange) => {
    if (selectedChoices[`${currentScenario}-${currentStep}`]) return; // Already answered

    const isCorrect = choiceId === scenarios[currentScenario].correctChoices[currentStep];
    const selected = {
      scenario: currentScenario,
      step: currentStep,
      choice: choiceId,
      isCorrect: isCorrect,
      empathyChange: empathyChange
    };

    setSelectedChoices(prev => ({
      ...prev,
      [`${currentScenario}-${currentStep}`]: selected
    }));

    // Update empathy level (clamp between 0 and 100)
    setEmpathyLevel(prev => Math.max(0, Math.min(100, prev + empathyChange)));

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Show outcome for a moment, then move to next step or scenario
    setShowOutcome(true);
    
    setTimeout(() => {
      setShowOutcome(false);
      const currentScenarioData = scenarios[currentScenario];
      
      if (currentStep < currentScenarioData.steps.length - 1) {
        // Move to next step in same scenario
        setCurrentStep(prev => prev + 1);
      } else {
        // Move to next scenario
        if (currentScenario < totalLevels - 1) {
          setCurrentScenario(prev => prev + 1);
          setCurrentStep(0);
          // Reset empathy to neutral for new scenario
          setEmpathyLevel(50);
        } else {
          // Game complete
          setShowGameOver(true);
        }
      }
    }, 3000);
  };

  const handleRestart = () => {
    setCurrentScenario(0);
    setCurrentStep(0);
    setSelectedChoices({});
    setEmpathyLevel(50);
    setShowOutcome(false);
    setScore(0);
    setShowGameOver(false);
  };

  const currentScenarioData = scenarios[currentScenario];
  const currentStepData = currentScenarioData.steps[currentStep];
  const selected = selectedChoices[`${currentScenario}-${currentStep}`];
  const progress = ((currentScenario + 1) / totalLevels) * 100;

  // Empathy bar component
  const EmpathyBar = () => {
    const getColor = () => {
      if (empathyLevel >= 70) return 'from-green-500 to-emerald-600';
      if (empathyLevel >= 40) return 'from-yellow-500 to-orange-500';
      return 'from-red-500 to-rose-600';
    };

    const getLabel = () => {
      if (empathyLevel >= 70) return 'High Empathy';
      if (empathyLevel >= 40) return 'Moderate Empathy';
      return 'Low Empathy';
    };

    return (
      <div className="w-full bg-white rounded-xl p-4 shadow-lg border-2 border-indigo-200 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Empathy Level</span>
          <span className={`text-sm font-bold ${
            empathyLevel >= 70 ? 'text-green-600' :
            empathyLevel >= 40 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {empathyLevel}% - {getLabel()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
          <motion.div
            initial={{ width: `${empathyLevel}%` }}
            animate={{ width: `${empathyLevel}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${getColor()} rounded-full`}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low</span>
          <span>Moderate</span>
          <span>High</span>
        </div>
      </div>
    );
  };

  // Game content
  const gameContent = (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <motion.div
        key={`${currentScenario}-${currentStep}`}
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

        {/* Empathy bar */}
        <EmpathyBar />

        {!showOutcome ? (
          <>
            {/* Story context */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 mb-8 shadow-xl border-2 border-indigo-200">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {currentScenarioData.title}
                </h2>
                <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
                  <p className="text-lg text-gray-700 leading-relaxed mb-3">
                    {currentScenarioData.context}
                  </p>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-base text-indigo-700 font-medium italic">
                      {currentStepData.story}
                    </p>
                  </div>
                </div>
              </div>

              {/* Question */}
              <div className="text-center">
                <p className="text-xl font-semibold text-gray-800 mb-2">
                  {currentStepData.question}
                </p>
                <p className="text-sm text-gray-600">
                  Your choice will affect your empathy level
                </p>
              </div>
            </div>

            {/* Response options */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              {currentStepData.options.map((option, index) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleChoice(option.id, option.empathyChange)}
                  disabled={!!selected}
                  className={`
                    relative p-6 rounded-2xl border-2 transition-all text-left
                    ${selected
                      ? selected.choice === option.id
                        ? option.id === 'empathetic'
                          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-lg'
                          : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-400 shadow-lg'
                        : 'bg-gray-50 border-gray-300 opacity-50'
                      : option.id === 'empathetic'
                        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 hover:shadow-xl cursor-pointer'
                        : 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300 hover:shadow-xl cursor-pointer'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">
                      {option.id === 'empathetic' ? '💙' : option.id === 'neutral' ? '😐' : '😠'}
                    </div>
                    <div className="flex-1">
                      <p className="text-base text-gray-700 leading-relaxed italic">
                        "{option.text}"
                      </p>
                      {!selected && (
                        <div className="text-xs text-gray-500 mt-2 font-medium">
                          {option.empathyChange > 0 ? `+${option.empathyChange}% empathy` : 
                           option.empathyChange < 0 ? `${option.empathyChange}% empathy` : 
                           'No change'}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
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
              {selected && (() => {
                const selectedOption = currentStepData.options.find(opt => opt.id === selected.choice);
                return (
                  <div className={`bg-gradient-to-br ${
                    selected.isCorrect
                      ? 'from-green-50 to-emerald-50 border-green-300'
                      : 'from-orange-50 to-red-50 border-orange-300'
                  } rounded-2xl p-8 shadow-xl border-2`}>
                    <div className="text-center mb-6">
                      <div className="text-6xl mb-4">
                        {selected.isCorrect ? '💙' : '💡'}
                      </div>
                      <h3 className={`text-2xl font-bold mb-2 ${
                        selected.isCorrect ? 'text-green-700' : 'text-orange-700'
                      }`}>
                        {selected.isCorrect 
                          ? 'Empathetic Response!'
                          : selectedOption.id === 'neutral'
                            ? 'Neutral Response'
                            : 'Stressful Response'}
                      </h3>
                    </div>

                    <div className="bg-white/80 rounded-xl p-6 shadow-lg mb-4">
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">Outcome:</h4>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {selectedOption.outcome}
                      </p>
                      <div className={`rounded-lg p-4 ${
                        selected.isCorrect ? 'bg-green-50' : 'bg-orange-50'
                      }`}>
                        <p className={`text-sm font-medium ${
                          selected.isCorrect ? 'text-green-800' : 'text-orange-800'
                        }`}>
                          {selectedOption.explanation}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/80 rounded-xl p-4 shadow-lg text-center">
                      <p className="text-sm text-gray-600 mb-1">Empathy Level Changed</p>
                      <p className={`text-2xl font-bold ${
                        selectedOption.empathyChange > 0 ? 'text-green-600' :
                        selectedOption.empathyChange < 0 ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {selectedOption.empathyChange > 0 ? '+' : ''}{selectedOption.empathyChange}%
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Show parent tip on last step of scenario */}
              {currentStep === currentScenarioData.steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  delay={0.3}
                  className="bg-amber-50 border border-amber-200 rounded-xl p-6"
                >
                  <p className="text-sm text-amber-800 leading-relaxed">
                    <strong>💡 Parent Tip:</strong> {currentScenarioData.whyItMatters}
                  </p>
                </motion.div>
              )}

              <div className="text-center">
                <p className="text-gray-600 animate-pulse">Moving to next step...</p>
              </div>
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

export default ActiveEmpathyRoleplay;

