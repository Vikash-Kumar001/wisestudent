import { Wallet } from "lucide-react";
import buildIds from "../buildGameIds";

export const financegGameIdsYoungAdult = buildIds("finance", "young-adult");

export const getFinanceYoungAdultGames = (gameCompletionStatus) => {
  const financeYoungAdultGames = [
    {
      id: "finance-young-adult-1",
      title: "First Income Reality",
      description:
        "You receive your first stipend or salary—what does this income represent for you?",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-1"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/first-income-reality",
      index: 0,
      scenario: {
        setup:
          "You receive your first stipend or salary. It feels exciting, but you also wonder what this income truly means.",
        choices: [
          {
            label: "Free money to spend however you like",
            outcome:
              "Spending it without a plan gives a momentary high, but you soon run out of fuel for your responsibilities.",
          },
          {
            label: "A responsibility to manage wisely",
            outcome:
              "This income opens the door to freedom, provided you plan for needs, savings, and growth.",
          },
        ],
        reflections: [
          "How can you balance freedom and responsibility when money arrives for the first time?",
          "Which immediate priorities should you handle before splurging?",
        ],
        skill: "Responsible income mindset",
      },
    },
    {
      id: "finance-young-adult-2",
      title: "Salary Is Not Pocket Money",
      description:
        "How should first income be treated? Learn the difference between earned money and casual spending.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-2"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/salary-is-not-pocket-money",
      index: 1,
      scenario: {
        setup:
          "You've earned your first income through work. The key question is: how should you treat this differently from pocket money?",
        choices: [
          {
            label: "Like pocket money",
            outcome:
              "Treating earned income like pocket money leads to fast depletion and poor financial habits.",
          },
          {
            label: "Like earned money with limits",
            outcome:
              "Recognizing income as earned through effort helps establish responsible spending boundaries.",
          },
        ],
        reflections: [
          "How can you maintain the distinction between earned income and casual spending?",
          "What systems can you put in place to prevent salary from becoming pocket money?",
        ],
        skill: "Earned income mindset",
      },
    },
    {
      id: "finance-young-adult-3",
      title: "Lifestyle Upgrade Temptation",
      description:
        "After first income, what is the safest approach to lifestyle improvements? Learn to balance rewards with responsibility.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-3"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/lifestyle-upgrade-temptation",
      index: 2,
      scenario: {
        setup:
          "You've received your first income and feel tempted to upgrade your lifestyle. The challenge is finding the balance between enjoying your earnings and maintaining financial stability.",
        choices: [
          {
            label: "Upgrade lifestyle immediately",
            outcome:
              "Sudden lifestyle upgrades can create financial stress and unrealistic expectations for future income.",
          },
          {
            label: "Increase spending slowly and carefully",
            outcome:
              "Gradual improvements ensure financial stability while still allowing you to enjoy your increased earning power.",
          },
        ],
        reflections: [
          "How can you enjoy lifestyle improvements while maintaining financial stability?",
          "What criteria should guide your spending decisions with increased income?",
        ],
        skill: "Balanced lifestyle progression",
      },
    },
    {
      id: "finance-young-adult-4",
      title: "First Month Spending Plan",
      description:
        "What should you do before spending your income? Learn essential planning strategies for your financial success.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-4"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/first-month-spending-plan",
      index: 3,
      scenario: {
        setup:
          "You're about to receive your first income and need to decide how to approach your spending. The key is establishing good habits from day one.",
        choices: [
          {
            label: "Spend first, plan later",
            outcome:
              "Planning prevents regret and ensures your income covers necessities while building financial security.",
          },
          {
            label: "List expenses and savings first",
            outcome:
              "Strategic planning before spending creates a foundation for long-term financial success and peace of mind.",
          },
        ],
        reflections: [
          "How can planning prevent financial regrets in your first month?",
          "What balance between saving and spending feels sustainable for you?",
        ],
        skill: "Strategic financial planning",
      },
    },
    {
      id: "finance-young-adult-5",
      title: "Income vs Fixed Commitments",
      description:
        "Which expense should be prioritised? Learn to distinguish between essential commitments and lifestyle choices.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-5"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/income-vs-fixed-commitments",
      index: 4,
      scenario: {
        setup:
          "You have limited income and must choose between fixed commitments and lifestyle expenses. The key is understanding which expenses are non-negotiable.",
        choices: [
          {
            label: "Subscriptions and entertainment",
            outcome:
              "Fixed needs like rent, food, and transportation come before lifestyle choices to maintain financial stability.",
          },
          {
            label: "Rent, travel, food, essentials",
            outcome:
              "Prioritizing fixed commitments ensures your basic needs are met and prevents serious financial consequences.",
          },
        ],
        reflections: [
          "How can you ensure fixed commitments are always covered?",
          "What's the relationship between financial stability and lifestyle choices?",
        ],
        skill: "Priority-based budgeting",
      },
    },
    {
      id: "finance-young-adult-6",
      title: "Saving from First Income",
      description:
        "Is saving from first income important? Learn why early saving builds long-term financial discipline and opportunities.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-6"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/saving-from-first-income",
      index: 5,
      scenario: {
        setup:
          "You've received your first income and must decide whether to start saving immediately or wait for better circumstances. The choice shapes your financial future.",
        choices: [
          {
            label: "No, savings can wait",
            outcome:
              "Early saving builds long-term discipline and takes advantage of compound interest to create substantial wealth over time.",
          },
          {
            label: "Yes, habits start early",
            outcome:
              "Starting to save from your first income establishes lifelong financial discipline and maximizes the power of compound growth.",
          },
        ],
        reflections: [
          "How can early saving create opportunities you can't imagine today?",
          "What small saving habit could you start immediately with your next income?",
        ],
        skill: "Early saving discipline",
      },
    },
    {
      id: "finance-young-adult-7",
      title: "Peer Comparison Trap",
      description:
        "Friends spend more than you. Learn to make financial decisions based on your goals rather than social pressure.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-7"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/peer-comparison-trap",
      index: 6,
      scenario: {
        setup:
          "Your friends seem to spend more freely than you do. The challenge is distinguishing between genuine needs and social pressure to match their lifestyle.",
        choices: [
          {
            label: "Their lifestyle",
            outcome:
              "Comparing lifestyles causes overspending and financial stress when you try to match others' spending patterns.",
          },
          {
            label: "Your income and goals",
            outcome:
              "Making decisions based on your personal financial situation and long-term goals creates sustainable wealth and authentic relationships.",
          },
        ],
        reflections: [
          "How can you maintain friendships while staying true to your financial values?",
          "What personal goals are worth prioritizing over social spending pressure?",
        ],
        skill: "Social financial independence",
      },
    },
    {
      id: "finance-young-adult-8",
      title: "First Income Mistake",
      description:
        "You overspent this month. What's the best response? Learn how to turn financial mistakes into growth opportunities.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-8"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/first-income-mistake",
      index: 7,
      scenario: {
        setup:
          "You've realized you overspent this month and need to decide how to respond. The key is learning from mistakes without letting them define your financial future.",
        choices: [
          {
            label: "Ignore it",
            outcome:
              "Learning early prevents repeated mistakes and builds the financial wisdom needed for long-term success.",
          },
          {
            label: "Review and adjust next month",
            outcome:
              "Acknowledging mistakes and making adjustments creates opportunities for growth and prevents future financial setbacks.",
          },
        ],
        reflections: [
          "How can financial mistakes become stepping stones to better money management?",
          "What systems can you put in place to learn from errors without repeating them?",
        ],
        skill: "Financial mistake recovery",
      },
    },
    {
      id: "finance-young-adult-9",
      title: "Income Growth vs Discipline",
      description:
        "What matters more early on? Learn how discipline protects your income at all levels.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-9"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/income-growth-vs-discipline",
      index: 8,
      scenario: {
        setup:
          "You're considering whether to focus on growing your income or developing financial discipline. The key is understanding how these two factors work together for long-term success.",
        choices: [
          {
            label: "Income growth alone",
            outcome:
              "Discipline protects income at all levels and is essential for building lasting financial security.",
          },
          {
            label: "Discipline + income growth",
            outcome:
              "Combining discipline with income growth creates the strongest foundation for long-term financial success.",
          },
        ],
        reflections: [
          "How can you maintain discipline while pursuing income growth?",
          "What balance between spending and saving feels sustainable for your situation?",
        ],
        skill: "Income discipline balance",
      },
    },
    {
      id: "finance-young-adult-10",
      title: "Independence Checkpoint",
      description:
        "Make 7 responsible decisions about first income. Are you ready to manage money independently?",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Hard",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-10"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/independence-checkpoint",
      isBadgeGame: true,
      badgeName: "Badge: Financially Independent Starter",
      badgeImage: "/badges/finance/young-adult/FinanciallyIndependentStarter.png",
      index: 9,
      scenario: {
        setup:
          "You've reached a milestone in your financial journey. Now you need to demonstrate 7 key principles of independent money management to prove you're ready to handle finances on your own.",
        choices: [
          {
            label: "Make responsible financial decisions",
            outcome:
              "You are now ready to manage money independently.",
          },
          {
            label: "Continue learning with guidance",
            outcome:
              "Building financial independence requires mastering key decision-making principles.",
          },
        ],
        reflections: [
          "How can you maintain financial independence while building meaningful relationships?",
          "What systems can you create to ensure consistent financial responsibility?",
        ],
        skill: "Independent money management",
      },
    },
    {
      id: "finance-young-adult-11",
      title: "Wants Disguised as Needs",
      description:
        "Which is a want, not a need? Learn to identify wants that often look urgent but can wait.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-11"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/wants-disguised-as-needs",
      index: 10,
      scenario: {
        setup:
          "Distinguishing between wants and needs can be challenging, especially when wants are disguised as needs. This game helps you identify the difference and make better financial decisions.",
        choices: [
          {
            label: "Daily meals",
            outcome:
              "Wants often look urgent but can wait.",
          },
          {
            label: "Upgrading phone every year",
            outcome:
              "Understanding the difference between wants and needs helps you make more thoughtful spending decisions.",
          },
        ],
        reflections: [
          "How can you identify when a want is disguised as a need?",
          "What strategies help you prioritize needs over wants in your budget?",
        ],
        skill: "Wants vs needs recognition",
      },
    },
    {
      id: "finance-young-adult-12",
      title: "Subscription Trap",
      description:
        "You have multiple subscriptions you barely use. Learn to identify and cancel unused ones.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-12"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/subscription-trap",
      index: 11,
      scenario: {
        setup:
          "Managing subscriptions can be tricky, especially when they seem cheap individually but add up over time. This game helps you identify the trap of accumulating unused subscriptions that silently drain your money.",
        choices: [
          {
            label: "Keep them all",
            outcome:
              "Small monthly costs silently drain money.",
          },
          {
            label: "Cancel unused ones",
            outcome:
              "Understanding the subscription trap helps you retain more of your hard-earned money.",
          },
        ],
        reflections: [
          "How can you identify subscriptions you're not using regularly?",
          "What systems can you implement to prevent accumulating unused subscriptions?",
        ],
        skill: "Subscription management",
      },
    },
    {
      id: "finance-young-adult-13",
      title: "Weekend Spending Reality",
      description:
        "Frequent weekend outings lead to budget imbalance over time. Learn how repeated small spends add up.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-13"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/weekend-spending-reality",
      index: 12,
      scenario: {
        setup:
          "Weekend activities can be enjoyable but may impact your finances more than expected. This game explores how frequent small weekend expenses accumulate over time.",
        choices: [
          {
            label: "No impact",
            outcome:
              "Repeated small spends add up.",
          },
          {
            label: "Budget imbalance over time",
            outcome:
              "Understanding weekend spending patterns helps maintain financial balance.",
          },
        ],
        reflections: [
          "How can you enjoy weekends while maintaining financial balance?",
          "What strategies help you plan weekend activities within your budget?",
        ],
        skill: "Weekend spending awareness",
      },
    },
    {
      id: "finance-young-adult-14",
      title: "Brand vs Budget",
      description:
        "Learn which choice is financially wiser between buying brands to impress versus buying within budget and need.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-14"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/brand-vs-budget",
      index: 13,
      scenario: {
        setup:
          "Managing the pressure between brand appeal and budget consciousness is a common financial challenge. This game explores how to make wise purchasing decisions.",
        choices: [
          {
            label: "Buying brands to impress",
            outcome:
              "Brand pressure causes unnecessary expense.",
          },
          {
            label: "Buying within budget and need",
            outcome:
              "Understanding the value of budget-conscious purchases helps maintain financial health.",
          },
        ],
        reflections: [
          "How can you resist brand pressure while making smart purchases?",
          "What strategies help you evaluate value vs. brand appeal?",
        ],
        skill: "Brand vs budget awareness",
      },
    },
    {
      id: "finance-young-adult-15",
      title: "Sale Psychology",
      description:
        "Learn to navigate sales and discounts wisely by focusing on actual needs rather than the attraction of a deal.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-15"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/sale-psychology",
      index: 14,
      scenario: {
        setup:
          "Sales and discounts can create psychological pressure to buy items we didn't plan for. This game explores how to make wise decisions when faced with attractive deals.",
        choices: [
          {
            label: "Is it cheap?",
            outcome:
              "Discounts don't justify unnecessary purchases.",
          },
          {
            label: "Do I actually need it?",
            outcome:
              "Understanding the importance of need vs. want helps make better purchasing decisions.",
          },
        ],
        reflections: [
          "How can you resist the psychological pull of sales and discounts?",
          "What strategies help you distinguish between genuine needs and tempting deals?",
        ],
        skill: "Sale psychology awareness",
      },
    },
    {
      id: "finance-young-adult-16",
      title: "Lifestyle Inflation",
      description:
        "Learn how to handle income increases wisely by prioritizing savings over spending to avoid lifestyle inflation.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-16"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/lifestyle-inflation",
      index: 15,
      scenario: {
        setup:
          "As income increases, many people fall into the trap of increasing their spending proportionally. This game explores how to handle income growth wisely.",
        choices: [
          {
            label: "Spending immediately",
            outcome:
              "Lifestyle inflation traps young earners.",
          },
          {
            label: "Savings and goals first",
            outcome:
              "Prioritizing savings when income increases helps build long-term financial security.",
          },
        ],
        reflections: [
          "How can you enjoy income increases while preventing lifestyle inflation?",
          "What systems can you put in place to automatically save a portion of income increases?",
        ],
        skill: "Lifestyle inflation awareness",
      },
    },
    {
      id: "finance-young-adult-17",
      title: "Borrowing to Spend",
      description:
        "Learn about the risks of borrowing for lifestyle spending and how it affects your financial independence.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-17"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/borrowing-to-spend",
      index: 16,
      scenario: {
        setup:
          "Borrowing for lifestyle spending is a common temptation that can have long-term consequences. This game explores the impact of lifestyle debt.",
        choices: [
          {
            label: "Yes",
            outcome:
              "Lifestyle loans delay financial independence.",
          },
          {
            label: "No, it creates long-term stress",
            outcome:
              "Understanding the risks of borrowing for lifestyle spending helps maintain financial health.",
          },
        ],
        reflections: [
          "How can you enjoy lifestyle improvements while maintaining financial health?",
          "What strategies help you avoid borrowing for lifestyle spending?",
        ],
        skill: "Debt-free spending awareness",
      },
    },
    {
      id: "finance-young-adult-18",
      title: "Peer Pressure Purchase",
      description:
        "Learn how to handle peer pressure when friends encourage spending beyond your comfort zone.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-18"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/peer-pressure-purchase",
      index: 17,
      scenario: {
        setup:
          "Handling peer pressure in spending situations is a critical financial skill. This game explores how to maintain financial control while preserving friendships.",
        choices: [
          {
            label: "Follow them",
            outcome:
              "Financial confidence includes saying no.",
          },
          {
            label: "Stick to your limits",
            outcome:
              "Maintaining your financial boundaries helps preserve both your finances and self-respect.",
          },
        ],
        reflections: [
          "How can you maintain friendships while staying within your financial limits?",
          "What strategies help you confidently say no to spending that doesn't align with your goals?",
        ],
        skill: "Peer pressure resistance",
      },
    },
    {
      id: "finance-young-adult-19",
      title: "Tracking Lifestyle Costs",
      description:
        "Learn why tracking lifestyle expenses is important to avoid overspending unknowingly.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-19"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/tracking-lifestyle-costs",
      index: 18,
      scenario: {
        setup:
          "Tracking lifestyle expenses is crucial for maintaining financial awareness. This game explores the importance of monitoring spending patterns.",
        choices: [
          {
            label: "To restrict fun",
            outcome:
              "Awareness prevents regret.",
          },
          {
            label: "To avoid overspending unknowingly",
            outcome:
              "Understanding your spending patterns helps maintain financial control.",
          },
        ],
        reflections: [
          "How can tracking expenses help you maintain your desired lifestyle while staying within budget?",
          "What tools or methods work best for consistently tracking lifestyle expenses?",
        ],
        skill: "Expense tracking awareness",
      },
    },
    {
      id: "finance-young-adult-20",
      title: "Smart Spending Checkpoint",
      description:
        "Make 7 smart spending decisions to master the art of enjoying life without harming your finances.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Hard",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-20"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/smart-spending-checkpoint",
      isBadgeGame: true,
      badgeName: "Badge: Smart Spender",
      badgeImage: "/badges/finance/young-adult/SmartSpender.png",
      index: 19,
      scenario: {
        setup:
          "This checkpoint challenges you to make 7 smart spending decisions that demonstrate your financial wisdom and discipline.",
        choices: [
          {
            label: "Make responsible spending choices",
            outcome:
              "You can now enjoy life without harming your finances.",
          },
          {
            label: "Continue learning about financial discipline",
            outcome:
              "Mastering smart spending habits is key to financial freedom.",
          },
        ],
        reflections: [
          "How can you maintain financial discipline while still enjoying life experiences?",
          "What strategies help you make smart spending decisions consistently?",
        ],
        skill: "Smart spending mastery",
      },
    },
    {
      id: "finance-young-adult-21",
      title: "Why Budgeting Matters",
      description:
        "Learn how budgeting helps you control money instead of guessing where it goes.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-21"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/why-budgeting-matters",
      index: 20,
      scenario: {
        setup:
          "Understanding the importance of budgeting is crucial for financial success. This game explores how budgets provide financial control and freedom.",
        choices: [
          {
            label: "Restrict all spending",
            outcome:
              "Budgets give freedom with limits.",
          },
          {
            label: "Control money instead of guessing",
            outcome:
              "Budgeting helps you make intentional financial decisions.",
          },
        ],
        reflections: [
          "How can budgeting help you achieve your financial goals while still allowing for flexibility?",
          "What strategies help maintain a budget that adapts to changing needs?",
        ],
        skill: "Budgeting fundamentals",
      },
    },
    {
      id: "finance-young-adult-22",
      title: "Fixed vs Variable Expenses",
      description:
        "Learn to distinguish between fixed expenses that must be planned first and variable expenses that can be adjusted.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-22"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/fixed-vs-variable-expenses",
      index: 21,
      scenario: {
        setup:
          "Understanding the difference between fixed and variable expenses is crucial for effective budgeting. This game explores how to prioritize different types of expenses.",
        choices: [
          {
            label: "Rent/hostel fee",
            outcome:
              "Fixed expenses must be planned first.",
          },
          {
            label: "Eating out",
            outcome:
              "Variable expenses can be adjusted based on your budget and priorities.",
          },
        ],
        reflections: [
          "How can you ensure fixed expenses are always covered in your budget?",
          "What strategies help manage variable expenses within your financial limits?",
        ],
        skill: "Expense categorization",
      },
    },
    {
      id: "finance-young-adult-23",
      title: "Monthly Budget Order",
      description:
        "Learn the correct order for budgeting: essentials and savings first, then wants.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-23"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/monthly-budget-order",
      index: 22,
      scenario: {
        setup:
          "Proper budget order is crucial for financial stability. This game explores the importance of prioritizing expenses in the right sequence.",
        choices: [
          {
            label: "Entertainment",
            outcome:
              "Priorities protect stability.",
          },
          {
            label: "Essentials and savings",
            outcome:
              "Prioritizing essentials and savings creates a strong financial foundation.",
          },
        ],
        reflections: [
          "How can you ensure essentials and savings are always prioritized in your budget?",
          "What strategies help maintain proper budget order even when facing financial pressures?",
        ],
        skill: "Budget prioritization",
      },
    },
    {
      id: "finance-young-adult-24",
      title: "Ignoring Small Expenses",
      description:
        "Understand how small daily expenses accumulate and impact your overall budget.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-24"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/ignoring-small-expenses",
      index: 23,
      scenario: {
        setup:
          "Small daily expenses may seem insignificant, but they accumulate quickly over time. This game explores the impact of ignoring these seemingly minor expenditures.",
        choices: [
          {
            label: "Don't matter",
            outcome:
              "Small leaks sink budgets.",
          },
          {
            label: "Add up over the month",
            outcome:
              "Small expenses accumulate significantly when tracked over time.",
          },
        ],
        reflections: [
          "How can you track small daily expenses without making budgeting overly burdensome?",
          "What strategies help maintain awareness of small expenses while still enjoying life?",
        ],
        skill: "Expense tracking awareness",
      },
    },
    {
      id: "finance-young-adult-25",
      title: "Budget vs Reality",
      description:
        "Learn how to handle budgeting setbacks and develop resilience in financial planning.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-25"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/budget-vs-reality",
      index: 24,
      scenario: {
        setup:
          "Budgeting doesn't always go according to plan, especially when starting out. This game explores how to handle budgeting setbacks and develop resilience in financial planning.",
        choices: [
          {
            label: "Quit budgeting",
            outcome:
              "Budgeting improves with practice.",
          },
          {
            label: "Adjust and try again next month",
            outcome:
              "Adjusting your approach based on experience leads to better financial habits.",
          },
        ],
        reflections: [
          "How can you build flexibility into your budget while still maintaining financial discipline?",
          "What strategies help maintain motivation when budgeting doesn't go as planned initially?",
        ],
        skill: "Resilient budgeting",
      },
    },
    {
      id: "finance-young-adult-26",
      title: "Emergency Line in Budget",
      description:
        "Why include emergency buffer? Learn how emergency funds prevent panic borrowing during unexpected situations.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-young-adult-26"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/emergency-line-in-budget",
      index: 25,
      scenario: {
        setup:
          "Unexpected expenses can derail your financial plans. This game explores why emergency buffers are essential for financial stability.",
        choices: [
          {
            label: "For fun spending",
            outcome:
              "Emergency funds are specifically for unexpected expenses, not discretionary spending.",
          },
          {
            label: "To handle surprises without debt",
            outcome:
              "Buffers prevent panic borrowing and provide peace of mind during uncertain times.",
          },
        ],
        reflections: [
          "How can emergency funds provide peace of mind in uncertain times?",
          "What balance between emergency savings and other financial goals works for your situation?",
        ],
        skill: "Emergency fund planning",
      },
    },
    {
      id: "finance-young-adult-27",
      title: "Cash vs Digital Tracking",
      description:
        "Why track digital payments? Learn how digital records improve spending awareness and financial control.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-young-adult-27"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/cash-vs-digital-tracking",
      index: 26,
      scenario: {
        setup:
          "Digital payments create automatic records that can transform your financial awareness. This game explores the benefits of tracking digital transactions.",
        choices: [
          {
            label: "They disappear",
            outcome:
              "Digital payments don't disappear - they leave electronic trails that can be tracked and analyzed.",
          },
          {
            label: "They leave records",
            outcome:
              "Records improve awareness and help you make better financial decisions.",
          },
        ],
        reflections: [
          "How can digital tracking reveal spending patterns you weren't aware of?",
          "What balance between automated tracking and manual review works best for your lifestyle?",
        ],
        skill: "Digital payment tracking",
      },
    },
    {
      id: "finance-young-adult-28",
      title: "Budget Frequency",
      description:
        "How often should you review your budget? Learn why regular reviews keep budgets realistic and effective.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-young-adult-28"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/budget-frequency",
      index: 27,
      scenario: {
        setup:
          "Budget reviews are essential for keeping your financial plan aligned with reality. This game explores optimal review frequencies and methods.",
        choices: [
          {
            label: "Once a year",
            outcome:
              "Annual reviews are too infrequent to catch spending issues and adjust to life changes.",
          },
          {
            label: "Every month",
            outcome:
              "Regular review keeps budgets realistic and helps you stay on track with your financial goals.",
          },
        ],
        reflections: [
          "How can regular budget reviews help you achieve your financial goals faster?",
          "What review schedule balances effectiveness with practicality for your lifestyle?",
        ],
        skill: "Budget review discipline",
      },
    },
    {
      id: "finance-young-adult-29",
      title: "Budgeting with Irregular Income",
      description:
        "If income is irregular, what helps? Learn how conservative planning reduces stress with unpredictable earnings.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-young-adult-29"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/budgeting-with-irregular-income",
      index: 28,
      scenario: {
        setup:
          "Irregular income creates unique budgeting challenges. This game explores strategies for managing unpredictable cash flow.",
        choices: [
          {
            label: "Spend everything when earned",
            outcome:
              "Spending irregular income immediately creates financial instability and stress during lean periods.",
          },
          {
            label: "Base budget on minimum expected income",
            outcome:
              "Conservative planning reduces stress and provides stability during income fluctuations.",
          },
        ],
        reflections: [
          "How can conservative budgeting with irregular income actually increase your financial freedom?",
          "What systems can you create to automatically save portions of irregular income?",
        ],
        skill: "Irregular income management",
      },
    },
    {
      id: "finance-young-adult-30",
      title: "Budgeting Checkpoint",
      description:
        "Create and adjust a simple monthly budget correctly. Master the fundamentals of real-world financial planning.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Hard",
      duration: "8 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-young-adult-30"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/budgeting-checkpoint",
      isBadgeGame: true,
      badgeName: "Badge: Budget Ready",
      badgeImage: "/badges/finance/young-adult/BudgetReady.png",
      index: 29,
      scenario: {
        setup:
          "Budgeting is a fundamental life skill. This checkpoint tests your ability to create and manage a realistic monthly budget.",
        choices: [
          {
            label: "Create budget without income assessment",
            outcome:
              "Budgeting without knowing your income leads to unrealistic planning and financial stress.",
          },
          {
            label: "Create and adjust budget correctly",
            outcome:
              "You can now plan your money for real-life expenses.",
          },
        ],
        reflections: [
          "How can a well-planned budget actually increase your financial freedom?",
          "What budget tracking method fits naturally into your daily routine?",
        ],
        skill: "Budget creation mastery",
      },
    },
    {
      id: "finance-young-adult-31",
      title: "Education vs Lifestyle",
      description:
        "You have limited money. Which should come first? Learn why skills create long-term income while gadgets don't.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-young-adult-31"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/education-vs-lifestyle",
      index: 30,
      scenario: {
        setup:
          "Limited resources require strategic prioritization. This game explores the long-term value of educational investments versus lifestyle spending.",
        choices: [
          {
            label: "New gadgets",
            outcome:
              "Gadgets provide temporary satisfaction but depreciate quickly without increasing earning potential.",
          },
          {
            label: "Education or skill development",
            outcome:
              "Skills create long-term income; gadgets don't.",
          },
        ],
        reflections: [
          "How can investing in education today multiply your future earning potential?",
          "What balance between current lifestyle and future investment feels sustainable for you?",
        ],
        skill: "Educational investment strategy",
      },
    },
    {
      id: "finance-young-adult-32",
      title: "Travel vs Savings",
      description:
        "You want to travel but have no savings. What's wiser? Learn why experiences are better without debt hanging over them.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-young-adult-32"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/travel-vs-savings",
      index: 31,
      scenario: {
        setup:
          "Travel dreams compete with financial reality. This game explores how to pursue experiences responsibly without creating debt burdens.",
        choices: [
          {
            label: "Borrow to travel",
            outcome:
              "Borrowing for travel creates debt that diminishes the enjoyment and financial benefits of your experience.",
          },
          {
            label: "Save first, then travel",
            outcome:
              "Experiences are better without debt.",
          },
        ],
        reflections: [
          "How can saving for travel actually enhance the experience more than immediate departure?",
          "What balance between current enjoyment and future experiences feels right for your situation?",
        ],
        skill: "Travel financing wisdom",
      },
    },
    {
      id: "finance-young-adult-33",
      title: "Upgrade Pressure",
      description:
        "Friends upgrade phones often. What should guide you? Learn why upgrades should solve problems, not create them.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-young-adult-33"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/upgrade-pressure",
      index: 32,
      scenario: {
        setup:
          "Social pressure to upgrade technology constantly competes with financial responsibility. This game explores making wise purchase decisions.",
        choices: [
          {
            label: "Their upgrades",
            outcome:
              "Following others' upgrade cycles often leads to unnecessary spending and financial stress.",
          },
          {
            label: "Your actual need and budget",
            outcome:
              "Upgrades should solve problems, not create them.",
          },
        ],
        reflections: [
          "How can you maintain friendships while making financially independent upgrade decisions?",
          "What criteria make a technology upgrade genuinely worthwhile for your specific situation?",
        ],
        skill: "Purchase decision wisdom",
      },
    },
    {
      id: "finance-young-adult-34",
      title: "Convenience Spending",
      description:
        "Food delivery every day is a convenience want. Learn why convenience costs money over time and how to manage it wisely.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-young-adult-34"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/convenience-spending",
      index: 33,
      scenario: {
        setup:
          "Daily convenience services can seem harmless but accumulate significant costs over time. This game explores distinguishing wants from needs.",
        choices: [
          {
            label: "A need",
            outcome:
              "Daily food delivery is a convenience service, not a survival necessity - basic nutrition can be achieved through cooking.",
          },
          {
            label: "A convenience want",
            outcome:
              "Convenience costs money over time.",
          },
        ],
        reflections: [
          "How can you distinguish between convenience that saves valuable time versus convenience that just costs money?",
          "What convenience services actually enhance your productivity or well-being enough to justify their cost?",
        ],
        skill: "Convenience cost awareness",
      },
    },
    {
      id: "finance-young-adult-35",
      title: "Borrowing for Wants",
      description:
        "Is it okay to borrow for wants? Learn why wants should not create long-term obligations and financial stress.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-young-adult-35"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/borrowing-for-wants",
      index: 34,
      scenario: {
        setup:
          "Borrowing decisions separate financial responsibility from lifestyle pressure. This game explores when debt is and isn't appropriate.",
        choices: [
          {
            label: "Yes",
            outcome:
              "Borrowing for wants creates debt obligations that can limit future financial freedom and opportunities.",
          },
          {
            label: "No, it creates unnecessary stress",
            outcome:
              "Wants should not create long-term obligations.",
          },
        ],
        reflections: [
          "How can delayed gratification actually increase your long-term satisfaction and financial security?",
          "What systems can you create to enjoy wants responsibly without creating financial stress?",
        ],
        skill: "Responsible borrowing judgment",
      },
    },
    {
      id: "finance-young-adult-36",
      title: "Short-Term Happiness vs Stability",
      description:
        "Which choice protects your future? Learn why stability enables future freedom over temporary satisfaction.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-young-adult-36"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/short-term-happiness-vs-stability",
      index: 35,
      scenario: {
        setup:
          "Life choices often pit immediate gratification against long-term security. This game explores balancing present joy with future protection.",
        choices: [
          {
            label: "Short-term happiness",
            outcome:
              "While enjoyable temporarily, short-term happiness often creates financial stress that limits future opportunities.",
          },
          {
            label: "Financial stability",
            outcome:
              "Stability enables future freedom.",
          },
        ],
        reflections: [
          "How can financial stability actually increase your capacity for genuine happiness and meaningful experiences?",
          "What balance between current enjoyment and future security feels sustainable for your personal goals?",
        ],
        skill: "Long-term perspective",
      },
    },
    {
      id: "finance-young-adult-37",
      title: "Discount Trap",
      description:
        "A discount tempts you to buy something unnecessary. What matters? Learn why discounts don't turn wants into needs.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-young-adult-37"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/discount-trap",
      index: 36,
      scenario: {
        setup:
          "Retail psychology uses discounts to trigger emotional purchasing decisions. This game explores rational evaluation of sales offers.",
        choices: [
          {
            label: "Discount size",
            outcome:
              "Discount size is irrelevant if you don't actually need or want the item - you're still spending money unnecessarily.",
          },
          {
            label: "Actual need",
            outcome:
              "Discounts don't turn wants into needs.",
          },
        ],
        reflections: [
          "How can you develop shopping habits that prioritize genuine needs over discount-induced temptations?",
          "What evaluation process helps you distinguish between legitimate savings opportunities and manipulative marketing tactics?",
        ],
        skill: "Discount evaluation mastery",
      },
    },
    {
      id: "finance-young-adult-38",
      title: "Peer Spending Comparison",
      description:
        "Comparing spending with friends leads to overspending pressure. Learn why financial journeys are personal and independent.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-young-adult-38"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/peer-spending-comparison",
      index: 37,
      scenario: {
        setup:
          "Social relationships create financial pressure through spending comparisons. This game explores maintaining friendships while making independent financial decisions.",
        choices: [
          {
            label: "Better decisions",
            outcome:
              "Social comparison often leads to competitive spending rather than improved financial judgment or personal goal alignment.",
          },
          {
            label: "Overspending pressure",
            outcome:
              "Financial journeys are personal.",
          },
        ],
        reflections: [
          "How can you build confidence in your financial decisions while maintaining meaningful friendships?",
          "What strategies help you participate in social activities within your budget without feeling excluded?",
        ],
        skill: "Social financial independence",
      },
    },
    {
      id: "finance-young-adult-39",
      title: "Delayed Gratification",
      description:
        "Waiting before buying helps because it improves decision quality. Learn how delaying purchases prevents regret and builds financial wisdom.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-young-adult-39"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/delayed-gratification",
      index: 38,
      scenario: {
        setup:
          "Impulse purchasing competes with thoughtful financial planning. This game explores how strategic waiting improves decision outcomes.",
        choices: [
          {
            label: "It reduces desire",
            outcome:
              "While waiting may reduce immediate wanting, the primary benefit is improved decision-making rather than diminished desire.",
          },
          {
            label: "It improves decision quality",
            outcome:
              "Delaying purchases prevents regret.",
          },
        ],
        reflections: [
          "How can delayed gratification actually increase your long-term satisfaction and financial security?",
          "What waiting period system works best for your personality and financial goals?",
        ],
        skill: "Delayed gratification mastery",
      },
    },
    {
      id: "finance-young-adult-40",
      title: "Needs vs Wants Checkpoint",
      description:
        "Correctly classify needs and wants in 7 scenarios. Master the fundamental skill of conscious spending trade-offs.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Hard",
      duration: "8 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-young-adult-40"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/needs-vs-wants-checkpoint",
      isBadgeGame: true,
      badgeName: "Badge: Needs vs Wants Master",
      badgeImage: "/badges/finance/young-adult/NeedsvsWantsMaster.png",
      index: 39,
      scenario: {
        setup:
          "Distinguishing essential needs from discretionary wants is the foundation of all financial decision-making. This checkpoint tests your classification mastery.",
        choices: [
          {
            label: "Misclassify luxury as necessity",
            outcome:
              "Misclassification leads to poor budgeting and financial stress when true essentials aren't properly prioritized.",
          },
          {
            label: "Correctly classify needs and wants",
            outcome:
              "You can now make conscious spending trade-offs.",
          },
        ],
        reflections: [
          "How can clearly distinguishing needs from wants actually increase your financial freedom and life satisfaction?",
          "What system helps you consistently make conscious spending trade-offs that align with your values and goals?",
        ],
        skill: "Needs-wants classification mastery",
      },
    },
    {
      id: "finance-young-adult-41",
      title: "Why a Bank Account Matters",
      description:
        "Why is having a bank account important? Learn how bank accounts provide safety, records, and access to essential financial services.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-young-adult-41"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/why-bank-account-matters",
      index: 40,
      scenario: {
        setup:
          "Bank accounts form the foundation of modern financial life. This game explores why banking relationships are essential for financial stability and growth.",
        choices: [
          {
            label: "Only for salary deposits",
            outcome:
              "While salary deposit is one function, bank accounts provide much broader financial benefits and security features.",
          },
          {
            label: "For safety, records, and access to services",
            outcome:
              "Bank accounts are the foundation of financial life.",
          },
        ],
        reflections: [
          "How can bank accounts actually increase your financial freedom and opportunities rather than just adding complexity?",
          "What specific banking features align best with your current financial goals and lifestyle needs?",
        ],
        skill: "Banking fundamentals mastery",
      },
    },
    {
      id: "finance-young-adult-42",
      title: "UPI Is Not Cash",
      description:
        "Digital payments feel like cashless money. What's the truth? Learn how UPI spends real bank balance and why digital ease can hide real spending.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-young-adult-42"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/upi-is-not-cash",
      index: 41,
      scenario: {
        setup:
          "Digital payment convenience can obscure the reality that UPI transactions immediately reduce your actual bank balance. This game explores maintaining awareness.",
        choices: [
          {
            label: "UPI money is unlimited",
            outcome:
              "UPI transactions draw directly from your bank account balance - there's no magical unlimited source of digital money.",
          },
          {
            label: "UPI spends real bank balance",
            outcome:
              "Digital ease can hide real spending.",
          },
        ],
        reflections: [
          "How can digital payment awareness actually enhance your financial control rather than diminish it?",
          "What balance between payment convenience and spending mindfulness works best for your financial goals?",
        ],
        skill: "Digital payment awareness",
      },
    },
    {
      id: "finance-young-adult-43",
      title: "OTP Safety",
      description:
        "Someone asks for your OTP. What should you do? Learn why you should never share OTPs and how they protect your money.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-young-adult-43"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/otp-safety",
      index: 42,
      scenario: {
        setup:
          "Digital security relies on protecting your one-time passwords. This game explores recognizing and responding to OTP-related threats.",
        choices: [
          {
            label: "Share quickly",
            outcome:
              "Sharing OTPs immediately compromises your financial security - legitimate services never ask for your one-time passwords.",
          },
          {
            label: "Never share OTPs",
            outcome:
              "OTPs protect your money.",
          },
        ],
        reflections: [
          "How can strong OTP practices actually increase your financial freedom rather than restrict it?",
          "What personal protocols help you maintain OTP security without creating unnecessary anxiety about legitimate transactions?",
        ],
        skill: "OTP security mastery",
      },
    },
    {
      id: "finance-young-adult-44",
      title: "Multiple Bank Accounts",
      description:
        "Is opening many bank accounts helpful? Learn why fewer active accounts improve control and financial management effectiveness.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-young-adult-44"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/multiple-bank-accounts",
      index: 43,
      scenario: {
        setup:
          "Bank account proliferation can seem beneficial but often creates management complexity. This game explores strategic account consolidation.",
        choices: [
          {
            label: "Yes, always",
            outcome:
              "Multiple accounts often create complexity without proportional benefits - management overhead typically outweighs any advantages.",
          },
          {
            label: "No, it can create confusion",
            outcome:
              "Fewer active accounts improve control.",
          },
        ],
        reflections: [
          "How can consolidated banking actually increase your financial effectiveness rather than limit your options?",
          "What account structure provides the right balance between functionality and manageability for your specific needs?",
        ],
        skill: "Account consolidation strategy",
      },
    },
    {
      id: "finance-young-adult-45",
      title: "Wallet vs Bank",
      description:
        "Which is safer for storing money? Learn why wallets are for spending while banks provide superior security for saving and storage.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-young-adult-45"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/wallet-vs-bank",
      index: 44,
      scenario: {
        setup:
          "Digital wallets and bank accounts serve different financial purposes. This game explores optimal usage strategies for security and convenience.",
        choices: [
          {
            label: "Digital wallet",
            outcome:
              "Digital wallets are convenient for transactions but lack the comprehensive security and regulatory protections that bank accounts provide for money storage.",
          },
          {
            label: "Bank account",
            outcome:
              "Wallets are for spending, banks for saving.",
          },
        ],
        reflections: [
          "How can strategic use of both wallets and banks actually enhance your financial security and convenience?",
          "What personal system helps you leverage wallet transaction ease while maintaining bank-level protection for your money?",
        ],
        skill: "Wallet-bank strategy mastery",
      },
    },
    {
      id: "finance-young-adult-46",
      title: "Checking Bank Statements",
      description:
        "Why should you check statements? Learn how reviewing bank statements helps track spending, detect errors, and reveal financial habits.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-young-adult-46"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/checking-bank-statements",
      index: 45,
      scenario: {
        setup:
          "Regular bank statement review is essential financial hygiene. This game explores systematic approaches to monitoring your financial activity.",
        choices: [
          {
            label: "For curiosity",
            outcome:
              "While curiosity can motivate checking, the primary purpose is practical financial management and error detection rather than casual browsing.",
          },
          {
            label: "To track spending and detect errors",
            outcome:
              "Statements reveal habits and mistakes.",
          },
        ],
        reflections: [
          "How can regular statement checking actually increase your financial confidence and control rather than create anxiety?",
          "What systematic approach makes statement review efficient while maximizing the insights you gain about your spending patterns?",
        ],
        skill: "Statement analysis mastery",
      },
    },
    {
      id: "finance-young-adult-47",
      title: "Public Wi-Fi Risk",
      description:
        "Is it safe to use banking apps on public Wi-Fi? Learn why public networks increase fraud risk and how to protect your financial data.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-young-adult-47"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/public-wifi-risk",
      index: 46,
      scenario: {
        setup:
          "Public wireless networks create significant security vulnerabilities for financial transactions. This game explores digital safety practices.",
        choices: [
          {
            label: "Yes",
            outcome:
              "Public Wi-Fi networks lack security encryption and create significant vulnerability to data interception and financial information theft.",
          },
          {
            label: "No, it risks data theft",
            outcome:
              "Public networks increase fraud risk.",
          },
        ],
        reflections: [
          "How can avoiding public Wi-Fi for financial activities actually increase your transaction flexibility rather than restrict it?",
          "What personal protocols help you maintain financial security without creating unnecessary anxiety about legitimate mobile data usage?",
        ],
        skill: "Network security awareness",
      },
    },
    {
      id: "finance-young-adult-48",
      title: "Auto-Debit Awareness",
      description:
        "Auto-debits are useful when you monitor and control them. Learn why auto-debits need supervision and how to manage subscriptions effectively.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-young-adult-48"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/auto-debit-awareness",
      index: 47,
      scenario: {
        setup:
          "Automated payments provide convenience but require active management. This game explores strategic subscription and auto-debit oversight.",
        choices: [
          {
            label: "You forget they exist",
            outcome:
              "Forgetting about auto-debits creates financial blind spots and potential overspending - awareness and active management are essential for responsible usage.",
          },
          {
            label: "You monitor and control them",
            outcome:
              "Auto-debits need supervision.",
          },
        ],
        reflections: [
          "How can systematic auto-debit monitoring actually increase your financial flexibility rather than create administrative burden?",
          "What review system helps you maintain subscription value while preventing unwanted recurring charges from accumulating unnoticed?",
        ],
        skill: "Subscription management mastery",
      },
    },
    {
      id: "finance-young-adult-49",
      title: "Digital Record Advantage",
      description:
        "Why are digital records helpful? Learn how digital records help budgeting and future credit access, building financial credibility.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-young-adult-49"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/digital-record-advantage",
      index: 48,
      scenario: {
        setup:
          "Digital financial records provide lasting documentation that supports budgeting analysis and credit-building activities. This game explores maximizing record value.",
        choices: [
          {
            label: "They disappear",
            outcome:
              "Digital records actually provide permanent, searchable documentation rather than disappearing - their persistence is a key advantage for financial management.",
          },
          {
            label: "They help budgeting and future credit access",
            outcome:
              "Records build financial credibility.",
          },
        ],
        reflections: [
          "How can systematic digital record analysis actually increase your financial opportunities rather than just create administrative work?",
          "What review system maximizes the value of your digital records while supporting your specific financial goals and credit-building timeline?",
        ],
        skill: "Digital record utilization mastery",
      },
    },
    {
      id: "finance-young-adult-50",
      title: "Digital Money Checkpoint",
      description:
        "Make 7 safe digital money decisions. Master the essential skills for responsible and safe digital money usage.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Hard",
      duration: "8 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-young-adult-50"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/digital-money-checkpoint",
      isBadgeGame: true,
      badgeName: "Badge: Digital Money Smart",
      badgeImage: "/badges/finance/young-adult/DigitalMoneySmart.png",
      index: 49,
      scenario: {
        setup:
          "Digital money requires the same security principles as physical cash plus additional cyber-protection measures. This checkpoint tests comprehensive digital finance safety.",
        choices: [
          {
            label: "Make unsafe digital transactions",
            outcome:
              "Unsafe practices expose you to fraud, identity theft, and financial loss - proper security protocols are essential for digital money management.",
          },
          {
            label: "Make 7 safe digital money decisions",
            outcome:
              "You can now use digital money responsibly and safely.",
          },
        ],
        reflections: [
          "How can systematic digital money safety practices actually increase your financial freedom rather than restrict your transaction flexibility?",
          "What personal security protocols help you use digital money confidently while maintaining the convenience that makes digital transactions valuable?",
        ],
        skill: "Digital money safety mastery",
      },
    },
    {
      id: "finance-young-adult-51",
      title: "What Is Credit Really?",
      description:
        "Credit means borrowed money that must be repaid. Learn when credit is helpful and how to use it responsibly.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-young-adult-51"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/what-is-credit-really",
      index: 50,
      scenario: {
        setup:
          "Understanding credit is crucial for financial health. Credit is borrowed money that must be repaid, often with interest.",
        choices: [
          {
            label: "Extra income",
            outcome:
              "Credit is not extra income - it's borrowed money that must be repaid with interest.",
          },
          {
            label: "Borrowed money that must be repaid",
            outcome:
              "Credit is borrowed money that comes with a cost - you must repay it, often with interest.",
          },
        ],
        reflections: [
          "How can understanding the true nature of credit help you make better financial decisions?",
          "What strategies can you use to ensure credit enhances rather than hinders your financial goals?",
        ],
        skill: "Credit literacy",
      },
    },
    {
      id: "finance-young-adult-52",
      title: "First Credit Decision",
      description:
        "When is it okay to use credit? Learn to make responsible credit decisions that support your financial stability.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-young-adult-52"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/first-credit-decision",
      index: 51,
      scenario: {
        setup:
          "Making your first credit decisions requires careful consideration. Credit should support stability, not create habits of overspending.",
        choices: [
          {
            label: "For impulse spending",
            outcome:
              "Credit used for impulse purchases can lead to debt accumulation and financial stress.",
          },
          {
            label: "For planned needs with repayment ability",
            outcome:
              "Credit should be used strategically for planned expenses where you have a clear repayment strategy.",
          },
        ],
        reflections: [
          "How can understanding responsible credit use help you build long-term financial security?",
          "What strategies can you implement to ensure credit supports your financial goals rather than hinders them?",
        ],
        skill: "Responsible credit usage",
      },
    },
    {
      id: "finance-young-adult-53",
      title: "EMI Reality Check",
      description:
        "EMI payments should be comfortable within income. Learn how to assess EMI affordability and avoid financial stress.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-young-adult-53"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/emi-reality-check",
      index: 52,
      scenario: {
        setup:
          "EMI decisions require careful consideration of your income and expenses. High EMIs can reduce financial flexibility and increase stress.",
        choices: [
          {
            label: "As high as possible",
            outcome:
              "High EMIs severely limit financial flexibility and can create significant stress during repayment periods.",
          },
          {
            label: "Comfortable within income",
            outcome:
              "EMI payments should be comfortably affordable within your income, leaving room for other expenses and savings.",
          },
        ],
        reflections: [
          "How can you ensure EMI payments enhance rather than hinder your financial goals?",
          "What strategies can you use to maintain financial flexibility while managing loan obligations?",
        ],
        skill: "EMI affordability assessment",
      },
    },
    {
      id: "finance-young-adult-54",
      title: "Credit Card Temptation",
      description:
        "Credit cards feel like free money because payment is delayed but still required. Learn to avoid the temptation of overspending.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-young-adult-54"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/credit-card-temptation",
      index: 53,
      scenario: {
        setup:
          "Credit cards create the illusion of free money due to delayed payment. This can lead to overspending and financial difficulties if not managed carefully.",
        choices: [
          {
            label: "They are income",
            outcome:
              "Credit cards are not income - they're borrowed money that must be repaid with potential interest charges.",
          },
          {
            label: "Payment is delayed but still required",
            outcome:
              "The delayed payment structure of credit cards can hide the real cost and lead to overspending if not managed carefully.",
          },
        ],
        reflections: [
          "How can you use credit cards responsibly while avoiding the temptation to overspend?",
          "What strategies can help you maintain awareness of your credit card spending in real-time?",
        ],
        skill: "Credit card responsibility",
      },
    },
    {
      id: "finance-young-adult-55",
      title: "Minimum Due Trap",
      description:
        "Paying only minimum due leads to growing interest and debt. Learn why minimum payments extend debt unnecessarily.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-young-adult-55"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/minimum-due-trap",
      index: 54,
      scenario: {
        setup:
          "Paying only the minimum due on credit cards creates the illusion of financial responsibility while actually extending your debt unnecessarily.",
        choices: [
          {
            label: "No problem",
            outcome:
              "Paying only the minimum creates a false sense of security while interest continues to accumulate, making it harder to pay off the debt.",
          },
          {
            label: "Growing interest and debt",
            outcome:
              "Minimum payments are designed to cover mostly interest charges, leaving the principal debt largely untouched and extending the repayment period.",
          },
        ],
        reflections: [
          "How can you avoid falling into the minimum payment trap?",
          "What strategies can help you pay more than the minimum consistently?",
        ],
        skill: "Minimum payment awareness",
      },
    },
    {
      id: "finance-young-adult-56",
      title: "BNPL Awareness",
      description:
        "Buy Now Pay Later works best when used rarely with full understanding. Learn why BNPL can quietly become debt.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-young-adult-56"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/bnpl-awareness",
      index: 55,
      scenario: {
        setup:
          "Buy Now Pay Later services can seem convenient, but they can quietly accumulate debt if not used responsibly. Understanding when and how to use BNPL is crucial.",
        choices: [
          {
            label: "Used frequently",
            outcome:
              "Frequent use of BNPL can lead to overspending and accumulating multiple payment obligations that become difficult to manage.",
          },
          {
            label: "Used rarely with full understanding",
            outcome:
              "BNPL should be used strategically with clear understanding of the repayment terms and only for planned purchases that fit within your budget.",
          },
        ],
        reflections: [
          "How can you use BNPL strategically without falling into the debt trap?",
          "What systems can you put in place to track BNPL obligations effectively?",
        ],
        skill: "BNPL responsibility",
      },
    },
    {
      id: "finance-young-adult-57",
      title: "Loan Eligibility Basics",
      description:
        "What improves loan eligibility? Learn how stable income and repayment discipline build creditworthiness.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-young-adult-57"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/loan-eligibility-basics",
      index: 56,
      scenario: {
        setup:
          "Loan eligibility depends on several factors that demonstrate your ability to repay borrowed money responsibly.",
        choices: [
          {
            label: "Multiple loans",
            outcome:
              "Having multiple loans actually increases your debt burden and can hurt your loan eligibility by affecting your debt-to-income ratio.",
          },
          {
            label: "Stable income and repayment discipline",
            outcome:
              "Lenders want to see that you have a consistent income and a track record of managing debt responsibly, which builds creditworthiness over time.",
          },
        ],
        reflections: [
          "How can you build a strong financial profile to improve loan eligibility?",
          "What habits should you develop early to ensure future creditworthiness?",
        ],
        skill: "Loan eligibility awareness",
      },
    },
    {
      id: "finance-young-adult-58",
      title: "Borrowing More Than Needed",
      description:
        "You qualify for more than you need. What's safer? Learn why smaller loans reduce stress.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-young-adult-58"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/borrowing-more-than-needed",
      index: 57,
      scenario: {
        setup:
          "When you qualify for a loan larger than your actual need, the temptation to borrow extra can be strong. However, responsible borrowing is key to maintaining financial health.",
        choices: [
          {
            label: "Take full amount",
            outcome:
              "Taking more than needed increases your debt burden and monthly payments, creating unnecessary financial stress and reducing your financial flexibility.",
          },
          {
            label: "Take only what's needed",
            outcome:
              "Borrowing only what you need keeps your debt manageable and reduces financial stress, allowing you to maintain better control over your finances.",
          },
        ],
        reflections: [
          "How can you ensure you're borrowing only what you truly need?",
          "What strategies help you resist the temptation to borrow extra 'just in case'?",
        ],
        skill: "Responsible borrowing mindset",
      },
    },
    {
      id: "finance-young-adult-59",
      title: "Credit Is Not Emergency Fund",
      description:
        "Is credit a replacement for savings? Learn why savings reduce dependence on credit.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-young-adult-59"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/credit-is-not-emergency-fund",
      index: 58,
      scenario: {
        setup:
          "Credit cards and loans are readily available, but should they replace the need for an emergency fund? Understanding the difference between credit and savings is crucial for financial stability.",
        choices: [
          {
            label: "Yes",
            outcome:
              "Relying on credit for emergencies creates debt and interest obligations that can take months or years to pay off.",
          },
          {
            label: "No, savings should come first",
            outcome:
              "Emergency funds provide financial security without debt or interest, allowing you to handle unexpected expenses without long-term financial consequences.",
          },
        ],
        reflections: [
          "How can you build an emergency fund while managing regular expenses?",
          "What strategies help you resist the temptation to use credit for non-emergencies?",
        ],
        skill: "Emergency fund awareness",
      },
    },
    {
      id: "finance-young-adult-60",
      title: "First Credit Checkpoint",
      description:
        "Make 7 safe first-credit decisions. You are now ready to approach credit carefully and responsibly.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Hard",
      duration: "8 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-young-adult-60"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/first-credit-checkpoint",
      isBadgeGame: true,
      badgeName: "Badge: First Credit Ready",
      badgeImage: "/badges/finance/young-adult/FirstCreditReady.png",
      index: 59,
      scenario: {
        setup:
          "You've learned about credit and are ready to make your first credit decisions. This checkpoint tests your understanding of responsible credit management.",
        choices: [
          {
            label: "Make 7 safe first-credit decisions",
            outcome:
              "You are now ready to approach credit carefully and responsibly.",
          },
          {
            label: "Continue learning about credit management",
            outcome:
              "Building responsible credit habits requires mastering key decision-making principles.",
          },
        ],
        reflections: [
          "How can you use credit as a tool for financial growth rather than a source of debt?",
          "What strategies will help you maintain responsible credit habits over time?",
        ],
        skill: "Responsible credit management",
      },
    },
    {
      id: "finance-young-adult-61",
      title: "Why Save Early?",
      description:
        "Why is saving early powerful? Learn how time helps money grow and why it's the biggest advantage young adults have.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-young-adult-61"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/why-save-early",
      index: 60,
      scenario: {
        setup:
          "You're considering starting to save money early in your financial journey. The key question is: why does timing matter so much for building wealth?",
        choices: [
          {
            label: "It doesn't matter",
            outcome:
              "Time is actually one of the most powerful tools for building wealth. Starting early gives you a significant advantage through compound interest.",
          },
          {
            label: "Time helps money grow",
            outcome:
              "Time is the biggest advantage young adults have. Compound interest allows your money to grow exponentially over decades.",
          },
        ],
        reflections: [
          "How can you start building your savings habit today, even with a small amount?",
          "What long-term goals could benefit most from the power of compound interest?",
        ],
        skill: "Early saving advantage",
      },
    },
    {
      id: "finance-young-adult-62",
      title: "Saving Before Investing",
      description:
        "What should come first? Learn why savings create safety and investing builds growth.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-young-adult-62"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/saving-before-investing",
      index: 61,
      scenario: {
        setup:
          "You're starting your financial journey and wondering about the order of operations. Should you save first, invest first, or do both simultaneously?",
        choices: [
          {
            label: "Investing immediately",
            outcome:
              "Jumping into investments without a savings foundation can be risky. You need stability before seeking growth.",
          },
          {
            label: "Basic savings discipline",
            outcome:
              "Savings create safety; investing builds growth. This balanced approach provides both security and opportunity for wealth building.",
          },
        ],
        reflections: [
          "How can you build a balanced approach that includes both saving and investing?",
          "What steps can you take today to strengthen your financial foundation?",
        ],
        skill: "Financial foundation building",
      },
    },
    {
      id: "finance-young-adult-63",
      title: "Emergency Fund First",
      description:
        "Before investing, what should you build? Learn why emergency funds prevent forced withdrawals.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-young-adult-63"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/emergency-fund-first",
      index: 62,
      scenario: {
        setup:
          "You're eager to start investing and building wealth, but you're wondering about the order of financial priorities. Should you build an emergency fund first or dive straight into investments?",
        choices: [
          {
            label: "Emergency fund",
            outcome:
              "Emergency funds prevent forced withdrawals. Having 3-6 months of expenses saved provides security and confidence to invest for long-term growth.",
          },
          {
            label: "High-return portfolio",
            outcome:
              "Investing without an emergency fund can lead to forced withdrawals during unexpected situations, potentially locking in losses at market lows.",
          },
        ],
        reflections: [
          "How can you start building your emergency fund today, even with a small amount?",
          "What investment opportunities could you pursue more confidently with an emergency fund in place?",
        ],
        skill: "Emergency fund strategy",
      },
    },
    {
      id: "finance-young-adult-64",
      title: "Fixed Deposit Awareness",
      description:
        "Fixed deposits are best for: Learn why FDs protect capital, not chase returns.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-young-adult-64"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/fixed-deposit-awareness",
      index: 63,
      scenario: {
        setup:
          "You're exploring different investment options and considering fixed deposits. What makes them unique compared to other savings instruments?",
        choices: [
          {
            label: "Quick wealth",
            outcome:
              "Fixed deposits are not designed for quick wealth generation. They offer steady, predictable returns over time rather than rapid growth.",
          },
          {
            label: "Safe and predictable savings",
            outcome:
              "FDs protect capital, not chase returns. They provide guaranteed returns with capital protection, making them ideal for conservative investors.",
          },
        ],
        reflections: [
          "How can you balance safety and growth in your investment portfolio?",
          "When would fixed deposits be the right choice for your financial goals?",
        ],
        skill: "Fixed deposit strategy",
      },
    },
    {
      id: "finance-young-adult-65",
      title: "Mutual Funds – Basic Idea",
      description:
        "Mutual funds work by: Learn why diversification reduces risk.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-young-adult-65"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/mutual-funds-basic-idea",
      index: 64,
      scenario: {
        setup:
          "You're learning about different investment options and want to understand how mutual funds work. What makes them different from individual stock investing?",
        choices: [
          {
            label: "Gambling on prices",
            outcome:
              "Mutual funds are not gambling. They follow structured investment strategies with professional management and diversification.",
          },
          {
            label: "Pooling money and spreading risk",
            outcome:
              "Diversification reduces risk. Mutual funds collect money from many investors and invest in a diversified portfolio, spreading risk across multiple assets.",
          },
        ],
        reflections: [
          "How can diversification help protect your investments?",
          "When would mutual funds be appropriate for your investment goals?",
        ],
        skill: "Mutual fund understanding",
      },
    },
    {
      id: "finance-young-adult-66",
      title: "Risk vs Return",
      description:
        "Higher returns usually mean: Learn why understanding risk prevents disappointment.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-young-adult-66"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/risk-vs-return",
      index: 65,
      scenario: {
        setup:
          "You're learning about investment principles and want to understand the relationship between risk and potential returns. What should you expect?",
        choices: [
          {
            label: "No risk",
            outcome:
              "Higher returns typically come with higher risk. Investments with no risk usually offer lower, more predictable returns.",
          },
          {
            label: "Higher risk",
            outcome:
              "Understanding risk prevents disappointment. The fundamental principle of investing is that higher potential returns are associated with higher levels of risk.",
          },
        ],
        reflections: [
          "How can you balance potential returns with acceptable risk levels?",
          "What factors should influence your risk tolerance in investments?",
        ],
        skill: "Risk-return analysis",
      },
    },
    {
      id: "finance-young-adult-67",
      title: "Long-Term Investing Mindset",
      description:
        "Investing works best when: Learn why patience rewards discipline.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-young-adult-67"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/long-term-investing-mindset",
      index: 66,
      scenario: {
        setup:
          "You're learning about successful investment strategies and want to understand what separates long-term winners from short-term traders. What approach should you take?",
        choices: [
          {
            label: "You chase daily prices",
            outcome:
              "Chasing daily prices often leads to emotional decision-making and can result in buying high and selling low. This approach typically undermines long-term investment success.",
          },
          {
            label: "You stay invested long-term",
            outcome:
              "Patience rewards discipline. Long-term investing allows you to benefit from compound growth and ride out short-term market volatility.",
          },
        ],
        reflections: [
          "How can you maintain a long-term perspective during market volatility?",
          "What strategies can help you stay disciplined with your investment approach?",
        ],
        skill: "Long-term investment discipline",
      },
    },
    {
      id: "finance-young-adult-68",
      title: "Avoiding Get-Rich-Quick Schemes",
      description:
        "“Guaranteed high returns” usually indicate: Learn why guaranteed returns are a red flag.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-young-adult-68"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/avoiding-get-rich-quick-schemes",
      index: 67,
      scenario: {
        setup:
          "You're exploring investment opportunities and come across an offer promising guaranteed high returns with no risk. What should raise your suspicions?",
        choices: [
          {
            label: "Safe investment",
            outcome:
              "Guaranteed high returns are extremely rare and usually indicate either fraud or extremely high risk. Legitimate investments always carry some level of risk.",
          },
          {
            label: "Scam or high risk",
            outcome:
              "Guaranteed returns are a red flag. No legitimate investment can guarantee high returns without corresponding high risk or potential fraud.",
          },
        ],
        reflections: [
          "How can you verify the legitimacy of an investment opportunity?",
          "What steps can you take to protect yourself from investment scams?",
        ],
        skill: "Investment scam awareness",
      },
    },
    {
      id: "finance-young-adult-69",
      title: "Start Small, Stay Consistent",
      description:
        "What matters more? Learn why consistency beats size early on.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-young-adult-69"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/start-small-stay-consistent",
      index: 68,
      scenario: {
        setup:
          "You're starting your investment journey and wondering whether to make one large investment or start with small, regular contributions. What approach is better for long-term success?",
        choices: [
          {
            label: "Large one-time investments",
            outcome:
              "While large one-time investments can be beneficial, they're not always feasible for young adults with limited capital. The key is starting with what you can afford consistently.",
          },
          {
            label: "Small, regular contributions",
            outcome:
              "Consistency beats size early on. Small, regular contributions build the habit of investing and can grow significantly over time through compound interest.",
          },
        ],
        reflections: [
          "How can you start building an investing habit with your current income?",
          "What strategies can help you maintain consistency in your investment approach?",
        ],
        skill: "Consistent investing habit",
      },
    },
    {
      id: "finance-young-adult-70",
      title: "Growth Basics Checkpoint",
      description:
        "Task: Make 7 safe saving and investing decisions. You have built a foundation for long-term financial growth.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-young-adult-70"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/growth-basics-checkpoint",
      isBadgeGame: true,
      badgeName: "Badge: Growth Ready",
      badgeImage: "/badges/finance/young-adult/GrowthReady.png",
      index: 69,
      scenario: {
        setup:
          "You're at a crucial point in your financial journey where you need to make foundational decisions about saving and investing. What safe strategies will set you up for long-term success?",
        choices: [
          {
            label: "Make risky, high-reward investments",
            outcome:
              "High-risk investments can lead to significant losses. While potential returns are higher, the risk of losing your principal is also substantial, especially for beginners.",
          },
          {
            label: "Make 7 safe saving and investing decisions",
            outcome:
              "You have built a foundation for long-term financial growth. Safe, consistent decisions compound over time to create substantial wealth through the power of compound interest.",
          },
        ],
        reflections: [
          "How can you build a diversified investment portfolio that matches your risk tolerance?",
          "What steps can you take today to establish the foundation for long-term wealth growth?",
        ],
        skill: "Foundation wealth building",
      },
    },
    {
      id: "finance-young-adult-71",
      title: "Income Comes from Skills",
      description:
        "What mostly determines earning potential? Learn why skills compound income.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-young-adult-71"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/income-comes-from-skills",
      index: 70,
      scenario: {
        setup:
          "You're planning your career development and wondering what factors will most significantly impact your long-term earning potential. What should be your primary focus?",
        choices: [
          {
            label: "Luck alone",
            outcome:
              "While luck can play a role in opportunities, relying solely on luck is not a sustainable strategy for building long-term earning potential. Success typically requires effort and skill development.",
          },
          {
            label: "Skills and effort over time",
            outcome:
              "Skills compound income. The more you develop your abilities and work consistently, the more valuable you become in the marketplace, leading to higher earning potential.",
          },
        ],
        reflections: [
          "Which skills in your field have the highest earning potential?",
          "How can you strategically invest time in skill development for maximum career impact?",
        ],
        skill: "Strategic skill development",
      },
    },
    {
      id: "finance-young-adult-72",
      title: "First Job Reality",
      description:
        "First jobs usually offer: Learn why early experience builds future income.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-young-adult-72"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/first-job-reality",
      index: 71,
      scenario: {
        setup:
          "You're entering the job market for the first time and evaluating different opportunities. What should you prioritize in your first professional role?",
        choices: [
          {
            label: "High pay immediately",
            outcome:
              "First jobs typically don't offer high immediate pay. They're designed to provide learning opportunities and entry-level experience rather than premium compensation.",
          },
          {
            label: "Learning and experience first",
            outcome:
              "Early experience builds future income. The foundation you build in your first job through experience, skills, and professional relationships compounds over time to create significant future income growth.",
          },
        ],
        reflections: [
          "What skills from your first job will be most valuable throughout your career?",
          "How can you maximize the learning opportunities in your first professional role?",
        ],
        skill: "First job value assessment",
      },
    },
    {
      id: "finance-young-adult-73",
      title: "Side Income Truth",
      description:
        "Side income works best when: Learn why sustainable side income needs effort.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-young-adult-73"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/side-income-truth",
      index: 72,
      scenario: {
        setup:
          "You're considering starting a side income to supplement your main earnings. What approach will lead to sustainable success?",
        choices: [
          {
            label: "It's a shortcut to wealth",
            outcome:
              "Treating side income as a quick shortcut to wealth often leads to unrealistic expectations and poor decisions. Wealth building requires consistent effort and smart financial strategies.",
          },
          {
            label: "It uses skills and time wisely",
            outcome:
              "Sustainable side income needs effort. The most successful side income opportunities leverage your existing skills and available time efficiently, creating sustainable earnings without overwhelming your primary responsibilities.",
          },
        ],
        reflections: [
          "How can you leverage your existing skills to create sustainable side income?",
          "What balance between your main job and side income works best for your situation?",
        ],
        skill: "Side income strategy",
      },
    },
    {
      id: "finance-young-adult-74",
      title: "Time vs Money Trade-off",
      description:
        "Taking too many gigs leads to: Learn why balance protects long-term earning ability.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-young-adult-74"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/time-vs-money-tradeoff",
      index: 73,
      scenario: {
        setup:
          "You're considering taking on multiple side gigs to increase your income. What approach will protect your long-term earning ability?",
        choices: [
          {
            label: "Faster growth",
            outcome:
              "While taking on multiple gigs might seem like a way to accelerate growth, overcommitting often leads to decreased quality of work and increased stress, which can actually hinder long-term progress.",
          },
          {
            label: "Burnout and poor performance",
            outcome:
              "Balance protects long-term earning ability. Taking on too many gigs without proper time management leads to exhaustion, decreased productivity, and ultimately poor performance across all commitments.",
          },
        ],
        reflections: [
          "How can you determine the optimal number of commitments for your situation?",
          "What strategies help you maintain quality work while managing multiple income sources?",
        ],
        skill: "Time management strategy",
      },
    },
    {
      id: "finance-young-adult-75",
      title: "Freelancing Basics",
      description:
        "What matters most in freelancing? Learn why reputation creates repeat income.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-young-adult-75"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/freelancing-basics",
      index: 74,
      scenario: {
        setup:
          "You're starting your freelancing career and want to build a sustainable income stream. What approach will lead to long-term success?",
        choices: [
          {
            label: "Low pricing",
            outcome:
              "While competitive pricing is important, focusing solely on low prices can lead to undervaluing your work and attracting clients who only care about cost rather than quality. This approach often results in poor project experiences and limited growth opportunities.",
          },
          {
            label: "Reliability and quality",
            outcome:
              "Reputation creates repeat income. Reliability and quality are the foundation of successful freelancing. Clients value professionals who deliver consistent, high-quality work on time, which leads to positive reviews, repeat business, and referrals.",
          },
        ],
        reflections: [
          "How can you demonstrate reliability and quality in your freelance work?",
          "What strategies help build a strong reputation in freelancing?",
        ],
        skill: "Freelancing fundamentals",
      },
    },
    {
      id: "finance-young-adult-76",
      title: "Income Stability",
      description:
        "Why is stable income important? Learn how stability supports financial discipline and long-term planning.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-young-adult-76"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/income-stability",
      index: 75,
      scenario: {
        setup:
          "Stable income provides a foundation for financial security and growth. Understanding its importance helps you make better financial decisions.",
        choices: [
          {
            label: "For spending freely",
            outcome:
              "While stable income does provide some freedom, the primary importance lies in the predictability and security it offers for financial planning.",
          },
          {
            label: "For planning and saving safely",
            outcome:
              "Stable income provides the foundation for consistent financial planning and secure savings, enabling long-term financial goals.",
          },
        ],
        reflections: [
          "How can stable income help you achieve your long-term financial goals?",
          "What steps can you take to create more stability in your income?",
        ],
        skill: "Income stability awareness",
      },
    },
    {
      id: "finance-young-adult-77",
      title: "Career Growth vs Quick Pay",
      description:
        "Which choice is wiser early on? Learn why learning with gradual income growth multiplies future earnings.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-young-adult-77"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/career-growth-vs-quick-pay",
      index: 76,
      scenario: {
        setup:
          "Early in your career, you face a choice between immediate high pay with no learning opportunities or lower pay with significant learning potential. The decision shapes your long-term trajectory.",
        choices: [
          {
            label: "Quick pay with no learning",
            outcome:
              "While quick pay might seem attractive, it often leads to stagnation and missed opportunities for skill development and long-term growth.",
          },
          {
            label: "Learning with gradual income growth",
            outcome:
              "Investing in learning and skill development early on creates a strong foundation for sustained career growth and higher future earnings.",
          },
        ],
        reflections: [
          "How can you identify learning opportunities in your current or potential roles?",
          "What balance between immediate compensation and long-term growth works for your situation?",
        ],
        skill: "Career growth strategy",
      },
    },
    {
      id: "finance-young-adult-78",
      title: "Online Income Scams",
      description:
        "“Easy money online” usually means: Learn how to identify online income scams and protect yourself.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-young-adult-78"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/online-income-scams",
      index: 77,
      scenario: {
        setup:
          "The internet offers many opportunities for earning income, but 'easy money online' is often a warning sign for scams. Knowing how to identify red flags and protect yourself is essential for financial security.",
        choices: [
          {
            label: "Genuine opportunity",
            outcome:
              "Genuine opportunities typically require effort, time, and sometimes initial investment. 'Easy money' claims should be viewed with skepticism.",
          },
          {
            label: "Scam or exploitation",
            outcome:
              "Legitimate income opportunities require work, skills, and realistic expectations. The key warning is that they almost always demand real effort from the user.",
          },
        ],
        reflections: [
          "What verification steps do you typically take before engaging with online income opportunities?",
          "How can you distinguish between legitimate work-from-home jobs and online scams?",
        ],
        skill: "Online scam detection",
      },
    },
    {
      id: "finance-young-adult-79",
      title: "Multiple Income Streams",
      description:
        "Multiple incomes are helpful when: Learn how to build complementary income streams strategically.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-young-adult-79"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/multiple-income-streams",
      index: 78,
      scenario: {
        setup:
          "Building multiple income streams can provide financial security and growth opportunities, but the key is ensuring they complement rather than distract from your main career focus.",
        choices: [
          {
            label: "They distract from main career",
            outcome:
              "Multiple incomes that distract from your main career can actually harm your primary earning potential and long-term growth.",
          },
          {
            label: "They complement main skills",
            outcome:
              "Multiple income streams work best when they complement and enhance your main skills, creating synergies and reducing risk.",
          },
        ],
        reflections: [
          "How can you identify income opportunities that complement your main skills?",
          "What's your strategy for gradually building multiple income streams?",
        ],
        skill: "Income stream strategy",
      },
    },
    {
      id: "finance-young-adult-80",
      title: "Earning Readiness Checkpoint",
      description:
        "Task: Make 7 responsible earning and career decisions. Learn how income grows through skills and discipline.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-young-adult-80"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/earning-readiness-checkpoint",
      isBadgeGame: true,
      badgeName: "Badge: Earning Ready",
      badgeImage: "/badges/finance/young-adult/EarningReady.png",
      index: 79,
      scenario: {
        setup:
          "Building sustainable income requires making responsible decisions about skills, opportunities, and career development. This checkpoint tests your understanding of earning readiness principles.",
        choices: [
          {
            label: "Take any job regardless of values",
            outcome:
              "Taking jobs regardless of values can lead to poor long-term satisfaction and potential ethical issues that harm your career and reputation.",
          },
          {
            label: "Match skills to genuine market demand",
            outcome:
              "Earning readiness involves understanding both your capabilities and authentic market opportunities that align with your skills and interests.",
          },
        ],
        reflections: [
          "How can you identify genuine market opportunities that match your skills?",
          "What's your strategy for building both specialized and transferable skills?",
        ],
        skill: "Earning readiness strategy",
      },
    },
    {
      id: "finance-young-adult-81",
      title: "Phishing Message Alert",
      description:
        "You receive a message saying “Your bank account will be blocked. Click here.” What should you do? Learn to recognize and respond to phishing attempts.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-young-adult-81"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/phishing-message-alert",
      index: 80,
      scenario: {
        setup:
          "Phishing messages use urgency and fear to trick you into revealing personal information or clicking malicious links. Recognizing these tactics is crucial for financial security.",
        choices: [
          {
            label: "Click immediately",
            outcome:
              "Clicking immediately on urgent messages is exactly what scammers want you to do. They create panic to prevent you from thinking clearly and verifying the message.",
          },
          {
            label: "Ignore and verify through official channels",
            outcome:
              "Urgency is a common scam tactic. Always verify through official channels like calling your bank directly or visiting their official website.",
          },
        ],
        reflections: [
          "What steps do you typically take to verify suspicious financial messages?",
          "How can you build better habits for recognizing and responding to phishing attempts?",
        ],
        skill: "Phishing detection",
      },
    },
    {
      id: "finance-young-adult-82",
      title: "Fake Job Offer",
      description:
        "A job promises high pay with upfront registration fees. What does this indicate? Learn to identify employment scams.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-young-adult-82"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/fake-job-offer",
      index: 81,
      scenario: {
        setup:
          "Employment scams often promise high pay with upfront fees or request personal documents early in the process. Recognizing these warning signs protects you from financial loss and identity theft.",
        choices: [
          {
            label: "Genuine opportunity",
            outcome:
              "Genuine employers don't require upfront fees from job applicants. They invest in their employees, not the other way around. This is a major red flag for scams.",
          },
          {
            label: "Likely scam",
            outcome:
              "Legitimate jobs don't ask for money. This is one of the most common warning signs of employment scams designed to steal your money or personal information.",
          },
        ],
        reflections: [
          "What verification steps do you typically take before applying to job opportunities?",
          "How can you distinguish between legitimate job offers and employment scams?",
        ],
        skill: "Job offer verification",
      },
    },
    {
      id: "finance-young-adult-83",
      title: "OTP Sharing Trap",
      description:
        "Someone posing as support asks for your OTP. What should you do? Learn to protect your accounts from OTP misuse.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-young-adult-83"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/otp-sharing-trap",
      index: 82,
      scenario: {
        setup:
          "Scammers often pose as support representatives to trick you into sharing your OTPs. Understanding how to protect your OTPs is crucial for account security.",
        choices: [
          {
            label: "Share to resolve quickly",
            outcome:
              "Sharing your OTP immediately, even with someone claiming to be support, gives them complete access to your account. This is exactly what scammers want to steal your money or personal information.",
          },
          {
            label: "Never share OTPs",
            outcome:
              "OTPs are one-time passwords designed to protect your accounts. Legitimate support will never ask for your OTP. Sharing it compromises your account security immediately.",
          },
        ],
        reflections: [
          "What steps do you take to verify unexpected OTP requests?",
          "How can you build better habits for protecting your OTPs from misuse?",
        ],
        skill: "OTP protection",
      },
    },
    {
      id: "finance-young-adult-84",
      title: "Social Media Investment Tips",
      description:
        "Influencers promise “sure-shot returns.” What’s the safest response? Learn to evaluate social media investment advice.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-young-adult-84"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/social-media-investment-tips",
      index: 83,
      scenario: {
        setup:
          "Social media investment tips from influencers can be misleading or hide significant risks. Learning to evaluate and verify financial advice is crucial for protecting your investments.",
        choices: [
          {
            label: "Follow blindly",
            outcome:
              "Following investment advice blindly, especially from social media influencers, is extremely risky. Even well-intentioned influencers may not have your best interests at heart or the proper qualifications to give financial advice.",
          },
          {
            label: "Be cautious and research independently",
            outcome:
              "Social media investment tips often hide risks and may not be suitable for your financial situation. Always research independently, understand the risks, and consult qualified financial advisors before making investment decisions.",
          },
        ],
        reflections: [
          "How do you currently evaluate investment advice from social media?",
          "What steps can you take to verify the credibility of financial influencers?",
        ],
        skill: "Investment advice evaluation",
      },
    },
    {
      id: "finance-young-adult-85",
      title: "Fake Payment Screenshot",
      description:
        "A buyer shows a payment screenshot but money isn’t credited. What should you trust? Learn to verify payments properly.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-young-adult-85"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/fake-payment-screenshot",
      index: 84,
      scenario: {
        setup:
          "In online transactions, buyers may show payment screenshots to convince sellers they've paid. Learning to properly verify payments protects you from scams and financial loss.",
        choices: [
          {
            label: "Screenshot",
            outcome:
              "Screenshots can be easily faked or manipulated to show false information. They provide no real proof of payment and can be used to scam sellers by making them believe they've been paid when they haven't.",
          },
          {
            label: "Bank confirmation only",
            outcome:
              "Only bank confirmation through official channels like your online banking app, SMS notifications from your bank, or statements from your payment app provides real proof of payment. Always verify through trusted sources before shipping products.",
          },
        ],
        reflections: [
          "What verification steps do you currently take before shipping items in online sales?",
          "How can you better protect yourself from payment verification scams?",
        ],
        skill: "Payment verification",
      },
    },
    {
      id: "finance-young-adult-86",
      title: "Public Device Risk",
      description:
        "Is it safe to log into banking apps on shared devices? Learn to protect your financial information from device-based security threats.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-young-adult-86"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/public-device-risk",
      index: 85,
      scenario: {
        setup:
          "Shared devices like public computers and borrowed phones can pose significant security risks to your financial information. Understanding these risks helps protect your banking credentials and personal data.",
        choices: [
          {
            label: "Yes",
            outcome:
              "Logging into banking apps on shared devices is risky because these devices may have malware, keyloggers, or other security threats that can capture your login credentials and personal financial information.",
          },
          {
            label: "No, it risks data theft",
            outcome:
              "Shared devices compromise security by potentially exposing your login credentials, personal information, and financial data to unauthorized access, malware, or keyloggers that can capture sensitive information.",
          },
        ],
        reflections: [
          "What precautions do you currently take when accessing financial accounts on shared devices?",
          "How can you better protect your banking information when using public computers?",
        ],
        skill: "Device security awareness",
      },
    },
    {
      id: "finance-young-adult-87",
      title: "Loan Scam Warning",
      description:
        "A lender asks for upfront “processing fees” before approval. What should you do? Learn to identify and avoid loan scams.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-young-adult-87"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/loan-scam-warning",
      index: 86,
      scenario: {
        setup:
          "Loan scams often involve upfront fees, guaranteed approvals, and high-pressure tactics. Recognizing these warning signs protects you from financial loss and identity theft.",
        choices: [
          {
            label: "Pay quickly",
            outcome:
              "Paying upfront fees quickly to secure a loan is a major red flag for scams. Legitimate lenders don't require payment before approving loans, and rushing to pay fees often indicates you're falling for a fraudulent scheme.",
          },
          {
            label: "Avoid and verify legitimacy",
            outcome:
              "Upfront fee demands are scam indicators. Legitimate lenders make money from interest on loans, not upfront fees. Always verify a lender's legitimacy through official channels before providing any payment information.",
          },
        ],
        reflections: [
          "What steps do you currently take to verify the legitimacy of lenders?",
          "How can you better protect yourself from loan scams and fraudulent lending practices?",
        ],
        skill: "Loan scam detection",
      },
    },
    {
      id: "finance-young-adult-88",
      title: "Fake Customer Support",
      description:
        "You find a support number in a random comment section. Is it safe? Learn to identify and avoid fake customer support scams.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-young-adult-88"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/fake-customer-support",
      index: 87,
      scenario: {
        setup:
          "Fake customer support numbers found in comment sections and online forums are common scams designed to steal personal information and financial data. Learning to identify and avoid these scams protects you from data theft.",
        choices: [
          {
            label: "Yes",
            outcome:
              "Using a support number found in random comment sections is extremely risky. These numbers are often fake and lead to scammers who will try to steal your personal information, passwords, or money under the guise of helping you.",
          },
          {
            label: "No, use official sources only",
            outcome:
              "Fake support numbers steal data. Always use official support channels like the company's official website, app, or verified customer service numbers. Random comment sections are breeding grounds for fake support scams.",
          },
        ],
        reflections: [
          "What verification steps do you currently take before contacting customer support?",
          "How can you better protect yourself from fake support scams and fraudulent customer service?",
        ],
        skill: "Support scam detection",
      },
    },
    {
      id: "finance-young-adult-89",
      title: "Data Sharing Awareness",
      description:
        "Why should you limit sharing personal data online? Learn to protect your sensitive information from misuse and fraud.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-young-adult-89"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/data-sharing-awareness",
      index: 88,
      scenario: {
        setup:
          "Personal data shared online can be misused for fraud, identity theft, and financial crimes. Understanding what information to protect and how to share data responsibly is crucial for maintaining your financial and personal security.",
        choices: [
          {
            label: "It doesn't matter",
            outcome:
              "Sharing personal data online absolutely matters for your financial and personal security. Oversharing can lead to identity theft, financial fraud, and unauthorized access to your accounts. Your personal information is valuable to both legitimate businesses and criminals.",
          },
          {
            label: "Data can be misused for fraud",
            outcome:
              "Data protection is financial protection. Personal data can be misused for fraud, identity theft, and unauthorized financial transactions. Limiting what you share online protects your financial security and personal privacy.",
          },
        ],
        reflections: [
          "What personal data do you currently share online that might be unnecessary?",
          "How can you better protect your sensitive information from potential misuse?",
        ],
        skill: "Data protection awareness",
      },
    },
    {
      id: "finance-young-adult-90",
      title: "Fraud Safety Checkpoint",
      description:
        "Task: Identify and avoid scams in 7 digital scenarios. You can now recognize and avoid common financial scams.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-young-adult-90"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/fraud-safety-checkpoint",
      isBadgeGame: true,
      badgeName: "Badge: Fraud Safe",
      badgeImage: "/badges/finance/young-adult/FraudSafe.png",
      index: 89,
      scenario: {
        setup:
          "Financial scams come in many forms - from phishing emails to fake prize notifications. Learning to identify red flags and respond appropriately protects your financial security and personal information from fraudsters.",
        choices: [
          {
            label: "Click the link immediately to save your account",
            outcome:
              "Clicking links in suspicious emails is extremely dangerous. These are often phishing attempts designed to steal your login credentials and personal information. Legitimate companies rarely ask for sensitive information via email with urgent deadlines.",
          },
          {
            label: "Ignore the email and contact the company directly",
            outcome:
              "You can now recognize and avoid common financial scams. This is the safest approach. Contact the company through official channels like their verified website or customer service number to confirm if there's a real issue with your account.",
          },
        ],
        reflections: [
          "What red flags do you currently miss in suspicious communications?",
          "How can you better verify the legitimacy of urgent financial requests?",
        ],
        skill: "Fraud recognition skills",
      },
    },
    {
      id: "finance-young-adult-91",
      title: "Money and Integrity",
      description:
        "What matters most in financial life? Scenario: Short-term gain vs. Long-term integrity and trust. Outcome: Trust builds opportunities over time.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-young-adult-91"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/money-and-integrity",
      index: 90,
      scenario: {
        setup:
          "Financial decisions that align with your values and integrity create lasting opportunities and sustainable success. While short-term gains may be tempting, building trust through ethical behavior opens doors to better long-term outcomes.",
        choices: [
          {
            label: "Short-term gain",
            outcome:
              "While short-term gains can be tempting, focusing solely on immediate profits often leads to risky decisions and missed opportunities for sustainable wealth building. Quick gains rarely translate to long-term financial security or personal fulfillment.",
          },
          {
            label: "Long-term integrity and trust",
            outcome:
              "Trust builds opportunities over time. Maintaining integrity in your financial dealings creates lasting relationships, opens doors to better opportunities, and builds a reputation that can lead to sustainable success and wealth creation.",
          },
        ],
        reflections: [
          "What financial decisions have you made that align with your values?",
          "How can you better integrate integrity into your financial planning?",
        ],
        skill: "Ethical financial decision-making",
      },
    },
    {
      id: "finance-young-adult-92",
      title: "Borrowing with Responsibility",
      description:
        "Scenario: Borrowing is ethical when you plan to repay fully and on time. Outcome: Responsible borrowing protects reputation.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-young-adult-92"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/borrowing-with-responsibility",
      index: 91,
      scenario: {
        setup:
          "Responsible borrowing is fundamental to building trust and maintaining good financial relationships. Ethical borrowing practices protect your reputation, preserve relationships, and create opportunities for future financial needs when handled with integrity and planning.",
        choices: [
          {
            label: "You plan to repay fully and on time",
            outcome:
              "Responsible borrowing starts with a clear commitment to repay the full amount according to the agreed terms. This demonstrates respect for the lender's trust and maintains your financial integrity while building a positive borrowing history.",
          },
          {
            label: "You assume delays are acceptable",
            outcome:
              "Responsible borrowing protects reputation. Assuming delays are acceptable shows a lack of respect for the lender and the borrowing agreement. This approach can damage relationships, harm your credit reputation, and create financial stress for both parties involved.",
          },
        ],
        reflections: [
          "What borrowing decisions have you made that demonstrate responsibility?",
          "How can you better assess your ability to repay before taking loans?",
        ],
        skill: "Responsible borrowing practices",
      },
    },
    {
      id: "finance-young-adult-93",
      title: "Paying What You Owe",
      description:
        "Scenario: Repaying debts on time shows reliability and character. Outcome: Financial discipline reflects personal values.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-young-adult-93"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/paying-what-you-owe",
      index: 92,
      scenario: {
        setup:
          "Financial discipline in debt repayment is a cornerstone of personal integrity and financial success. Making timely payments demonstrates reliability, builds trust with creditors, and creates opportunities for better financial products and terms in the future.",
        choices: [
          {
            label: "Weakness",
            outcome:
              "Repaying debts on time is actually a sign of strength, discipline, and integrity. It demonstrates your ability to manage commitments, honor agreements, and maintain financial responsibility despite challenges or temptations to spend elsewhere.",
          },
          {
            label: "Reliability and character",
            outcome:
              "Financial discipline reflects personal values. Repaying debts on time demonstrates reliability, integrity, and strong character. It shows you can be trusted with financial responsibilities and builds a positive reputation with lenders and financial institutions.",
          },
        ],
        reflections: [
          "What debt repayment habits demonstrate your financial discipline?",
          "How can you better prioritize debt payments during financial challenges?",
        ],
        skill: "Debt management discipline",
      },
    },
    {
      id: "finance-young-adult-94",
      title: "Fair Use of Money",
      description:
        "Scenario: Using money meant for fees or rent for shopping is irresponsible. Outcome: Misusing funds creates future problems.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-young-adult-94"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/fair-use-of-money",
      index: 93,
      scenario: {
        setup:
          "Financial responsibility requires prioritizing essential expenses over discretionary spending. Misusing funds designated for important obligations like fees or rent can create serious consequences including late fees, damaged credit, and housing instability.",
        choices: [
          {
            label: "Acceptable",
            outcome:
              "Using money designated for essential expenses like fees or rent for shopping is financially irresponsible. This misallocation of funds can lead to missed payments, late fees, damaged credit, and potential eviction or loss of services. Essential expenses should always take priority over discretionary spending.",
          },
          {
            label: "Irresponsible",
            outcome:
              "Misusing funds creates future problems. Diverting money meant for essential expenses like fees or rent to shopping demonstrates poor financial planning and can result in serious consequences including late fees, damaged credit, housing instability, and additional financial stress.",
          },
        ],
        reflections: [
          "What budgeting habits help you prioritize essential expenses?",
          "How can you better balance needs and wants in your spending?",
        ],
        skill: "Financial prioritization",
      },
    },
    {
      id: "finance-young-adult-95",
      title: "Honesty in Financial Dealings",
      description:
        "Scenario: Hiding information to get benefits leads to long-term consequences. Outcome: Honesty protects future opportunities.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-young-adult-95"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/honesty-in-financial-dealings",
      index: 94,
      scenario: {
        setup:
          "Financial integrity requires honesty in all dealings, even when deception might provide short-term benefits. Hiding information or providing false details can lead to damaged relationships, lost opportunities, and legal consequences that far outweigh any temporary advantages.",
        choices: [
          {
            label: "Success",
            outcome:
              "Hiding information to gain financial benefits rarely leads to true success. While it might provide short-term gains, this approach creates a foundation of deception that can collapse under scrutiny, leading to damaged relationships, lost opportunities, and potential legal consequences that far outweigh any temporary advantages.",
          },
          {
            label: "Long-term consequences",
            outcome:
              "Honesty protects future opportunities. Hiding information to gain benefits almost always leads to long-term negative consequences including damaged trust, lost reputation, legal issues, and missed opportunities. The immediate gains are typically outweighed by the lasting damage to relationships and future prospects.",
          },
        ],
        reflections: [
          "What financial situations require you to choose between short-term gain and long-term integrity?",
          "How can you build a reputation for honesty in your financial dealings?",
        ],
        skill: "Ethical financial conduct",
      },
    },
    {
      id: "finance-young-adult-96",
      title: "Respecting Other People's Money",
      description:
        "Scenario: Borrowing from friends requires clear commitment and respect. Outcome: Respect preserves relationships.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-young-adult-96"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/respecting-other-peoples-money",
      index: 95,
      scenario: {
        setup:
          "Borrowing money from friends requires treating their financial resources with the same respect and seriousness you'd show a bank. Clear communication, realistic commitments, and reliable follow-through preserve both the money and the relationship.",
        choices: [
          {
            label: "Casual attitude",
            outcome:
              "Borrowing from friends with a casual attitude can damage relationships and create financial stress for both parties. Money matters, even between friends, should be handled with seriousness and respect to maintain trust and preserve the friendship.",
          },
          {
            label: "Clear commitment and respect",
            outcome:
              "Respect preserves relationships. Borrowing from friends requires clear communication about terms, realistic timelines, and genuine respect for their financial situation. This approach maintains trust and demonstrates that you value both the money and the relationship.",
          },
        ],
        reflections: [
          "What borrowing practices show respect for friends' financial situations?",
          "How can you maintain friendships while handling money matters responsibly?",
        ],
        skill: "Respectful financial relationships",
      },
    },
    {
      id: "finance-young-adult-97",
      title: "Digital Responsibility",
      description:
        "Scenario: Using someone else's card or account without consent is wrong and illegal. Outcome: Digital misuse has serious consequences.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-young-adult-97"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/digital-responsibility",
      index: 96,
      scenario: {
        setup:
          "Digital financial responsibility requires respecting others' financial privacy and security. Using someone else's card or account without explicit consent is fraud, identity theft, or unauthorized access - all serious legal violations with significant personal and financial consequences.",
        choices: [
          {
            label: "Normal",
            outcome:
              "Using someone else's card or account without their explicit consent is never normal - it's a serious violation of trust and privacy. This behavior can constitute fraud, identity theft, or unauthorized access, all of which have significant legal and financial consequences for both parties involved.",
          },
          {
            label: "Wrong and illegal",
            outcome:
              "Digital misuse has serious consequences. Using someone else's card or account without consent is wrong and illegal, constituting fraud, identity theft, or unauthorized access. These actions can result in criminal charges, civil liability, damaged relationships, and long-term financial and legal problems.",
          },
        ],
        reflections: [
          "What digital boundaries do you maintain to protect your own financial security?",
          "How can you better respect others' digital financial privacy and autonomy?",
        ],
        skill: "Digital financial integrity",
      },
    },
    {
      id: "finance-young-adult-98",
      title: "Financial Accountability",
      description:
        "Scenario: When mistakes happen, take responsibility and correct them. Outcome: Accountability builds maturity.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-young-adult-98"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/financial-accountability",
      index: 97,
      scenario: {
        setup:
          "Financial accountability requires taking responsibility for mistakes and working to correct them. Blaming others or making excuses prevents learning and growth, while accepting responsibility builds trust, credibility, and future opportunities for better financial management and relationships.",
        choices: [
          {
            label: "Blame others",
            outcome:
              "Blaming others for financial mistakes avoids personal responsibility and prevents learning from errors. This approach damages relationships, creates conflict, and stops personal growth. Taking ownership of mistakes, even when others contributed, demonstrates maturity and builds trust with financial partners and institutions.",
          },
          {
            label: "Take responsibility and correct them",
            outcome:
              "Accountability builds maturity. Taking responsibility for financial mistakes, identifying what went wrong, and actively working to correct the situation demonstrates integrity and financial maturity. This approach builds trust, strengthens relationships, and creates opportunities for learning and improvement.",
          },
        ],
        reflections: [
          "What financial accountability systems do you currently have in place?",
          "How can you better demonstrate financial responsibility in your daily money management?",
        ],
        skill: "Financial responsibility and integrity",
      },
    },
    {
      id: "finance-young-adult-99",
      title: "Reputation Matters",
      description:
        "Scenario: Financial reputation affects jobs, credit, and trust. Outcome: Reputation follows you for life.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-young-adult-99"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/reputation-matters",
      index: 98,
      scenario: {
        setup:
          "Financial reputation significantly impacts employment opportunities, credit approval, insurance rates, and personal relationships. Your financial behavior creates a lasting record that influences how others perceive your reliability and responsibility, affecting opportunities and advantages throughout your life.",
        choices: [
          {
            label: "Nothing",
            outcome:
              "Financial reputation affects far more than just money - it impacts your ability to get jobs, credit, housing, and build trust in personal and professional relationships. A poor financial reputation can limit opportunities and create barriers throughout your life, while a good reputation opens doors and creates advantages in many areas beyond just financial transactions.",
          },
          {
            label: "Jobs, credit, and trust",
            outcome:
              "Reputation follows you for life. Financial reputation significantly impacts employment opportunities, credit approval and terms, rental agreements, insurance rates, and personal relationships. Your financial behavior creates a track record that influences how others perceive your reliability and responsibility, affecting opportunities and advantages throughout your life.",
          },
        ],
        reflections: [
          "What steps can you take to improve your current financial reputation?",
          "How does your financial behavior impact your relationships with others?",
        ],
        skill: "Financial reputation management",
      },
    },
    {
      id: "finance-young-adult-100",
      title: "Ethical Finance Checkpoint",
      description:
        "Task: Demonstrate ethical decisions across multiple financial situations. Outcome: You are financially responsible, ethical, and ready for adult life.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-young-adult-100"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/ethical-finance-checkpoint",
      isBadgeGame: true,
      badgeName: "Badge: Ethical & Responsible Young Adult",
      badgeImage: "/badges/finance/young-adult/Ethical&ResponsibleYoungAdult.png",
      index: 99,
      scenario: {
        setup:
          "Ethical financial decision-making requires balancing personal interests with responsibility to others and society. This checkpoint tests your ability to make choices that demonstrate integrity, respect for others' property and wellbeing, and understanding of long-term financial consequences across various real-world scenarios.",
        choices: [
          {
            label: "Keep the money and throw away the cards",
            outcome:
              "Keeping money found in a wallet is theft, regardless of circumstances. The ethical choice involves returning all items to their rightful owner. This demonstrates integrity and respect for others' property, building the character foundation essential for financial responsibility and trust in adult relationships.",
          },
          {
            label: "Return everything to the owner or turn it into authorities",
            outcome:
              "You are financially responsible, ethical, and ready for adult life. Returning found property demonstrates the integrity and respect for others that forms the foundation of ethical financial behavior. This choice shows you understand that financial responsibility extends beyond personal gain to include respect for others' property and wellbeing.",
          },
        ],
        reflections: [
          "How do your daily financial choices reflect your ethical values?",
          "What support systems help you make responsible financial decisions?",
        ],
        skill: "Ethical financial decision-making",
      },
    },
  ];

  return financeYoungAdultGames;
};
