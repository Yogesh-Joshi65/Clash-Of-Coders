// --- MOCK DATABASE ---

export const USER_PROFILE = {
  username: "CodeWarrior_99",
  age: 22,
  gender: "Male",
  college: "Indian Institute of Technology, Bombay",
  address: "Mumbai, Maharashtra",
  stats: {
    matchesPlayed: 45,
    won: 32,
    lost: 13,
    rank: "Diamond II"
  },
  history: [
    { id: 1, opponent: "ByteMaster", date: "2023-12-08", verdict: "Won", change: "+25" },
    { id: 2, opponent: "NullPointer", date: "2023-12-07", verdict: "Lost", change: "-15" },
    { id: 3, opponent: "ReactGod", date: "2023-12-05", verdict: "Won", change: "+20" },
    { id: 4, opponent: "PyThon", date: "2023-12-01", verdict: "Won", change: "+10" },
    { id: 5, opponent: "BugFixer", date: "2023-11-28", verdict: "Lost", change: "-12" },
  ]
};

export const PROBLEMS = [
  { 
    id: "P1", 
    title: "Two Sum", 
    difficulty: "Easy", 
    acceptance: "48%",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target."
  },
  { 
    id: "P2", 
    title: "Reverse Linked List", 
    difficulty: "Medium", 
    acceptance: "72%",
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list."
  },
  { 
    id: "P3", 
    title: "Median of Two Sorted Arrays", 
    difficulty: "Hard", 
    acceptance: "38%",
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays."
  }
];

// --- MOCK LOGIC ---

export const executeCode = async (code, type = 'run') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 1. Check for empty code
      if (!code || code.trim().length < 10) {
        resolve({
          success: false,
          output: "Error: Code is empty or too short.",
          testResults: []
        });
        return;
      }

      // 2. Check for logic (Mocking: Code must contain specific keywords)
      // For "Submit", we represent hidden test cases
      const isSubmit = type === 'submit';
      const keywords = ["print", "return", "console.log", "solve"];
      const hasLogic = keywords.some(k => code.includes(k));

      if (!hasLogic) {
        resolve({
          success: false,
          output: "Runtime Error: No output detected.",
          testResults: [
            { status: 'Failed', input: 'Hidden', expected: 'Result', actual: 'None' }
          ]
        });
        return;
      }

      // 3. Success Simulation
      resolve({
        success: true,
        isWin: isSubmit, // If submitting and logic passes, you win
        output: isSubmit ? "All Hidden Test Cases Passed!" : "Standard Output:\n> Hello World\n> 15",
        testResults: [
          { status: 'Passed', input: 'Case 1', expected: '10', actual: '10' },
          { status: 'Passed', input: 'Case 2', expected: '5', actual: '5' },
          ...(isSubmit ? [{ status: 'Passed', input: 'Hidden Case', expected: 'X', actual: 'X' }] : [])
        ]
      });
    }, 1000);
  });
};