import { Coins, Wallet, Target, Banknote, Shield, Scale, Lock, CreditCard, BarChart3, Landmark, Award, CheckCircle, FileText, Briefcase, Check } from "lucide-react";
import buildIds from "../buildGameIds";

export const financegGameIdsAdults = buildIds("finance", "adults");

export const getFinanceAdultGames = (gameCompletionStatus) => {
  const financeAdultGames = [
    {
      id: "finance-adults-1",
      title: "Income vs Expense Reality",
      description:
        "₹18,000 income versus ₹20,000 expenses—what does this gap teach you?",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-1"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/income-vs-expense-reality",
      index: 0,
      scenario: {
        setup:
          "You earned ₹18,000 this month but your expenses total ₹20,000. This gap is a reality check on your budgeting habits.",
        choices: [
          {
            label: "You are saving money",
            outcome: "Consistent surplus builds security over time.",
          },
          {
            label: "You are spending more than you earn",
            outcome: "Recurring deficits will erode savings and stress future paychecks.",
          },
        ],
        reflections: [
          "What adjustments can you make to avoid overspending next month?",
          "Which expenses can wait until after you build a buffer?",
        ],
        skill: "Expense awareness",
      },
    },
    {
      id: "finance-adults-2",
      title: "What Is Financial Literacy?",
      description:
        "Financial literacy means making smart choices when earning, saving, spending, or borrowing.",
      icon: <Target className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-2"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/what-is-financial-literacy",
      index: 1,
      scenario: {
        setup:
          "Financial literacy helps people understand how to earn, spend, save, and borrow responsibly. Choose the most accurate statement.",
        choices: [
          {
            label: "Earn more money only",
            outcome: "Earning is vital, but literacy extends to managing that income.",
          },
          {
            label: "Manage earning, spending, saving, and borrowing wisely",
            outcome:
              "True financial literacy keeps balancing all aspects of money, not just earning.",
          },
        ],
        reflections: [
          "Why is managing your expenses just as important as earning income?",
          "How does borrowing fit into healthy money habits?",
        ],
        skill: "Holistic money awareness",
      },
    },
    {
      id: "finance-adults-3",
      title: "Needs vs Wants - Daily Choices",
      description:
        "Distinguish between needs and wants to protect your monthly budget.",
      icon: <Coins className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-3"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/needs-vs-wants",
      index: 2,
      scenario: {
        setup:
          "Scenario: You need to prioritize spending. Distinguishing needs from wants protects your monthly budget.",
        choices: [
          {
            label: "Select the need, not the want: Rent / Food",
            outcome: "Prioritizing needs protects your monthly budget.",
          },
          {
            label: "Choose a want over a need",
            outcome: "Prioritizing wants over needs can strain your finances.",
          },
        ],
        reflections: [
          "How can distinguishing needs from wants protect your monthly budget?",
          "What strategies will help you prioritize spending on necessities first?",
        ],
        skill: "Prioritizing needs over wants",
      },
    },
    {
      id: "finance-adults-4",
      title: "Fixed vs Variable Expenses",
      description:
        "Learn to distinguish between fixed and variable expenses to plan your budget safely.",
      icon: <Coins className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-4"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/fixed-vs-variable-expenses",
      index: 3,
      scenario: {
        setup:
          "Scenario: Understanding fixed vs variable expenses helps you plan safely.",
        choices: [
          {
            label: "Match correctly: House rent → Fixed expense",
            outcome: "Knowing fixed expenses helps you plan safely.",
          },
          {
            label: "Eating out → Variable expense",
            outcome: "Variable expenses can be adjusted based on your budget.",
          },
        ],
        reflections: [
          "How does knowing fixed expenses help you plan safely?",
          "What strategies will help you manage variable expenses effectively?",
        ],
        skill: "Understanding fixed vs variable expenses",
      },
    },
    {
      id: "finance-adults-5",
      title: "Salary Day Decision",
      description:
        "Learn to plan your salary allocation to reduce the need for borrowing later.",
      icon: <Coins className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-5"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/salary-day-decision",
      index: 4,
      scenario: {
        setup:
          "Scenario: Planning your salary allocation reduces the need for borrowing later.",
        choices: [
          {
            label: "Plan expenses and set aside savings",
            outcome: "Planning first reduces the need for borrowing later.",
          },
          {
            label: "Spend freely without planning",
            outcome: "Spending without planning can lead to financial difficulties.",
          },
        ],
        reflections: [
          "How does planning your salary allocation reduce the need for borrowing later?",
          "What strategies will help you implement the 'pay yourself first' approach?",
        ],
        skill: "Salary planning and borrowing prevention",
      },
    },
    {
      id: "finance-adults-6",
      title: "Spending Adjustment Test",
      description:
        "Learn to adjust spending before resorting to borrowing when facing small financial gaps.",
      icon: <Coins className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-6"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/spending-adjustment-test",
      index: 5,
      scenario: {
        setup:
          "Scenario: When expenses increase slightly, adjusting spending should come before borrowing.",
        choices: [
          {
            label: "Reduce or adjust spending",
            outcome: "Borrowing should never be the first response to small gaps.",
          },
          {
            label: "Take a loan",
            outcome: "Borrowing for small gaps creates unnecessary debt.",
          },
        ],
        reflections: [
          "Why should borrowing never be the first response to small financial gaps?",
          "How can adjusting spending help maintain financial stability?",
        ],
        skill: "Spending adjustment and borrowing avoidance",
      },
    },
    {
      id: "finance-adults-7",
      title: "Tracking Money Habits",
      description:
        "Learn to track your daily spending to reveal hidden money leaks.",
      icon: <Coins className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-7"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/tracking-money-habits",
      index: 6,
      scenario: {
        setup:
          "Scenario: Tracking spending reveals hidden money leaks.",
        choices: [
          {
            label: "Track daily spending",
            outcome: "Tracking spending reveals hidden money leaks.",
          },
          {
            label: "Ignore expenses",
            outcome: "Ignoring expenses means missing opportunities to save.",
          },
        ],
        reflections: [
          "How does tracking spending reveal hidden money leaks?",
          "What strategies will help you maintain consistent expense tracking?",
        ],
        skill: "Expense tracking and leak identification",
      },
    },
    {
      id: "finance-adults-8",
      title: "Savings vs Borrowing",
      description:
        "Learn to use savings instead of borrowing for emergencies to reduce dependence on credit.",
      icon: <Coins className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-8"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/savings-vs-borrowing",
      index: 7,
      scenario: {
        setup:
          "Scenario: Using savings instead of borrowing reduces dependence on credit.",
        choices: [
          {
            label: "Use savings if available",
            outcome: "Savings reduce dependence on credit.",
          },
          {
            label: "Borrow immediately",
            outcome: "Borrowing creates unnecessary debt for small emergencies.",
          },
        ],
        reflections: [
          "How does using savings instead of borrowing reduce dependence on credit?",
          "What strategies will help you maintain adequate emergency savings?",
        ],
        skill: "Savings over borrowing preference",
      },
    },
    {
      id: "finance-adults-9",
      title: "Monthly Budget Balance",
      description:
        "Learn to balance expenses within fixed income to prevent debt cycles.",
      icon: <Coins className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-9"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/monthly-budget-balance",
      index: 8,
      scenario: {
        setup:
          "Scenario: Balancing expenses within fixed income prevents debt cycles.",
        choices: [
          {
            label: "Balance expenses within income",
            outcome: "Balanced budgets prevent debt cycles.",
          },
          {
            label: "Increase spending",
            outcome: "Increasing spending beyond fixed income creates debt risk.",
          },
        ],
        reflections: [
          "How does balancing expenses within income prevent debt cycles?",
          "What strategies will help you maintain a balanced budget with fixed income?",
        ],
        skill: "Balanced budgeting and debt prevention",
      },
    },
    {
      id: "finance-adults-10",
      title: "Financial Discipline Checkpoint",
      description:
        "Complete 7 correct financial decisions to demonstrate basic money discipline.",
      icon: <Coins className="w-6 h-6" />,
      difficulty: "Hard",
      duration: "10 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-10"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/financial-discipline-checkpoint",
      index: 9,
      scenario: {
        setup:
          "Complete 7 correct financial decisions to demonstrate basic money discipline.",
        choices: [
          {
            label: "Complete 7 correct decisions",
            outcome: "You now understand basic money discipline and are ready to learn about banking and credit.",
          },
          {
            label: "Make fewer than 7 correct decisions",
            outcome: "Continue practicing financial discipline.",
          },
        ],
        reflections: [
          "How do these financial decisions demonstrate discipline?",
          "What habits will help you maintain financial discipline going forward?",
        ],
        skill: "Basic financial discipline",
      },
    },
    {
      id: "finance-adults-11",
      title: "Why a Bank Account Matters",
      description:
        "Learn about the importance of bank accounts for securing your income and accessing formal financial services.",
      icon: <Banknote className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-11"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/why-a-bank-account-matters",
      index: 10,
      scenario: {
        setup:
          "Learn about the importance of bank accounts for securing your income and accessing formal financial services.",
        choices: [
          {
            label: "Complete all correct answers",
            outcome: "Bank accounts protect money and enable access to formal services.",
          },
          {
            label: "Make some incorrect answers",
            outcome: "Continue learning about banking benefits.",
          },
        ],
        reflections: [
          "How do bank accounts protect money from theft or loss?",
          "What formal financial services become accessible through banking?",
        ],
        skill: "Banking security and services",
      },
    },
    {
      id: "finance-adults-12",
      title: "KYC Basics",
      description:
        "Learn about Know Your Customer (KYC) procedures and why banks require identity verification.",
      icon: <Shield className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-12"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/kyc-basics",
      index: 11,
      scenario: {
        setup:
          "Learn about Know Your Customer (KYC) procedures and why banks require identity verification.",
        choices: [
          {
            label: "Complete all correct answers",
            outcome: "KYC helps protect both you and the financial system.",
          },
          {
            label: "Make some incorrect answers",
            outcome: "Continue learning about KYC procedures.",
          },
        ],
        reflections: [
          "How does KYC protect both you and the financial system?",
          "What documents should you keep ready for banking procedures?",
        ],
        skill: "KYC procedures and identity verification",
      },
    },
    {
      id: "finance-adults-13",
      title: "Formal vs Informal Finance",
      description:
        "Learn about the differences between formal and informal financial services and why formal finance is safer.",
      icon: <Scale className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-13"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/formal-vs-informal-finance",
      index: 12,
      scenario: {
        setup:
          "Learn about the differences between formal and informal financial services and why formal finance is safer.",
        choices: [
          {
            label: "Complete all correct answers",
            outcome: "Formal finance follows rules; informal lending often carries hidden risks.",
          },
          {
            label: "Make some incorrect answers",
            outcome: "Continue learning about formal vs informal finance.",
          },
        ],
        reflections: [
          "How do regulations protect consumers in formal finance?",
          "What risks should you consider with informal lending?",
        ],
        skill: "Understanding of formal vs informal finance",
      },
    },
    {
      id: "finance-adults-14",
      title: "Digital Payments Safety",
      description:
        "Learn about safe practices when using digital payment methods like UPI and protecting your financial information.",
      icon: <Lock className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-14"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/digital-payments-safety",
      index: 13,
      scenario: {
        setup:
          "Learn about safe practices when using digital payment methods like UPI and protecting your financial information.",
        choices: [
          {
            label: "Complete all correct answers",
            outcome: "OTPs protect your money. Sharing them enables fraud.",
          },
          {
            label: "Make some incorrect answers",
            outcome: "Continue learning about digital payment safety.",
          },
        ],
        reflections: [
          "Why is it important to keep OTPs and PINs private?",
          "What steps should you take to protect your digital payments?",
        ],
        skill: "Digital payment safety awareness",
      },
    },
    {
      id: "finance-adults-15",
      title: "Multiple Accounts Confusion",
      description:
        "Learn about the importance of simplifying your banking by managing fewer accounts effectively.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-15"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/multiple-accounts-confusion",
      index: 14,
      scenario: {
        setup:
          "Learn about the importance of simplifying your banking by managing fewer accounts effectively.",
        choices: [
          {
            label: "Complete all correct answers",
            outcome: "Simpler banking improves control and reduces errors.",
          },
          {
            label: "Make some incorrect answers",
            outcome: "Continue learning about banking simplification.",
          },
        ],
        reflections: [
          "How does simplifying your banking accounts improve financial control?",
          "What are the risks of maintaining multiple unused accounts?",
        ],
        skill: "Banking simplification awareness",
      },
    },
    {
      id: "finance-adults-16",
      title: "Digital Wallet vs Bank Account",
      description:
        "Learn about the differences between digital wallets and bank accounts for various financial needs.",
      icon: <CreditCard className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-16"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/digital-wallet-vs-bank-account",
      index: 15,
      scenario: {
        setup:
          "Learn about the differences between digital wallets and bank accounts for various financial needs.",
        choices: [
          {
            label: "Complete all correct answers",
            outcome: "Wallets are for spending; banks are for storing money safely.",
          },
          {
            label: "Make some incorrect answers",
            outcome: "Continue learning about financial tools.",
          },
        ],
        reflections: [
          "How do digital wallets and bank accounts serve different financial needs?",
          "Why is it important to use the right tool for savings versus spending?",
        ],
        skill: "Understanding of financial tools",
      },
    },
    {
      id: "finance-adults-17",
      title: "Safe Use of Banking Apps",
      description:
        "Learn about the safe practices for using banking apps and protecting your financial information.",
      icon: <Shield className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-17"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/safe-use-of-banking-apps",
      index: 16,
      scenario: {
        setup:
          "Learn about the safe practices for using banking apps and protecting your financial information.",
        choices: [
          {
            label: "Complete all correct answers",
            outcome: "Official apps reduce risk of data theft.",
          },
          {
            label: "Make some incorrect answers",
            outcome: "Continue learning about banking app security.",
          },
        ],
        reflections: [
          "How can you verify that a banking app is legitimate?",
          "What additional security measures should you implement?",
        ],
        skill: "Banking app security awareness",
      },
    },
    {
      id: "finance-adults-18",
      title: "Cash vs Digital Records",
      description:
        "Learn about the benefits of digital transactions and how records help with budgeting and credit eligibility.",
      icon: <BarChart3 className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-18"] || false,
     isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/cash-vs-digital-records",
      index: 17,
      scenario: {
        setup:
          "Learn about the benefits of digital transactions and how records help with budgeting and credit eligibility.",
        choices: [
          {
            label: "Complete all correct answers",
            outcome: "Records help with budgeting and future credit eligibility.",
          },
          {
            label: "Make some incorrect answers",
            outcome: "Continue learning about digital transaction benefits.",
          },
        ],
        reflections: [
          "How do digital records contribute to better financial planning?",
          "What other benefits do digital transactions offer beyond record-keeping?",
        ],
        skill: "Understanding of digital transaction benefits",
      },
    },
    {
      id: "finance-adults-19",
      title: "Trusting the System",
      description:
        "Learn about the safety and regulation of banking systems and why regulated institutions are safer than informal storage.",
      icon: <Landmark className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-19"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/trusting-the-system",
      index: 18,
      scenario: {
        setup:
          "Learn about the safety and regulation of banking systems and why regulated institutions are safer than informal storage.",
        choices: [
          {
            label: "Complete all correct answers",
            outcome: "Regulated institutions are safer than informal storage.",
          },
          {
            label: "Make some incorrect answers",
            outcome: "Continue learning about banking regulation.",
          },
        ],
        reflections: [
          "How do regulations protect your money in banks?",
          "What should you look for when choosing a financial institution?",
        ],
        skill: "Understanding of banking regulation",
      },
    },
    {
      id: "finance-adults-20",
      title: "Banking Readiness Checkpoint",
      description:
        "Complete 7 correct banking and digital finance decisions to demonstrate readiness for credit and loans.",
      icon: <Award className="w-6 h-6" />,
      difficulty: "Hard",
      duration: "10 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-20"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/banking-readiness-checkpoint",
      index: 19,
      scenario: {
        setup:
          "Complete 7 correct banking and digital finance decisions to demonstrate readiness for credit and loans.",
        choices: [
          {
            label: "Complete 7 correct decisions",
            outcome: "You are now ready to understand credit and loans responsibly.",
          },
          {
            label: "Make fewer than 7 correct decisions",
            outcome: "Continue practicing banking fundamentals.",
          },
        ],
        reflections: [
          "How do these banking decisions prepare you for credit and loans?",
          "What habits will help you maintain financial discipline going forward?",
        ],
        skill: "Banking readiness",
      },
    },
    {
      id: "finance-adults-21",
      title: "What Is Credit?",
      description:
        "Learn the fundamental concept of credit and understand when credit is helpful versus harmful.",
      icon: <CreditCard className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-21"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/what-is-credit",
      index: 20,
      scenario: {
        setup:
          "Learn the fundamental concept of credit and understand when credit is helpful versus harmful.",
        choices: [
          {
            label: "Complete all correct answers",
            outcome: "Credit helps only when repayment is planned.",
          },
          {
            label: "Make some incorrect answers",
            outcome: "Continue learning about credit fundamentals.",
          },
        ],
        reflections: [
          "How can credit be used as a financial tool rather than a burden?",
          "What steps can you take to build good credit habits?",
        ],
        skill: "Credit fundamentals",
      },
    },
    {
      id: "finance-adults-22",
      title: "When Credit Is Useful",
      description:
        "Learn when borrowing is reasonable and how to evaluate credit decisions that support financial stability.",
      icon: <CheckCircle className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-22"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/when-credit-is-useful",
      index: 21,
      scenario: {
        setup:
          "Learn when borrowing is reasonable and how to evaluate credit decisions that support financial stability.",
        choices: [
          {
            label: "Complete all correct answers",
            outcome: "Credit should support stability, not habits.",
          },
          {
            label: "Make some incorrect answers",
            outcome: "Continue learning about responsible borrowing.",
          },
        ],
        reflections: [
          "How can you distinguish between needs and wants when considering credit?",
          "What criteria should you use to evaluate borrowing decisions?",
        ],
        skill: "Responsible borrowing evaluation",
      },
    },
    {
      id: "finance-adults-23",
      title: "Types of Loans",
      description:
        "Learn to distinguish between formal and informal lending options and understand regulated pricing benefits.",
      icon: <FileText className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-23"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/types-of-loans",
      index: 22,
      scenario: {
        setup:
          "Learn to distinguish between formal and informal lending options and understand regulated pricing benefits.",
        choices: [
          {
            label: "Complete all correct answers",
            outcome: "Formal loans follow regulated pricing.",
          },
          {
            label: "Make some incorrect answers",
            outcome: "Continue learning about loan types and protections.",
          },
        ],
        reflections: [
          "How can you identify formal vs informal lending opportunities?",
          "What factors should you consider when evaluating loan options?",
        ],
        skill: "Loan type comparison",
      },
    },
    {
      id: "finance-adults-24",
      title: "Personal vs Business Loan",
      description:
        "Learn to distinguish between personal and business loans and understand proper financing selection for business needs.",
      icon: <Briefcase className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-24"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/personal-vs-business-loan",
      index: 23,
      scenario: {
        setup:
          "Learn to distinguish between personal and business loans and understand proper financing selection for business needs.",
        choices: [
          {
            label: "Complete all correct answers",
            outcome: "Matching loan type to purpose reduces risk.",
          },
          {
            label: "Make some incorrect answers",
            outcome: "Continue learning about business financing options.",
          },
        ],
        reflections: [
          "How can proper loan type selection impact your business financing costs?",
          "What factors should guide your decision between personal and business financing?",
        ],
        skill: "Business financing selection",
      },
    },
    {
      id: "finance-adults-25",
      title: "Credit Eligibility Basics",
      description:
        "Learn the fundamental factors that improve loan eligibility and how financial discipline opens access to formal credit.",
      icon: <Check className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-adults-25"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/credit-eligibility-basics",
      index: 24,
      scenario: {
        setup:
          "Learn the fundamental factors that improve loan eligibility and how financial discipline opens access to formal credit.",
        choices: [
          {
            label: "Complete all correct answers",
            outcome: "Discipline improves access to formal credit.",
          },
          {
            label: "Make some incorrect answers",
            outcome: "Continue learning about credit eligibility factors.",
          },
        ],
        reflections: [
          "How can you build a strong repayment history over time?",
          "What daily financial habits support long-term credit eligibility?",
        ],
        skill: "Credit eligibility fundamentals",
      },
    },
    {
      id: "finance-adults-26",
      title: "Loan Rejection Reality",
      description:
        "Why do banks reject applications? Understand loan rejection reasons and turn setbacks into financial growth opportunities.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-adults-26"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/loan-rejection-reality",
      index: 25,
      scenario: {
        setup:
          "You've applied for a loan but received a rejection. Instead of feeling defeated, this game helps you understand what rejections really mean and how to use them for financial growth.",
        choices: [
          {
            label: "Poor repayment history or unclear income",
            outcome:
              "Banks assess risk based on your financial track record and ability to repay. A weak repayment history or unclear income sources signal higher risk.",
          },
          {
            label: "Random decisions",
            outcome:
              "Bank lending decisions are based on systematic risk assessment, not randomness. They follow established criteria to evaluate creditworthiness.",
          },
        ],
        reflections: [
          "How can loan rejections serve as valuable financial feedback rather than failures?",
          "What specific steps can you take to improve your creditworthiness after a rejection?",
        ],
        skill: "Loan rejection analysis",
      },
    },
    {
      id: "finance-adults-27",
      title: "Loan Amount Decision",
      description:
        "You qualify for ₹1,00,000 but only need ₹40,000. Learn to borrow only what you can repay comfortably.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-adults-27"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/loan-amount-decision",
      index: 26,
      scenario: {
        setup:
          "You've been approved for a loan amount much higher than your actual needs. This game teaches you to make responsible borrowing decisions.",
        choices: [
          {
            label: "Take the full ₹1,00,000 amount",
            outcome:
              "Taking more than you need increases your debt burden and monthly payments, making it harder to manage your finances responsibly.",
          },
          {
            label: "Take only the ₹40,000 you actually need",
            outcome:
              "Borrowing only what you need ensures manageable repayments and reduces financial stress.",
          },
        ],
        reflections: [
          "How can borrowing only what you need prevent future financial stress?",
          "What factors should guide your loan amount decisions beyond lender approval?",
        ],
        skill: "Responsible borrowing mindset",
      },
    },
    {
      id: "finance-adults-28",
      title: "Credit Is Not Income",
      description:
        "Credit should be treated as temporary support to be repaid, not extra income. Learn to avoid debt traps.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-adults-28"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/credit-is-not-income",
      index: 27,
      scenario: {
        setup:
          "Understanding the fundamental difference between credit and income is crucial for financial health. This game teaches you to avoid confusing borrowed money with earned income.",
        choices: [
          {
            label: "Extra income to spend freely",
            outcome:
              "Treating credit as income creates a dangerous mindset that leads to overspending and debt accumulation. Credit must be repaid with interest.",
          },
          {
            label: "Temporary support to be repaid",
            outcome:
              "Credit is borrowed money that must be repaid, not additional income. This distinction prevents debt traps.",
          },
        ],
        reflections: [
          "How can distinguishing between credit and income prevent financial mistakes?",
          "What mindset shifts help you treat credit as temporary support rather than income?",
        ],
        skill: "Credit-income distinction",
      },
    },
    {
      id: "finance-adults-29",
      title: "Multiple Loans Risk",
      description:
        "Taking many loans at once leads to higher repayment stress. Learn to avoid loan stacking and default risk.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-adults-29"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/multiple-loans-risk",
      index: 28,
      scenario: {
        setup:
          "Managing multiple loan obligations simultaneously creates significant financial stress. This game teaches you to recognize and avoid the dangers of loan stacking.",
        choices: [
          {
            label: "Faster growth and financial advancement",
            outcome:
              "While multiple loans might seem to accelerate goals, they actually create overwhelming repayment obligations that can derail financial progress.",
          },
          {
            label: "Higher repayment stress and financial burden",
            outcome:
              "Multiple loans multiply your monthly obligations, creating stress and increasing the risk of default.",
          },
        ],
        reflections: [
          "How can you assess whether you're taking on too much debt across multiple loans?",
          "What warning signs indicate you're approaching your borrowing capacity limits?",
        ],
        skill: "Multi-loan risk assessment",
      },
    },
    {
      id: "finance-adults-30",
      title: "Credit for Emergencies",
      description:
        "Is credit the first solution for emergencies? Learn why emergency funds reduce harmful borrowing.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-adults-30"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/credit-for-emergencies",
      index: 29,
      scenario: {
        setup:
          "Emergencies test financial preparedness. This game teaches you why emergency savings should precede credit reliance for crisis management.",
        choices: [
          {
            label: "Yes, credit provides immediate access to funds",
            outcome:
              "While credit offers quick access, it creates debt obligations with interest that compound financial stress during emergencies.",
          },
          {
            label: "No, savings should come first if possible",
            outcome:
              "Emergency savings provide immediate access without debt obligations, protecting your financial stability during crises.",
          },
        ],
        reflections: [
          "How can you start building emergency funds even with limited income?",
          "What's the minimum emergency fund size that would prevent harmful borrowing?",
        ],
        skill: "Emergency fund planning",
      },
    },
    {
      id: "finance-adults-31",
      title: "Trusting Loan Offers",
      description:
        "A lender promises 'guaranteed approval.' Learn why these offers often hide risks and require verification.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-adults-31"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/trusting-loan-offers",
      index: 30,
      scenario: {
        setup:
          "Lenders use 'guaranteed approval' to attract borrowers. This game teaches you to verify such promises and recognize hidden risks in seemingly attractive offers.",
        choices: [
          {
            label: "Accept immediately",
            outcome:
              "Guaranteed approval offers often hide unfavorable terms, high fees, or predatory conditions that can create serious financial problems.",
          },
          {
            label: "Be cautious and verify",
            outcome:
              "Guaranteed offers require thorough verification of terms, fees, and conditions to avoid hidden risks and unfavorable agreements.",
          },
        ],
        reflections: [
          "What specific documents should you request from any lender making guaranteed promises?",
          "How can you distinguish between legitimate fast approval and deceptive guaranteed offers?",
        ],
        skill: "Loan offer verification",
      },
    },
    {
      id: "finance-adults-32",
      title: "Credit Understanding Checkpoint",
      description:
        "Make 8 correct credit-related decisions. You now understand how credit works and when it should be used.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-adults-32"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/credit-understanding-checkpoint",
      index: 31,
      scenario: {
        setup:
          "This checkpoint tests your comprehensive understanding of credit fundamentals. Master these concepts to use credit responsibly and avoid common financial pitfalls.",
        choices: [
          {
            label: "Credit comes from lenders, income comes from work",
            outcome:
              "While this describes the source difference, the fundamental distinction is that income is yours to keep while credit must be repaid with interest.",
          },
          {
            label: "Income stays with you, credit must be repaid with interest",
            outcome:
              "This core difference is why credit should never be treated as income - it creates future financial obligations.",
          },
        ],
        reflections: [
          "How does understanding credit fundamentals prevent common financial mistakes?",
          "What specific behaviors indicate someone is treating credit responsibly versus irresponsibly?",
        ],
        skill: "Credit fundamentals mastery",
      },
    },
    {
      id: "finance-adults-33",
      title: "What Is Interest?",
      description:
        "Interest is the cost of borrowing money. Learn what you pay for using someone else's money.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-adults-33"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/what-is-interest",
      index: 32,
      scenario: {
        setup:
          "Understanding interest is fundamental to smart borrowing. This game explains what interest really is and how it affects your financial obligations.",
        choices: [
          {
            label: "A penalty",
            outcome:
              "While interest feels like a cost, it's not a punishment but the legitimate price lenders charge for providing financial resources when you need them.",
          },
          {
            label: "The cost of borrowing money",
            outcome:
              "Interest represents the fee you pay lenders for using their money, compensating them for the risk and opportunity cost of lending.",
          },
        ],
        reflections: [
          "How can understanding interest calculations help you make better borrowing decisions?",
          "What factors should you research before accepting any loan offer?",
        ],
        skill: "Interest calculation awareness",
      },
    },
    {
      id: "finance-adults-34",
      title: "Higher Loan, Higher Cost",
      description:
        "If you borrow more money, total interest usually increases. Learn how bigger loans mean higher repayment burden.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-adults-34"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/higher-loan-higher-cost",
      index: 33,
      scenario: {
        setup:
          "Understanding the direct relationship between loan size and total cost is crucial for responsible borrowing. This game demonstrates why bigger loans create proportionally higher financial burdens.",
        choices: [
          {
            label: "Interest stays the same",
            outcome:
              "Actually, larger loans typically generate more total interest because you're paying interest on a bigger principal amount over time.",
          },
          {
            label: "Total interest usually increases",
            outcome:
              "Bigger loans mean higher principal amounts, resulting in more total interest paid over the life of the loan.",
          },
        ],
        reflections: [
          "How can you calculate the true cost difference between loan sizes before borrowing?",
          "What strategies help you determine the minimum loan amount needed for your specific situation?",
        ],
        skill: "Loan size optimization",
      },
    },
    {
      id: "finance-adults-35",
      title: "EMI Meaning",
      description:
        "EMI stands for Equated Monthly Instalment. Learn how EMIs divide loan repayment into monthly amounts.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-adults-35"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/emi-meaning",
      index: 34,
      scenario: {
        setup:
          "Understanding EMI (Equated Monthly Instalment) is fundamental to loan management. This game explains how EMIs structure loan repayment into manageable monthly payments.",
        choices: [
          {
            label: "Easy Monthly Income",
            outcome:
              "Actually, EMI refers to loan repayment, not income generation. It's about systematically paying back borrowed money in manageable monthly amounts.",
          },
          {
            label: "Equated Monthly Instalment",
            outcome:
              "EMI is the fixed amount you pay each month to gradually repay your loan principal plus accumulated interest over the loan term.",
          },
        ],
        reflections: [
          "How can you calculate if an EMI fits within your monthly budget before taking a loan?",
          "What factors should you consider when choosing between different EMI options for the same loan amount?",
        ],
        skill: "EMI calculation and management",
      },
    },
    {
      id: "finance-adults-36",
      title: "EMI vs Income",
      description:
        "Which EMI is safer? Learn why EMIs that fit comfortably within income reduce stress and increase financial flexibility.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-adults-36"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/emi-vs-income",
      index: 35,
      scenario: {
        setup:
          "Balancing EMI payments with income is crucial for financial health. This game teaches you to recognize safe EMI levels that maintain flexibility and reduce financial stress.",
        choices: [
          {
            label: "EMI that fits comfortably within income",
            outcome:
              "An EMI that leaves adequate income for living expenses, savings, and emergencies provides financial stability and peace of mind.",
          },
          {
            label: "EMI that consumes most of income",
            outcome:
              "High EMIs that consume most of your income reduce financial flexibility, increase stress, and leave little room for unexpected expenses or opportunities.",
          },
        ],
        reflections: [
          "How can you calculate the maximum EMI that maintains your financial comfort and security?",
          "What warning signs indicate your EMI-to-income ratio has become unhealthy?",
        ],
        skill: "EMI-to-income ratio management",
      },
    },
    {
      id: "finance-adults-37",
      title: "Short Tenure vs Long Tenure",
      description:
        "Longer loan tenure usually means higher total interest. Learn why smaller EMIs over long periods cost more overall.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-adults-37"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/short-tenure-vs-long-tenure",
      index: 36,
      scenario: {
        setup:
          "Loan tenure selection significantly impacts total costs. This game explains the fundamental trade-off between monthly payment affordability and total interest expenses.",
        choices: [
          {
            label: "Lower total interest",
            outcome:
              "Actually, longer tenures typically mean higher total interest because you're paying interest on the principal for a longer period of time.",
          },
          {
            label: "Higher total interest due to extended payment period",
            outcome:
              "Smaller EMIs over long periods cost more overall because interest accumulates on the outstanding principal for more years.",
          },
        ],
        reflections: [
          "How can you calculate the total interest difference between short and long tenure options?",
          "What factors should influence your choice between lower monthly payments and lower total costs?",
        ],
        skill: "Loan tenure optimization",
      },
    },
    {
      id: "finance-adults-38",
      title: "Missed EMI Consequence",
      description:
        "What happens if you miss EMIs? Learn why penalties and credit damage affect future borrowing ability.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-adults-38"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/missed-emi-consequence",
      index: 37,
      scenario: {
        setup:
          "EMI payments are serious financial obligations. This game explains the severe consequences of missed payments and why consistent repayment is crucial for financial health.",
        choices: [
          {
            label: "Nothing serious",
            outcome:
              "Actually, missed EMIs have significant consequences including penalties, credit score damage, and potential legal action that can severely impact your financial future.",
          },
          {
            label: "Penalties and credit damage",
            outcome:
              "Missed payments trigger late fees, damage your credit score, and create barriers to future loan approvals, affecting your borrowing ability for years.",
          },
        ],
        reflections: [
          "How can you prepare for potential income disruptions to avoid missing EMIs?",
          "What steps should you take immediately if you anticipate difficulty making an EMI payment?",
        ],
        skill: "EMI payment discipline",
      },
    },
    {
      id: "finance-adults-39",
      title: "Prepayment Awareness",
      description:
        "Paying extra towards loan early can reduce interest burden. Learn why early repayment saves money when allowed.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-adults-39"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/prepayment-awareness",
      index: 38,
      scenario: {
        setup:
          "Strategic loan prepayment can significantly reduce total interest costs. This game explains when and how early repayment provides maximum financial benefits.",
        choices: [
          {
            label: "Reduce interest burden",
            outcome:
              "Early prepayment reduces the principal faster, which decreases the interest calculated on the remaining balance and shortens the overall loan period.",
          },
          {
            label: "Increase loan cost",
            outcome:
              "Actually, while some loans may have prepayment penalties, the fundamental benefit of early payment is interest reduction that typically outweighs any processing costs.",
          },
        ],
        reflections: [
          "How can you calculate the interest savings from different prepayment amounts?",
          "What factors should determine the optimal timing and amount for loan prepayments?",
        ],
        skill: "Strategic loan prepayment",
      },
    },
    {
      id: "finance-adults-40",
      title: "Fixed vs Variable Interest",
      description:
        "Which loan has predictable EMIs? Learn why fixed interest loans help with budgeting and financial planning.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-adults-40"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/fixed-vs-variable-interest",
      index: 39,
      scenario: {
        setup:
          "Interest rate structure significantly impacts loan payment predictability. This game explains the differences between fixed and variable rates and their budgeting implications.",
        choices: [
          {
            label: "Fixed interest loan",
            outcome:
              "Fixed interest loans maintain the same interest rate throughout the loan term, providing predictable, consistent EMIs that make budgeting straightforward.",
          },
          {
            label: "Variable interest loan",
            outcome:
              "Variable interest loans have rates that change with market conditions, causing EMIs to fluctuate up and down, making long-term budgeting challenging and unpredictable.",
          },
        ],
        reflections: [
          "How can you evaluate whether you can handle potential payment increases with variable rate loans?",
          "What factors should determine your choice between fixed and variable interest rates for different loan purposes?",
        ],
        skill: "Interest rate risk assessment",
      },
    },
    {
      id: "finance-adults-41",
      title: "Hidden Charges",
      description:
        "Loan cost includes processing fees and charges beyond EMIs. Learn why you should always check the full cost, not just EMI.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-adults-41"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/hidden-charges",
      index: 40,
      scenario: {
        setup:
          "Loan advertisements often emphasize low EMIs while hiding additional costs. This game teaches you to identify and evaluate all loan charges for accurate cost assessment.",
        choices: [
          {
            label: "Only EMI",
            outcome:
              "Actually, loan costs typically include various fees and charges beyond the monthly EMI. Focusing only on EMI can lead to underestimating the true total cost of borrowing.",
          },
          {
            label: "Processing fees, penalties, and charges",
            outcome:
              "Always check the full cost breakdown including processing fees, documentation charges, prepayment penalties, and other applicable fees that significantly increase the total loan expense.",
          },
        ],
        reflections: [
          "How can you identify and calculate all potential fees before signing a loan agreement?",
          "What questions should you ask lenders to uncover hidden charges in loan offers?",
        ],
        skill: "Loan cost transparency",
      },
    },
    {
      id: "finance-adults-42",
      title: "EMI Discipline",
      description:
        "Best habit for EMI safety is paying on or before due date every month. Learn why timely payment protects credit history.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-adults-42"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/emi-discipline",
      index: 41,
      scenario: {
        setup:
          "EMI payment discipline is fundamental to financial health. This game explains why consistent, timely payments are crucial for credit protection and future financial opportunities.",
        choices: [
          {
            label: "Pay whenever possible",
            outcome:
              "Actually, irregular payment timing can lead to missed due dates, late fees, and credit score damage. Consistent, timely payments are essential for financial discipline and credit protection.",
          },
          {
            label: "Pay on or before due date every month",
            outcome:
              "Timely payment is the cornerstone of EMI discipline. It protects your credit history, avoids penalties, and demonstrates financial reliability to lenders and future creditors.",
          },
        ],
        reflections: [
          "How can you set up automatic payment systems to ensure consistent EMI fulfillment?",
          "What backup plans should you have if automatic payments fail or accounts have insufficient funds?",
        ],
        skill: "Payment discipline mastery",
      },
    },
    {
      id: "finance-adults-43",
      title: "Loan Restructuring Awareness",
      description:
        "If income drops suddenly, talk to lender early for options. Learn why early communication prevents defaults.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-adults-43"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/loan-restructuring-awareness",
      index: 42,
      scenario: {
        setup:
          "Income disruptions can threaten loan obligations. This game teaches proactive approaches to financial hardship and lender communication strategies for sustainable solutions.",
        choices: [
          {
            label: "Ignore EMIs",
            outcome:
              "Actually, ignoring payment obligations leads to missed payments, penalties, credit damage, and potential legal action. Proactive communication with lenders is essential for finding viable solutions.",
          },
          {
            label: "Talk to lender early for options",
            outcome:
              "Early communication prevents defaults and opens doors to payment holidays, reduced EMIs, extended tenures, or other restructuring options that protect your financial situation.",
          },
        ],
        reflections: [
          "How can you prepare documentation to support your restructuring request?",
          "What are the key points to communicate when discussing financial hardship with lenders?",
        ],
        skill: "Financial hardship management",
      },
    },
    {
      id: "finance-adults-44",
      title: "Repayment Readiness Checkpoint",
      description:
        "Make 5 correct decisions related to interest and repayment. Learn how loan costs and repayments work comprehensively.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Hard",
      duration: "7 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-adults-44"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/repayment-readiness-checkpoint",
      index: 43,
      scenario: {
        setup:
          "Comprehensive assessment of loan understanding and repayment readiness. This checkpoint evaluates your knowledge of loan costs, payment strategies, and financial responsibility principles.",
        choices: [
          {
            label: "Calculate total loan cost including all fees",
            outcome:
              "Understanding the complete financial obligation including principal, interest, processing fees, and other charges ensures you can make informed borrowing decisions and realistic repayment plans.",
          },
          {
            label: "Pay EMIs consistently and on time",
            outcome:
              "Timely payments protect your credit history, avoid penalties, and demonstrate financial reliability. Payment consistency is fundamental to successful loan management and future borrowing capacity.",
          },
        ],
        reflections: [
          "How can you calculate the true total cost of a loan before borrowing?",
          "What emergency planning should accompany loan repayment commitments?",
        ],
        skill: "Loan repayment proficiency",
      },
    },
    {
      id: "finance-adults-45",
      title: "Borrowing as Last Option",
      description:
        "You face a temporary cash gap. Learn why borrowing should be the last step, not the first.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-adults-45"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/borrowing-as-last-option",
      index: 44,
      scenario: {
        setup:
          "Temporary financial gaps are common but don't always require borrowing. This game teaches responsible approaches to cash flow management and when debt becomes appropriate.",
        choices: [
          {
            label: "Immediate loan",
            outcome:
              "Actually, borrowing should be the last resort after exhausting other options. Taking on debt for temporary gaps creates unnecessary interest costs and financial obligations that could be avoided through better planning.",
          },
          {
            label: "Expense adjustment or savings use",
            outcome:
              "Adjusting expenses or using emergency savings should always come before borrowing. This approach avoids debt costs and maintains financial flexibility for genuine emergencies that truly require external funding.",
          },
        ],
        reflections: [
          "How can you build emergency funds to avoid unnecessary borrowing?",
          "What expense reduction strategies should you implement before considering debt?",
        ],
        skill: "Responsible borrowing judgment",
      },
    },
    {
      id: "finance-adults-46",
      title: "Over-Borrowing Risk",
      description:
        "Taking a loan larger than needed usually leads to higher repayment stress. Learn why bigger loans increase risk without extra benefit.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-adults-46"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/over-borrowing-risk",
      index: 45,
      scenario: {
        setup:
          "Bigger loans sound appealing but often create disproportionate financial burden. This game teaches the risks of over-borrowing and the importance of precise loan sizing.",
        choices: [
          {
            label: "Faster growth",
            outcome:
              "Actually, bigger loans don't accelerate growth—they create unnecessary debt burden. Excess borrowing increases monthly obligations without providing proportional benefits, leading to higher repayment stress rather than advancement.",
          },
          {
            label: "Higher repayment stress",
            outcome:
              "Larger loans mean higher EMIs, more interest payments, and greater financial commitment. The extra borrowed amount creates disproportionate stress without delivering additional value or benefits.",
          },
        ],
        reflections: [
          "How can you calculate the exact amount needed before borrowing?",
          "What buffer percentage is reasonable for unexpected variations?",
        ],
        skill: "Precise loan sizing judgment",
      },
    },
    {
      id: "finance-adults-47",
      title: "Loan Stacking Danger",
      description:
        "Taking multiple loans at the same time causes confusing repayments and defaults. Learn why loan stacking is a common debt trap.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Hard",
      duration: "7 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-adults-47"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/loan-stacking-danger",
      index: 46,
      scenario: {
        setup:
          "Multiple concurrent loans seem manageable but create exponential risk. This game teaches why loan stacking is dangerous and how strategic consolidation provides better financial outcomes.",
        choices: [
          {
            label: "Better flexibility",
            outcome:
              "Actually, multiple simultaneous loans reduce rather than enhance flexibility. Managing multiple payment schedules, due dates, and varying interest rates creates complexity that constrains financial maneuverability and increases stress rather than providing genuine flexibility.",
          },
          {
            label: "Confusing repayments and defaults",
            outcome:
              "Multiple loans create payment confusion with different due dates, varying interest rates, and complex tracking requirements. This complexity significantly increases the likelihood of missed payments, late fees, and eventual defaults that can severely damage credit scores.",
          },
        ],
        reflections: [
          "How can you consolidate multiple financial needs into single appropriate loans?",
          "What warning signs indicate you're taking on too many concurrent obligations?",
        ],
        skill: "Strategic debt consolidation",
      },
    },
    {
      id: "finance-adults-48",
      title: "Borrowing for Wants",
      description:
        "Is it wise to borrow for luxury spending? Learn why borrowing for wants leads to long-term stress and unnecessary debt.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-adults-48"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/borrowing-for-wants",
      index: 47,
      scenario: {
        setup:
          "Luxury temptations are everywhere, but borrowing for wants creates lasting financial stress. This game teaches why debt-financed consumption undermines long-term financial security and happiness.",
        choices: [
          {
            label: "Yes",
            outcome:
              "Actually, borrowing for luxury creates long-term financial stress. The temporary enjoyment comes at the cost of ongoing debt obligations, interest payments, and reduced financial flexibility that can last for years, ultimately diminishing rather than enhancing your quality of life.",
          },
          {
            label: "No, it creates unnecessary debt",
            outcome:
              "Borrowing for wants means paying interest on items that provide temporary satisfaction while creating lasting financial obligations. The debt burden reduces your ability to save, invest, and handle genuine needs, turning short-term pleasure into long-term financial stress.",
          },
        ],
        reflections: [
          "How can you distinguish between needs and wants in financial decisions?",
          "What saving strategies help you purchase luxuries without debt?",
        ],
        skill: "Disciplined consumption planning",
      },
    },
    {
      id: "finance-adults-49",
      title: "Income Stability Check",
      description:
        "When is borrowing safer? Learn why stable and predictable income supports disciplined repayment and makes borrowing much safer.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-adults-49"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/income-stability-check",
      index: 48,
      scenario: {
        setup:
          "Income predictability determines borrowing safety. This game teaches why stable income enables responsible debt management and how to assess your repayment capability before taking on financial obligations.",
        choices: [
          {
            label: "With stable and predictable income",
            outcome:
              "Stable income provides reliable cash flow for consistent loan payments. Predictable earnings enable accurate budgeting, reduce default risk, and demonstrate financial responsibility to lenders, making borrowing much safer and more manageable for both borrower and lender.",
          },
          {
            label: "With uncertain income",
            outcome:
              "Uncertain income makes borrowing risky. Irregular earnings create difficulty predicting payment ability, increase default probability, and generate financial stress. The unpredictability of cash flow means you might struggle to meet obligations during lean periods, making debt potentially dangerous rather than helpful.",
          },
        ],
        reflections: [
          "How can you assess your income stability before taking on debt obligations?",
          "What emergency planning should accompany variable income borrowing decisions?",
        ],
        skill: "Income stability assessment",
      },
    },
    {
      id: "finance-adults-50",
      title: "Peer Pressure Loans",
      description:
        "Friends encourage you to take a loan. Learn why borrowing decisions must be personal and realistic, not influenced by peer pressure.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 10,
      xp: 20,
      completed: gameCompletionStatus["finance-adults-50"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/peer-pressure-loans",
      index: 49,
      scenario: {
        setup:
          "Social influence can cloud financial judgment. This game teaches how to make independent borrowing decisions based on personal circumstances rather than peer recommendations or social pressure.",
        choices: [
          {
            label: "Their advice",
            outcome:
              "Actually, friends' advice shouldn't drive your borrowing decisions. While their intentions may be good, they don't bear the financial consequences of your loan obligations. Personal financial decisions must be based on your own circumstances, repayment capacity, and long-term financial goals rather than peer influence.",
          },
          {
            label: "Your repayment ability",
            outcome:
              "Borrowing decisions must be personal and realistic, based solely on your income, expenses, credit situation, and genuine need. Friends may have different financial circumstances, risk tolerance, and obligations, making their advice potentially inappropriate for your specific situation.",
          },
        ],
        reflections: [
          "How can you politely decline peer financial recommendations while maintaining relationships?",
          "What personal financial factors should guide your borrowing decisions regardless of peer influence?",
        ],
        skill: "Financial independence",
      },
    },
    {
      id: "finance-adults-51",
      title: "Emergency vs Lifestyle Loans",
      description:
        "Scenario: Which borrowing is more justified? (A) Emergency medical need or (B) Lifestyle upgrade. Outcome: Emergencies justify credit more than comfort.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-adults-51"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/emergency-vs-lifestyle-loans",
      index: 50,
      scenario: {
        setup:
          "You need to distinguish between borrowing for emergencies versus lifestyle upgrades. This game helps you understand when credit is justified.",
        choices: [
          {
            label: "Emergency medical need",
            outcome:
              "Emergencies justify credit more than comfort purchases.",
          },
          {
            label: "Lifestyle upgrade",
            outcome:
              "Lifestyle upgrades are wants, not needs that justify credit.",
          },
        ],
        reflections: [
          "How can you distinguish between genuine emergencies and lifestyle wants?",
          "What criteria should guide your borrowing decisions in difficult times?",
        ],
        skill: "Emergency vs Lifestyle Credit Judgment",
      },
    },
    {
      id: "finance-adults-52",
      title: "Repayment Capacity Test",
      description:
        "Scenario: Which EMI is risky? (A) EMI below 20–30% of income or (B) EMI above 50% of income. Outcome: High EMIs reduce financial safety.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-adults-52"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/repayment-capacity-test",
      index: 51,
      scenario: {
        setup:
          "You need to understand how to assess your repayment capacity for loans. This game helps you determine safe EMI percentages relative to your income.",
        choices: [
          {
            label: "EMI below 20-30% of income",
            outcome:
              "EMIs below 30% of income are generally considered safe and manageable.",
          },
          {
            label: "EMI above 50% of income",
            outcome:
              "EMIs above 50% of income are risky and reduce financial safety.",
          },
        ],
        reflections: [
          "How can you calculate your EMI capacity before taking a loan?",
          "What factors should influence your EMI affordability decisions?",
        ],
        skill: "EMI Capacity Assessment",
      },
    },
    {
      id: "finance-adults-53",
      title: "Borrowing Frequency",
      description:
        "Scenario: Frequent borrowing usually signals: (A) Smart money use or (B) Poor financial planning. Outcome: Frequent loans indicate deeper issues.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-adults-53"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/borrowing-frequency",
      index: 52,
      scenario: {
        setup:
          "You need to understand the implications of frequent borrowing. This game helps you recognize when borrowing frequency indicates financial issues.",
        choices: [
          {
            label: "Smart money use",
            outcome:
              "Frequent borrowing usually indicates poor financial planning rather than smart money use.",
          },
          {
            label: "Poor financial planning",
            outcome:
              "Frequent loans indicate deeper financial issues and poor planning.",
          },
        ],
        reflections: [
          "How can you assess your borrowing frequency and its impact on your finances?",
          "What strategies can help reduce the need for frequent borrowing?",
        ],
        skill: "Borrowing Frequency Awareness",
      },
    },
    {
      id: "finance-adults-54",
      title: "Loan Purpose Clarity",
      description:
        "Scenario: Why should loan purpose be clear? (A) For lender only or (B) To ensure money is used wisely. Outcome: Clear purpose improves repayment success.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-adults-54"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/loan-purpose-clarity",
      index: 53,
      scenario: {
        setup:
          "You need to understand why loan purpose clarity is important. This game helps you recognize how clear purpose improves loan success.",
        choices: [
          {
            label: "For lender only",
            outcome:
              "While lenders need to know purpose, clarity is equally important for the borrower to ensure responsible use.",
          },
          {
            label: "To ensure money is used wisely",
            outcome:
              "Clear purpose improves repayment success by ensuring funds are used as intended.",
          },
        ],
        reflections: [
          "How can you ensure your loan purpose is specific and achievable?",
          "What steps should you take to monitor proper use of borrowed funds?",
        ],
        skill: "Loan Purpose Clarity",
      },
    },
    {
      id: "finance-adults-55",
      title: "Ignoring Warning Signs",
      description:
        "Scenario: Which is a warning sign? (A) Difficulty paying EMIs or (B) Comfortable repayment (reverse logic). Outcome: Early warning signs must be addressed quickly.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-adults-55"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/ignoring-warning-signs",
      index: 54,
      scenario: {
        setup:
          "You need to understand the importance of recognizing and addressing early warning signs in loan repayment. This game helps you identify these signs.",
        choices: [
          {
            label: "Difficulty paying EMIs",
            outcome:
              "Difficulty paying EMIs is a clear warning sign that needs immediate attention.",
          },
          {
            label: "Comfortable repayment",
            outcome:
              "Comfortable repayment is a positive sign, not a warning sign.",
          },
        ],
        reflections: [
          "How can you identify early warning signs of financial difficulty?",
          "What steps should you take when you notice potential repayment issues?",
        ],
        skill: "Warning Sign Recognition",
      },
    },
    {
      id: "finance-adults-56",
      title: "Emotional Borrowing",
      description:
        "Scenario: Borrowing during emotional stress often leads to: (A) Good decisions or (B) Regret later. Outcome: Calm decisions protect financial health.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-adults-56"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/emotional-borrowing",
      index: 55,
      scenario: {
        setup:
          "You need to understand how emotional stress affects borrowing decisions. This game helps you recognize the impact of emotions on financial choices.",
        choices: [
          {
            label: "Good decisions",
            outcome:
              "Emotional stress often clouds judgment and leads to poor financial decisions.",
          },
          {
            label: "Regret later",
            outcome:
              "Calm decisions protect financial health and help avoid borrowing regrets.",
          },
        ],
        reflections: [
          "How can you recognize when emotions are influencing your financial decisions?",
          "What strategies can help you make borrowing decisions when feeling stressed?",
        ],
        skill: "Emotional Borrowing Awareness",
      },
    },
    {
      id: "finance-adults-57",
      title: "Saying No to Credit",
      description:
        "Scenario: Is it okay to reject a loan offer? (A) No or (B) Yes, if it's unnecessary or risky. Outcome: Saying no is a financial strength.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-adults-57"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/saying-no-to-credit",
      index: 56,
      scenario: {
        setup:
          "You need to understand when it's appropriate to reject credit offers. This game helps you recognize that saying no can be a sign of financial strength.",
        choices: [
          {
            label: "No",
            outcome:
              "Actually, rejecting unnecessary or risky loans is a sign of financial wisdom.",
          },
          {
            label: "Yes, if it's unnecessary or risky",
            outcome:
              "Saying no to unnecessary or risky credit is a sign of financial strength.",
          },
        ],
        reflections: [
          "How can you evaluate whether a loan offer aligns with your financial goals?",
          "What factors should you consider before accepting a loan offer?",
        ],
        skill: "Credit Rejection Strength",
      },
    },
    {
      id: "finance-adults-58",
      title: "Responsible Borrowing Checkpoint",
      description:
        "Task: Avoid risky borrowing in 9 scenarios. Outcome Message: You can now recognise and avoid harmful borrowing patterns.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Hard",
      duration: "8 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-adults-58"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/responsible-borrowing-checkpoint",
      index: 57,
      scenario: {
        setup:
          "This checkpoint tests your ability to recognize and avoid risky borrowing patterns in various scenarios.",
        choices: [
          {
            label: "Recognize and avoid harmful borrowing patterns",
            outcome:
              "You can now recognise and avoid harmful borrowing patterns.",
          },
          {
            label: "Continue with risky borrowing",
            outcome:
              "Need more practice to identify harmful borrowing patterns.",
          },
        ],
        reflections: [
          "How can you evaluate if a borrowing decision is truly necessary?",
          "What steps should you take before agreeing to any loan?",
        ],
        skill: "Responsible Borrowing",
      },
    },
    {
      id: " finance-adults-59",
      title: "Instant Loan Temptation",
      description:
        "Scenario: An app offers 'Instant loan in 5 minutes.' What should you do first? (A) Accept immediately or (B) Check legitimacy and terms. Outcome: Speed often hides risk in digital lending.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-adults-59"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/instant-loan-temptation",
      index: 58,
      scenario: {
        setup:
          "You need to understand how to approach instant loan offers from digital platforms. This game helps you recognize potential risks in fast lending services.",
        choices: [
          {
            label: "Accept immediately",
            outcome:
              "Accepting immediately without checking details can lead to hidden risks and unfavorable terms.",
          },
          {
            label: "Check legitimacy and terms",
            outcome:
              "Speed often hides risk in digital lending, so verification is essential.",
          },
        ],
        reflections: [
          "How can you verify the legitimacy of digital lending platforms?",
          "What red flags should you watch for in instant loan offers?",
        ],
        skill: "Digital Lending Caution",
      },
    },
    {
      id: "finance-adults-60",
      title: "App Permission Check",
      description:
        "Scenario: A loan app asks access to contacts and photos. Is this safe? (A) Yes or (B) No, it's a red flag. Outcome: Excess permissions enable harassment and misuse.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-adults-60"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/app-permission-check",
      index: 59,
      scenario: {
        setup:
          "You need to understand how to evaluate permission requests from loan apps. This game helps you recognize potential privacy risks.",
        choices: [
          {
            label: "Yes",
            outcome:
              "Actually, legitimate lending apps typically don't need access to personal photos or contacts for loan processing.",
          },
          {
            label: "No, it's a red flag",
            outcome:
              "Excess permissions enable harassment and misuse of your personal data.",
          },
        ],
        reflections: [
          "How can you evaluate if app permission requests are legitimate?",
          "What steps should you take to protect your privacy when using financial apps?",
        ],
        skill: "App Permission Awareness",
      },
    },
    {
      id: "finance-adults-61",
      title: "Official vs Fake Apps",
      description:
        "Scenario: How do you identify a safer app? (A) Random download link or (B) Official app store + verified developer. Outcome: Verified sources reduce fraud risk.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-adults-61"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/official-vs-fake-apps",
      index: 60,
      scenario: {
        setup:
          "You need to understand how to identify authentic financial apps. This game helps you recognize trusted sources.",
        choices: [
          {
            label: "Random download link",
            outcome:
              "Random download links are often sources of fake or malicious apps that can compromise your security.",
          },
          {
            label: "Official app store + verified developer",
            outcome:
              "Verified sources reduce fraud risk and provide more security assurance.",
          },
        ],
        reflections: [
          "How can you verify the authenticity of financial apps before downloading?",
          "What indicators should you look for to ensure app safety?",
        ],
        skill: "App Authentication Awareness",
      },
    },
    {
      id: "finance-adults-62",
      title: "Guaranteed Approval Claim",
      description:
        "Scenario: An app promises 'Guaranteed approval, no checks.' What does this mean? (A) Helpful service or (B) High-risk lending trap. Outcome: No-check loans often lead to abuse.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-adults-62"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/guaranteed-approval-claim",
      index: 61,
      scenario: {
        setup:
          "You need to understand how to recognize predatory lending practices. This game helps you identify suspicious loan offers.",
        choices: [
          {
            label: "Helpful service",
            outcome:
              "Actually, 'no checks' means they're not assessing your ability to repay, which can lead to problematic debt.",
          },
          {
            label: "High-risk lending trap",
            outcome:
              "No-check loans often lead to abuse and exploitative terms.",
          },
        ],
        reflections: [
          "How can you identify predatory lending practices in loan offers?",
          "What questions should you ask before accepting any loan?",
        ],
        skill: "Predatory Lending Awareness",
      },
    },
    {
      id: "finance-adults-63",
      title: "Data Privacy Awareness",
      description:
        "Scenario: Why is data privacy important in loan apps? (A) It's not important or (B) Personal data can be misused. Outcome: Data misuse causes long-term harm.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-adults-63"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/data-privacy-awareness",
      index: 62,
      scenario: {
        setup:
          "You need to understand the importance of data privacy in financial apps. This game helps you recognize potential risks.",
        choices: [
          {
            label: "It's not important",
            outcome:
              "Actually, data privacy is crucial as personal information can be misused for various purposes.",
          },
          {
            label: "Personal data can be misused",
            outcome:
              "Data misuse causes long-term harm and should be prevented.",
          },
        ],
        reflections: [
          "How can you protect your personal data when using financial apps?",
          "What data minimization practices should you follow?",
        ],
        skill: "Data Privacy Protection",
      },
    },
    {
      id: "finance-adults-64",
      title: "Harassment Warning",
      description:
        "Scenario: What should you do if a lender threatens or harasses you? (A) Stay silent or (B) Seek help and report. Outcome: Harassment is illegal and must be addressed.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-adults-64"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/harassment-warning",
      index: 63,
      scenario: {
        setup:
          "You need to understand how to respond to lender harassment. This game helps you recognize appropriate actions.",
        choices: [
          {
            label: "Stay silent",
            outcome:
              "Staying silent allows harassment to continue and doesn't protect your rights or safety.",
          },
          {
            label: "Seek help and report",
            outcome:
              "Harassment is illegal and must be addressed through appropriate channels.",
          },
        ],
        reflections: [
          "What steps should you take if you experience harassment from lenders?",
          "How can you protect your rights when facing loan-related harassment?",
        ],
        skill: "Harassment Response Awareness",
      },
    },
    {
      id: "finance-adults-65",
      title: "Reading Terms Carefully",
      description:
        "Scenario: Before accepting a digital loan, what must you read? (A) Only the loan amount or (B) Interest, fees, and repayment terms. Outcome: Hidden terms cause repayment shock.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-adults-65"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/reading-terms-carefully",
      index: 64,
      scenario: {
        setup:
          "You need to understand the importance of reading loan terms carefully. This game helps you recognize why thorough review of terms is essential before accepting any loan.",
        choices: [
          {
            label: "Only the loan amount",
            outcome:
              "Focusing only on the loan amount can lead to repayment shock when hidden fees and terms surface later.",
          },
          {
            label: "Interest, fees, and repayment terms",
            outcome:
              "Reading all terms carefully helps you understand the true cost and your obligations.",
          },
        ],
        reflections: [
          "How can you ensure you're reading loan terms thoroughly before signing?",
          "What strategies help you understand complex financial terms in loan agreements?",
        ],
        skill: "Thorough Loan Review",
      },
    },
    {
      id: "finance-adults-66",
      title: "Loan App Reviews",
      description:
        "Scenario: Why should you check reviews? (A) For entertainment or (B) To identify user complaints and risks. Outcome: Past user experiences reveal hidden problems.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-adults-66"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/loan-app-reviews",
      index: 65,
      scenario: {
        setup:
          "You need to understand the importance of checking reviews for loan apps. This game helps you recognize why user experiences are crucial before selecting a loan app.",
        choices: [
          {
            label: "For entertainment",
            outcome:
              "Reviews serve a practical purpose beyond entertainment, helping identify potential risks.",
          },
          {
            label: "To identify user complaints and risks",
            outcome:
              "Past user experiences reveal hidden problems and potential risks with loan apps.",
          },
        ],
        reflections: [
          "How can you identify trustworthy reviews about loan apps?",
          "What specific patterns should you look for when reading loan app reviews?",
        ],
        skill: "Review Analysis for Financial Safety",
      },
    },
    {
      id: "finance-adults-67",
      title: "Multiple App Loans",
      description:
        "Scenario: Taking loans from many apps leads to: (A) Flexibility or (B) Severe repayment stress. Outcome: App-based loan stacking is dangerous.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-adults-67"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/multiple-app-loans",
      index: 66,
      scenario: {
        setup:
          "You need to understand the dangers of taking loans from multiple apps. This game helps you recognize why app-based loan stacking is risky.",
        choices: [
          {
            label: "Flexibility",
            outcome:
              "Actually, multiple app loans create complexity rather than flexibility.",
          },
          {
            label: "Severe repayment stress",
            outcome:
              "App-based loan stacking is dangerous as it creates multiple repayment obligations across different platforms.",
          },
        ],
        reflections: [
          "How can you assess if you're taking on too many loan obligations?",
          "What strategies help you avoid the temptation of multiple app loans?",
        ],
        skill: "Loan Stacking Awareness",
      },
    },
    {
      id: "finance-adults-68",
      title: "Contact Sharing Risk",
      description:
        "Scenario: Why is sharing contacts risky? (A) It helps repayment or (B) It enables harassment of friends/family. Outcome: Protecting contacts protects dignity.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-adults-68"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/contact-sharing-risk",
      index: 67,
      scenario: {
        setup:
          "You need to understand the risks of sharing contacts with loan apps. This game helps you recognize why protecting contact privacy is important.",
        choices: [
          {
            label: "It helps repayment",
            outcome:
              "Actually, sharing contacts doesn't help with repayment but creates privacy risks.",
          },
          {
            label: "It enables harassment of friends/family",
            outcome:
              "Protecting contacts protects dignity and prevents harassment of your personal connections.",
          },
        ],
        reflections: [
          "How can you protect your contacts' privacy when applying for loans?",
          "What steps should you take to prevent lenders from accessing your contacts?",
        ],
        skill: "Contact Privacy Protection",
      },
    },
    {
      id: "finance-adults-69",
      title: "Safe Exit Decision",
      description:
        "Scenario: You realise a loan app is unsafe. What should you do? (A) Continue using it or (B) Stop, repay safely, and uninstall. Outcome: Early exit reduces damage.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-adults-69"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/safe-exit-decision",
      index: 68,
      scenario: {
        setup:
          "You need to understand how to safely exit from an unsafe loan app. This game helps you recognize the best approach when you identify risks.",
        choices: [
          {
            label: "Continue using it",
            outcome:
              "Continuing to use an unsafe app increases your risk exposure unnecessarily.",
          },
          {
            label: "Stop, repay safely, and uninstall",
            outcome:
              "Early exit reduces damage and protects you from further risks associated with unsafe apps.",
          },
        ],
        reflections: [
          "How can you identify if a loan app is unsafe before using it?",
          "What steps should you take to safely exit an unsafe loan app?",
        ],
        skill: "Safe Exit Strategies",
      },
    },
    {
      id: "finance-adults-70",
      title: "Digital Safety Checkpoint",
      description:
        "Task: Identify and avoid unsafe digital lending practices in 8 scenarios. Outcome Message: You can now safely navigate digital loan offers.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Hard",
      duration: "7 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-adults-70"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/digital-safety-checkpoint",
      index: 69,
      scenario: {
        setup:
          "This checkpoint tests your ability to identify and avoid unsafe digital lending practices across multiple scenarios.",
        choices: [
          {
            label: "Recognize and avoid unsafe digital lending practices",
            outcome:
              "You can now safely navigate digital loan offers.",
          },
          {
            label: "Need more practice with digital safety",
            outcome:
              "Continue learning to better identify unsafe digital lending practices.",
          },
        ],
        reflections: [
          "How can you verify if a digital lender is legitimate before borrowing?",
          "What steps should you take to protect your personal information when using digital lending platforms?",
        ],
        skill: "Digital Lending Safety",
      },
    },
    {
      id: "finance-adults-71",
      title: "Personal vs Business Money",
      description:
        "Scenario: You run a small shop. Which is safer? (A) Using one account for everything or (B) Separating personal and business money. Outcome: Separation improves clarity and control.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-adults-71"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/personal-vs-business-money",
      index: 70,
      scenario: {
        setup:
          "You need to understand the importance of separating personal and business finances. This game helps you recognize why clear financial boundaries are crucial for small business owners.",
        choices: [
          {
            label: "Using one account for everything",
            outcome:
              "Using one account creates confusion between personal and business expenses.",
          },
          {
            label: "Separating personal and business money",
            outcome:
              "Separation improves clarity and control of your finances.",
          },
        ],
        reflections: [
          "How can you effectively separate personal and business finances in your own situation?",
          "What steps should you take to implement clear financial separation for your business?",
        ],
        skill: "Business-Personal Finance Separation",
      },
    },
    {
      id: "finance-adults-72",
      title: "Cash Flow vs Profit",
      description:
        "Scenario: Your business shows profit, but no cash is available. Why? (A) Profit equals cash or (B) Cash flow timing matters. Outcome: Cash flow problems cause business stress even with profit.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-adults-72"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/cash-flow-vs-profit",
      index: 71,
      scenario: {
        setup:
          "You need to understand the difference between profit and cash flow in business. This game helps you recognize why a profitable business can still face cash flow challenges.",
        choices: [
          {
            label: "Profit equals cash",
            outcome:
              "Actually, profit and cash flow are different concepts with different timing implications.",
          },
          {
            label: "Cash flow timing matters",
            outcome:
              "Cash flow problems cause business stress even with profit.",
          },
        ],
        reflections: [
          "How can you monitor cash flow in addition to tracking profit?",
          "What strategies help manage cash flow challenges in a profitable business?",
        ],
        skill: "Cash Flow Management Understanding",
      },
    },
    {
      id: "finance-adults-73",
      title: "Inventory Purchase Decision",
      description:
        "Scenario: You want to buy extra stock. What should you check first? (A) Supplier pressure or (B) Expected sales and cash availability. Outcome: Inventory should match demand, not hope.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-adults-73"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/inventory-purchase-decision",
      index: 72,
      scenario: {
        setup:
          "You need to understand how to make proper inventory purchase decisions. This game helps you recognize why inventory should match demand rather than hope.",
        choices: [
          {
            label: "Supplier pressure",
            outcome:
              "Making decisions based on supplier pressure can lead to overstocking and cash flow problems.",
          },
          {
            label: "Expected sales and cash availability",
            outcome:
              "Inventory should match demand, not hope.",
          },
        ],
        reflections: [
          "How can you forecast sales to make better inventory decisions?",
          "What metrics should you track to optimize your inventory purchases?",
        ],
        skill: "Inventory Management Decision-Making",
      },
    },
    {
      id: "finance-adults-74",
      title: "Credit for Business Growth",
      description:
        "Scenario: When is business borrowing safer? (A) To cover losses or (B) To support planned growth with cash flow. Outcome: Credit should support growth, not hide problems.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-adults-74"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/credit-for-business-growth",
      index: 73,
      scenario: {
        setup:
          "You need to understand when business borrowing is appropriate. This game helps you recognize why credit should support growth, not hide problems.",
        choices: [
          {
            label: "To cover losses",
            outcome:
              "Using credit to cover losses can create a dangerous cycle of debt without addressing root causes.",
          },
          {
            label: "To support planned growth with cash flow",
            outcome:
              "Credit should support growth, not hide problems.",
          },
        ],
        reflections: [
          "How can you evaluate if business credit is appropriate for your growth plans?",
          "What financial projections should you prepare before taking business credit?",
        ],
        skill: "Business Credit Management",
      },
    },
    {
      id: "finance-adults-75",
      title: "Daily Expense Tracking",
      description:
        "Scenario: What habit improves business control? (A) Memory-based tracking or (B) Daily expense recording. Outcome: Records reveal leaks and trends.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 15,
      xp: 30,
      completed: gameCompletionStatus["finance-adults-75"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/daily-expense-tracking",
      index: 74,
      scenario: {
        setup:
          "You need to understand the importance of daily expense tracking for business control. This game helps you recognize why records reveal leaks and trends.",
        choices: [
          {
            label: "Memory-based tracking",
            outcome:
              "Memory-based tracking is unreliable and can lead to missed expenses.",
          },
          {
            label: "Daily expense recording",
            outcome:
              "Records reveal leaks and trends.",
          },
        ],
        reflections: [
          "How can you implement daily expense tracking in your business?",
          "What tools or methods work best for consistent daily expense recording?",
        ],
        skill: "Daily Expense Tracking Mastery",
      },
    },
    {
      id: "finance-adults-76",
      title: "Seasonal Income Planning",
      description:
        "Scenario: Your income is seasonal. What helps? (A) Spending freely in peak months or (B) Saving for low-income periods. Outcome: Season planning prevents emergency borrowing.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-adults-76"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/seasonal-income-planning",
      index: 75,
      scenario: {
        setup:
          "You have seasonal income and need to plan for periods when income is low. This game teaches you how to manage seasonal income effectively.",
        choices: [
          {
            label: "Spending freely in peak months",
            outcome:
              "Spending freely during peak months leads to financial stress during low-income periods. You'll struggle to meet your basic needs when income drops.",
          },
          {
            label: "Saving for low-income periods",
            outcome:
              "Saving during peak months provides a financial cushion that ensures stability during lean periods. This is the key to seasonal income management.",
          },
        ],
        reflections: [
          "How can you balance enjoying peak income while preparing for lean periods?",
          "What strategies will you use to maintain financial stability throughout the year?",
        ],
        skill: "Seasonal Income Management",
      },
    },
    {
      id: "finance-adults-77",
      title: "Supplier Credit Trap",
      description:
        "Scenario: Supplier offers unlimited credit. What's the risk? (A) None or (B) Hidden pressure and repayment stress. Outcome: Supplier credit can quietly become debt.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-adults-77"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/supplier-credit-trap",
      index: 76,
      scenario: {
        setup:
          "A supplier offers you unlimited credit. This game teaches you to recognize the hidden risks and manage supplier credit responsibly.",
        choices: [
          {
            label: "None",
            outcome:
              "There are always risks with unlimited credit. It can lead to overspending, dependency, and financial stress when repayment is due.",
          },
          {
            label: "Hidden pressure and repayment stress",
            outcome:
              "Unlimited credit creates an illusion of financial freedom, but the hidden pressure builds until repayment time.",
          },
        ],
        reflections: [
          "How can you evaluate supplier credit offers objectively?",
          "What safeguards should you put in place when accepting credit?",
        ],
        skill: "Supplier Credit Risk Management",
      },
    },
    {
      id: "finance-adults-78",
      title: "Mixing Business Loans",
      description:
        "Scenario: Using a personal loan for business causes: (A) No issue or (B) Confusion and repayment problems. Outcome: Loan purpose mismatch increases risk.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-adults-78"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/mixing-business-loans",
      index: 77,
      scenario: {
        setup:
          "You're considering using a personal loan for business purposes. This game teaches you about the risks of mixing loan purposes and why separation matters.",
        choices: [
          {
            label: "No issue",
            outcome:
              "Using personal loans for business creates several complications. It can blur financial boundaries and make tracking difficult.",
          },
          {
            label: "Confusion and repayment problems",
            outcome:
              "Mixing personal and business loans leads to confusion about what you owe for what purpose, making repayment management challenging.",
          },
        ],
        reflections: [
          "How can you maintain clear boundaries between personal and business finances?",
          "What systems will you put in place to prevent loan purpose mixing?",
        ],
        skill: "Loan Purpose Management",
      },
    },
    {
      id: "finance-adults-79",
      title: "Emergency Business Expenses",
      description:
        "Scenario: A machine breaks down. What's safer first? (A) Immediate high-interest loan or (B) Savings or planned repair fund. Outcome: Preparedness reduces costly borrowing.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-adults-79"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/emergency-business-expenses",
      index: 78,
      scenario: {
        setup:
          "A critical piece of business equipment breaks down unexpectedly. This game teaches you about the importance of emergency preparedness and avoiding costly last-minute borrowing.",
        choices: [
          {
            label: "Immediate high-interest loan",
            outcome:
              "Taking an immediate high-interest loan creates debt pressure and financial stress. It's expensive and puts you in a difficult position.",
          },
          {
            label: "Savings or planned repair fund",
            outcome:
              "Using savings or a planned repair fund is the safest approach. It avoids debt and maintains financial stability during emergencies.",
          },
        ],
        reflections: [
          "How can you build an effective emergency fund for your business?",
          "What preventive measures can reduce business emergency expenses?",
        ],
        skill: "Business Emergency Preparedness",
      },
    },
    {
      id: "finance-adults-80",
      title: "Pricing Discipline",
      description:
        "Scenario: Selling below cost leads to: (A) Growth or (B) Long-term losses. Outcome: Correct pricing sustains business health.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-adults-80"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/pricing-discipline",
      index: 79,
      scenario: {
        setup:
          "You need to set prices for your products or services. This game teaches you the importance of pricing discipline and avoiding the trap of selling below cost.",
        choices: [
          {
            label: "Growth",
            outcome:
              "Selling below cost might attract customers initially, but it creates unsustainable financial pressure and doesn't lead to genuine business growth.",
          },
          {
            label: "Long-term losses",
            outcome:
              "Selling below cost consistently leads to long-term losses. You're essentially paying customers to buy from you, which is financially unsustainable.",
          },
        ],
        reflections: [
          "How can you calculate the true cost of your products or services?",
          "What value do you provide that justifies your pricing?",
        ],
        skill: "Pricing Strategy Mastery",
      },
    },
    {
      id: "finance-adults-81",
      title: "Credit Sales Risk",
      description:
        "Scenario: Giving goods on credit without records causes: (A) Customer loyalty or (B) Cash flow problems. Outcome: Unrecorded credit sales damage liquidity.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-adults-81"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/credit-sales-risk",
      index: 80,
      scenario: {
        setup:
          "You're considering offering credit sales to customers. This game teaches you about the risks of unrecorded credit sales and the importance of proper credit management.",
        choices: [
          {
            label: "Customer loyalty",
            outcome:
              "While credit might seem to build customer loyalty, giving goods on credit without records actually creates financial problems and doesn't build sustainable loyalty.",
          },
          {
            label: "Cash flow problems",
            outcome:
              "Giving goods on credit without records leads to cash flow problems because you don't know who owes what, when payments are due, or how much money you're actually owed.",
          },
        ],
        reflections: [
          "How can you implement a simple credit sales tracking system?",
          "What credit terms will you establish with customers?",
        ],
        skill: "Credit Sales Management",
      },
    },
    {
      id: "finance-adults-82",
      title: "Business Finance Checkpoint",
      description:
        "Task: Make 8 safe financial decisions for a small business. Outcome Message: You can now manage business money with discipline and foresight.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-adults-82"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/business-finance-checkpoint",
      index: 81,
      scenario: {
        setup:
          "You need to make critical financial decisions for your small business. This checkpoint game tests your understanding of safe business financial practices.",
        choices: [
          {
            label: "Keep detailed financial records of all transactions",
            outcome:
              "Keeping detailed financial records is fundamental to business success. It helps with tax compliance, financial planning, and making informed decisions.",
          },
          {
            label: "Monitor cash flow regularly and forecast future needs",
            outcome:
              "Regular cash flow monitoring and forecasting help you anticipate financial challenges and opportunities, ensuring you have enough money when you need it.",
          },
        ],
        reflections: [
          "What systems will you implement to maintain financial discipline?",
          "How can you prepare for financial challenges in your business?",
        ],
        skill: "Business Financial Management",
      },
    },
    {
      id: "finance-adults-83",
      title: "What Is a Financial Shock?",
      description:
        "Scenario: Which is a financial shock? (A) Planned monthly rent or (B) Sudden medical expense. Outcome: Financial shocks are unexpected and disruptive.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-adults-83"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/what-is-financial-shock",
      index: 82,
      scenario: {
        setup:
          "You need to understand what constitutes a financial shock. This game helps you recognize unexpected financial events and prepare for them appropriately.",
        choices: [
          {
            label: "Planned monthly rent",
            outcome:
              "Planned monthly rent is a predictable, regular expense that you budget for. It's not a financial shock since you know about it in advance and can prepare accordingly.",
          },
          {
            label: "Sudden medical expense",
            outcome:
              "Sudden medical expenses are financial shocks because they're unexpected, urgent, and can be very expensive. They disrupt your normal financial planning.",
          },
        ],
        reflections: [
          "How can you identify potential financial shocks in your life?",
          "What emergency fund size would be appropriate for your situation?",
        ],
        skill: "Financial Shock Recognition",
      },
    },
    {
      id: "finance-adults-84",
      title: "First Response to Emergency",
      description:
        "Scenario: You face an unexpected expense. What should you check first? (A) Loan apps or (B) Savings or emergency fund. Outcome: Savings reduce panic borrowing.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-adults-84"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/first-response-to-emergency",
      index: 83,
      scenario: {
        setup:
          "You face an unexpected financial emergency. This game teaches you the proper first response to reduce panic and make informed decisions.",
        choices: [
          {
            label: "Loan apps",
            outcome:
              "Checking loan apps first creates a dependency on borrowing. It's better to check your own resources before considering debt options.",
          },
          {
            label: "Savings or emergency fund",
            outcome:
              "Checking your savings or emergency fund first is the right approach. It helps you avoid unnecessary debt and reduces financial stress.",
          },
        ],
        reflections: [
          "How can you build an effective emergency response plan?",
          "What resources should you prioritize in different emergency scenarios?",
        ],
        skill: "Emergency Financial Response",
      },
    },
    {
      id: "finance-adults-85",
      title: "Emergency Fund Purpose",
      description:
        "Scenario: Emergency funds are meant for: (A) Daily spending or (B) Unexpected critical needs. Outcome: Using emergency funds wisely protects stability.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-adults-85"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/emergency-fund-purpose",
      index: 84,
      scenario: {
        setup:
          "You need to understand the proper purpose of emergency funds. This game helps you distinguish between appropriate and inappropriate uses of emergency savings.",
        choices: [
          {
            label: "Daily spending",
            outcome:
              "Emergency funds are not meant for daily spending. Using them for regular expenses defeats their purpose and leaves you vulnerable when real emergencies occur.",
          },
          {
            label: "Unexpected critical needs",
            outcome:
              "Emergency funds are specifically meant for unexpected critical needs like medical emergencies, job loss, or major repairs. They protect your financial stability.",
          },
        ],
        reflections: [
          "How can you build and maintain an appropriate emergency fund?",
          "What criteria will you use to determine when to use your emergency fund?",
        ],
        skill: "Emergency Fund Management",
      },
    },
    {
      id: "finance-adults-86",
      title: "How Much Emergency Fund?",
      description:
        "Scenario: A safe emergency fund usually covers: (A) 1–2 days of expenses or (B) 3–6 months of basic expenses. Outcome: Adequate reserves reduce long-term stress.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-adults-86"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/how-much-emergency-fund",
      index: 85,
      scenario: {
        setup:
          "You need to determine the appropriate size for your emergency fund. This game helps you understand the factors that influence emergency fund requirements.",
        choices: [
          {
            label: "1–2 days of expenses",
            outcome:
              "1-2 days of expenses is insufficient for a true emergency fund. Real emergencies like job loss or major medical expenses last much longer than a couple of days.",
          },
          {
            label: "3–6 months of basic expenses",
            outcome:
              "Financial experts recommend 3-6 months of basic expenses for emergency funds. This provides adequate time to find new employment or resolve financial difficulties.",
          },
        ],
        reflections: [
          "How can you calculate your personal emergency fund target?",
          "What steps will you take to build your emergency fund?",
        ],
        skill: "Emergency Fund Sizing",
      },
    },
    {
      id: "finance-adults-87",
      title: "Health Emergency Planning",
      description:
        "Scenario: Which reduces medical borrowing risk? (A) Ignoring health planning or (B) Basic insurance or savings. Outcome: Health planning prevents high-interest debt.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-adults-87"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/health-emergency-planning",
      index: 86,
      scenario: {
        setup:
          "You need to understand how to plan for health emergencies to avoid medical debt. This game helps you recognize the importance of health financial preparation.",
        choices: [
          {
            label: "Ignoring health planning",
            outcome:
              "Ignoring health planning leaves you completely vulnerable to medical emergencies. Without preparation, you're likely to face expensive medical debt during health crises.",
          },
          {
            label: "Basic insurance or savings",
            outcome:
              "Basic insurance or savings significantly reduces medical borrowing risk by providing financial protection when health emergencies occur unexpectedly.",
          },
        ],
        reflections: [
          "How can you assess your current health emergency preparedness?",
          "What steps will you take to improve your health financial planning?",
        ],
        skill: "Health Emergency Financial Planning",
      },
    },
    {
      id: "finance-adults-88",
      title: "Income Loss Scenario",
      description:
        "Scenario: You lose income temporarily. What helps most? (A) Immediate borrowing or (B) Reduced expenses + emergency fund. Outcome: Expense control buys time without debt.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-adults-88"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/income-loss-scenario",
      index: 87,
      scenario: {
        setup:
          "You need to know how to handle temporary income loss. This game teaches you the importance of expense control and emergency fund usage during income reduction.",
        choices: [
          {
            label: "Immediate borrowing",
            outcome:
              "Immediate borrowing creates debt obligations that compound your financial problems. It's better to use your own resources first before considering debt options.",
          },
          {
            label: "Reduced expenses + emergency fund",
            outcome:
              "Reducing expenses and using your emergency fund gives you time to find new income without creating additional debt obligations.",
          },
        ],
        reflections: [
          "How can you create a plan for managing temporary income loss?",
          "What specific expenses would you reduce and by how much?",
        ],
        skill: "Income Loss Management",
      },
    },
    {
      id: "finance-adults-89",
      title: "Multiple Emergencies",
      description:
        "Scenario: Facing repeated emergencies usually means: (A) Bad luck only or (B) Lack of preparedness. Outcome: Preparedness reduces repeated shocks.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-adults-89"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/multiple-emergencies",
      index: 88,
      scenario: {
        setup:
          "You need to understand why repeated emergencies occur and how to break the cycle. This game helps you recognize patterns and improve your emergency preparedness.",
        choices: [
          {
            label: "Bad luck only",
            outcome:
              "While bad luck can contribute to emergencies, repeated emergencies often indicate systemic issues like lack of financial planning or poor preparedness rather than just luck.",
          },
          {
            label: "Lack of preparedness",
            outcome:
              "Repeated emergencies usually indicate lack of preparedness. Good planning, emergency funds, and proper financial management can significantly reduce the frequency and impact of financial shocks.",
          },
        ],
        reflections: [
          "How can you identify patterns in your financial emergencies?",
          "What specific steps will you take to improve your emergency preparedness?",
        ],
        skill: "Multiple Emergency Management",
      },
    },
    {
      id: "finance-adults-90",
      title: "Avoiding Panic Decisions",
      description:
        "Scenario: Panic borrowing often leads to: (A) Quick relief or (B) Long-term debt stress. Outcome: Calm decisions protect future stability.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-adults-90"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/avoiding-panic-decisions",
      index: 89,
      scenario: {
        setup:
          "You need to learn how to avoid making financial decisions under pressure. This game helps you recognize the dangers of panic decisions and maintain calm during financial emergencies.",
        choices: [
          {
            label: "Quick relief",
            outcome:
              "Panic borrowing might seem to provide quick relief, but it's temporary and creates long-term problems. The initial relief is usually followed by mounting debt stress and financial pressure.",
          },
          {
            label: "Long-term debt stress",
            outcome:
              "Panic borrowing often leads to long-term debt stress because it creates obligations that compound financial problems rather than solving them sustainably.",
          },
        ],
        reflections: [
          "How can you create a personal emergency decision-making framework?",
          "What specific steps will you take to stay calm during financial stress?",
        ],
        skill: "Emergency Decision Management",
      },
    },
    {
      id: "finance-adults-91",
      title: "Emergency Credit Use",
      description:
        "Scenario: When is using credit acceptable? (A) When no other option exists and repayment is planned or (B) As first response. Outcome: Planned credit is safer than panic credit.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-adults-91"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/emergency-credit-use",
      index: 90,
      scenario: {
        setup:
          "You need to understand when emergency credit use is appropriate. This game helps you distinguish between responsible and problematic credit use during financial emergencies.",
        choices: [
          {
            label: "When no other option exists and repayment is planned",
            outcome:
              "Using credit is acceptable when it's truly a last resort and you have a clear, realistic plan for repayment. This approach minimizes risk and ensures you don't create more financial problems.",
          },
          {
            label: "As first response",
            outcome:
              "Using credit as a first response creates unnecessary debt and can lead to financial problems. It's better to exhaust other options like savings, budget adjustments, or alternative solutions before considering credit.",
          },
        ],
        reflections: [
          "How can you distinguish between true emergencies and wants when considering credit?",
          "What criteria will you use to evaluate emergency credit options?",
        ],
        skill: "Emergency Credit Evaluation",
      },
    },
    {
      id: "finance-adults-92",
      title: "Emergency Preparedness Checkpoint",
      description:
        "Task: Handle 7 emergency scenarios safely. Outcome: You are now prepared to face financial shocks without panic borrowing.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-adults-92"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/emergency-preparedness-checkpoint",
      index: 91,
      scenario: {
        setup:
          "You need to demonstrate your ability to handle various emergency scenarios without panic borrowing. This checkpoint tests your emergency preparedness and decision-making skills.",
        choices: [
          {
            label: "Handle 7 emergency scenarios safely",
            outcome:
              "Successfully handling emergency scenarios without panic borrowing demonstrates that you have the skills and preparedness necessary to manage financial shocks.",
          },
        ],
        reflections: [
          "How can you build a comprehensive emergency preparedness plan?",
          "What specific scenarios should you prepare for based on your life situation?",
        ],
        skill: "Emergency Preparedness Mastery",
      },
    },
    {
      id: "finance-adults-93",
      title: "Short-Term vs Long-Term Thinking",
      description:
        "Scenario: Which choice supports long-term stability? (A) Solving only today's problem or (B) Planning for future needs. Outcome: Long-term thinking reduces repeated financial stress.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-adults-93"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/short-term-vs-long-term-thinking",
      index: 92,
      scenario: {
        setup:
          "You need to learn to balance immediate financial needs with long-term financial security. This game helps you develop strategic thinking that supports sustained financial stability.",
        choices: [
          {
            label: "Solving only today's problem",
            outcome:
              "Solving only today's problem provides temporary relief but doesn't address underlying issues. This short-term approach often leads to the same problems recurring and creates long-term financial instability.",
          },
          {
            label: "Planning for future needs",
            outcome:
              "Planning for future needs supports long-term stability by addressing root causes and preventing problems from recurring. This approach builds financial resilience over time.",
          },
        ],
        reflections: [
          "How can you develop better long-term financial thinking habits?",
          "What specific strategies will you implement to balance short-term needs with long-term goals?",
        ],
        skill: "Long-Term Financial Planning",
      },
    },
    {
      id: "finance-adults-94",
      title: "Credit History Awareness",
      description:
        "Scenario: Why does repayment history matter? (A) It doesn't matter or (B) It affects future credit access. Outcome: Good repayment behaviour builds trust with lenders.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-adults-94"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/credit-history-awareness",
      index: 93,
      scenario: {
        setup:
          "You need to understand the importance of repayment history in building your credit profile. This game helps you recognize how your payment behavior affects your financial reputation.",
        choices: [
          {
            label: "It doesn't matter",
            outcome:
              "Actually, repayment history matters greatly. It's one of the most important factors lenders consider when evaluating your creditworthiness. Poor repayment history can significantly limit your access to credit in the future.",
          },
          {
            label: "It affects future credit access",
            outcome:
              "Your repayment history significantly affects future credit access. Lenders use your payment history to assess risk, and a good track record makes you eligible for better terms and lower interest rates.",
          },
        ],
        reflections: [
          "How can you establish and maintain a good repayment history?",
          "What strategies will you use to ensure consistent on-time payments?",
        ],
        skill: "Credit History Management",
      },
    },
    {
      id: "finance-adults-95",
      title: "Formal Finance Trust",
      description:
        "Scenario: Why should people use formal financial systems? (A) They are unregulated or (B) They offer protection and accountability. Outcome: Formal systems reduce exploitation.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-adults-95"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/formal-finance-trust",
      index: 94,
      scenario: {
        setup:
          "You need to understand the importance of using formal financial systems. This game helps you recognize the benefits of regulated financial institutions over informal ones.",
        choices: [
          {
            label: "They are unregulated",
            outcome:
              "Actually, formal financial systems are regulated, not unregulated. Regulation is what provides consumer protections, oversight, and accountability that informal systems typically lack.",
          },
          {
            label: "They offer protection and accountability",
            outcome:
              "Formal financial systems offer protection and accountability through regulation, legal frameworks, and oversight bodies. This protects consumers and ensures fair practices.",
          },
        ],
        reflections: [
          "How can you identify trustworthy formal financial institutions?",
          "What questions should you ask before engaging with any financial service?",
        ],
        skill: "Formal Finance Awareness",
      },
    },
    {
      id: "finance-adults-96",
      title: "Gradual Financial Inclusion",
      description:
        "Scenario: What is a safer path to financial inclusion? (A) Taking large loans immediately or (B) Gradual use of banking and small credit. Outcome: Gradual inclusion reduces mistakes.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-adults-96"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/gradual-financial-inclusion",
      index: 95,
      scenario: {
        setup:
          "You need to understand the importance of gradual financial inclusion. This game helps you recognize how building financial experience progressively reduces mistakes and financial stress.",
        choices: [
          {
            label: "Taking large loans immediately",
            outcome:
              "Taking large loans immediately without experience can lead to financial stress and defaults. This approach carries high risk for newcomers to the financial system.",
          },
          {
            label: "Gradual use of banking and small credit",
            outcome:
              "Gradual use of banking and small credit is the safer path to financial inclusion. This approach allows you to build experience, establish credit history, and learn financial management skills progressively.",
          },
        ],
        reflections: [
          "How can you create a personal plan for gradual financial inclusion?",
          "What specific financial services should you consider first?",
        ],
        skill: "Gradual Financial Inclusion",
      },
    },
    {
      id: "finance-adults-97",
      title: "Behaviour Over Income",
      description:
        "Scenario: What matters more for financial health? (A) Income alone or (B) Financial behaviour and discipline. Outcome: Good habits protect income at all levels.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-adults-97"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/behaviour-over-income",
      index: 96,
      scenario: {
        setup:
          "You need to understand the importance of financial behavior over income level. This game helps you recognize how good habits protect your financial well-being regardless of income.",
        choices: [
          {
            label: "Income alone",
            outcome:
              "While income is important, it's not the sole determinant of financial health. People with high incomes can still face financial difficulties if they don't manage their money well.",
          },
          {
            label: "Financial behaviour and discipline",
            outcome:
              "Financial behavior and discipline matter more for financial health. Good habits like budgeting, saving, and responsible spending protect your financial well-being regardless of income level.",
          },
        ],
        reflections: [
          "How can you prioritize financial discipline in your own life?",
          "What specific habits will help you focus on behavior over income?",
        ],
        skill: "Behavior-Based Financial Planning",
      },
    },
    {
      id: "finance-adults-98",
      title: "Learning from Past Mistakes",
      description:
        "Scenario: You made a poor financial decision earlier. What helps now? (A) Ignoring it or (B) Learning and adjusting behaviour. Outcome: Reflection prevents repeating mistakes.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-adults-98"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/learning-from-past-mistakes",
      index: 97,
      scenario: {
        setup:
          "You need to understand the importance of learning from financial mistakes. This game helps you recognize how reflecting on past errors prevents repetition and strengthens financial decision-making.",
        choices: [
          {
            label: "Ignoring it",
            outcome:
              "Ignoring past financial mistakes means you're likely to repeat them. Without acknowledging and learning from errors, you miss the opportunity to improve your financial decision-making skills.",
          },
          {
            label: "Learning and adjusting behaviour",
            outcome:
              "Learning and adjusting behavior is the best response to past financial mistakes. This approach helps you avoid repeating errors and strengthens your financial decision-making skills for the future.",
          },
        ],
        reflections: [
          "How can you create a personal system for learning from financial mistakes?",
          "What specific steps will you take to avoid repeating similar errors?",
        ],
        skill: "Reflective Financial Decision-Making",
      },
    },
    {
      id: "finance-adults-99",
      title: "Financial Confidence",
      description:
        "Scenario: Financial confidence comes from: (A) Taking risks blindly or (B) Understanding choices and consequences. Outcome: Knowledge builds confidence, not risk.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-adults-99"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/financial-confidence",
      index: 98,
      scenario: {
        setup:
          "You need to understand the importance of building financial confidence through knowledge. This game helps you recognize how understanding financial concepts reduces anxiety and builds genuine confidence.",
        choices: [
          {
            label: "Taking risks blindly",
            outcome:
              "Taking risks blindly does not build financial confidence. Without understanding the implications, this approach often leads to financial stress and losses.",
          },
          {
            label: "Understanding choices and consequences",
            outcome:
              "Financial confidence comes from understanding choices and consequences. Knowledge of how financial decisions impact your situation builds genuine confidence and reduces anxiety.",
          },
        ],
        reflections: [
          "How can you build your financial knowledge systematically?",
          "What resources will you use to enhance your financial understanding?",
        ],
        skill: "Knowledge-Based Financial Confidence",
      },
    },
    {
      id: "finance-adults-100",
      title: "Financial Inclusion Mastery Checkpoint",
      description:
        "Task: Demonstrate safe financial behaviour across multiple scenarios. Outcome: You are ready to participate confidently and responsibly in the formal financial system.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Hard",
      duration: "8 min",
      coins: 20,
      xp: 40,
      completed: gameCompletionStatus["finance-adults-100"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/adults/financial-inclusion-mastery-checkpoint",
      index: 99,
      scenario: {
        setup:
          "You need to demonstrate mastery of safe financial behavior across multiple scenarios. This checkpoint evaluates your readiness to participate confidently and responsibly in the formal financial system.",
        choices: [
          {
            label: "Taking financial risks without understanding consequences",
            outcome:
              "Taking financial risks without understanding consequences shows unpreparedness for formal financial participation. This approach can lead to serious financial problems.",
          },
          {
            label: "Using knowledge to make informed financial decisions",
            outcome:
              "Using knowledge to make informed financial decisions shows readiness for formal financial participation. Understanding the implications of your choices is key to safe participation.",
          },
        ],
        reflections: [
          "How can you continue developing your financial knowledge and discipline?",
          "What specific steps will you take to participate responsibly in financial systems?",
        ],
        skill: "Financial Inclusion Mastery",
      },
    },
  ];

  return financeAdultGames;
};
