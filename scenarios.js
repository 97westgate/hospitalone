const INSURANCE_CHOICE = {
    text: "You're offered health insurance at work. Which plan do you choose?",
    choiceA: { 
        text: `Premium ($${GAME_CONSTANTS.INSURANCE_COSTS.PREMIUM}/mo)`, 
        healthEffect: [0, 0], 
        moneyEffect: [-GAME_CONSTANTS.INSURANCE_COSTS.PREMIUM, -GAME_CONSTANTS.INSURANCE_COSTS.PREMIUM],
        insuranceEffect: GAME_CONSTANTS.INSURANCE.PREMIUM
    },
    choiceB: { 
        text: `Basic ($${GAME_CONSTANTS.INSURANCE_COSTS.BASIC}/mo)`, 
        healthEffect: [0, 0], 
        moneyEffect: [-GAME_CONSTANTS.INSURANCE_COSTS.BASIC, -GAME_CONSTANTS.INSURANCE_COSTS.BASIC],
        insuranceEffect: GAME_CONSTANTS.INSURANCE.BASIC
    },
    choiceC: { 
        text: "Decline Insurance", 
        healthEffect: [0, 0], 
        moneyEffect: [0, 0],
        insuranceEffect: GAME_CONSTANTS.INSURANCE.NONE
    }
};

const HEALTH_SCENARIOS = [
    {
        text: "You need urgent medical care!",
        getChoices: (insurance) => ({
            choiceA: {
                text: "Go to Emergency Room",
                healthEffect: [15, 25],
                moneyEffect: insurance === GAME_CONSTANTS.INSURANCE.PREMIUM ? [-50, -25] : 
                           insurance === GAME_CONSTANTS.INSURANCE.BASIC ? [-200, -150] : 
                           [-500, -400]
            },
            choiceB: {
                text: "Visit Urgent Care",
                healthEffect: [10, 15],
                moneyEffect: insurance === GAME_CONSTANTS.INSURANCE.PREMIUM ? [-25, -15] : 
                           insurance === GAME_CONSTANTS.INSURANCE.BASIC ? [-100, -75] : 
                           [-300, -200]
            },
            choiceC: {
                text: "Wait it Out",
                healthEffect: [-20, -10],
                moneyEffect: [0, 0]
            }
        })
    },
    {
        text: "You need prescription medication for a chronic condition.",
        getChoices: (insurance) => ({
            choiceA: {
                text: "Get Brand Name Medicine",
                healthEffect: [15, 20],
                moneyEffect: insurance === GAME_CONSTANTS.INSURANCE.PREMIUM ? [-30, -20] : 
                           insurance === GAME_CONSTANTS.INSURANCE.BASIC ? [-100, -80] : 
                           [-300, -250]
            },
            choiceB: {
                text: "Get Generic Medicine",
                healthEffect: [10, 15],
                moneyEffect: insurance === GAME_CONSTANTS.INSURANCE.PREMIUM ? [-10, -5] : 
                           insurance === GAME_CONSTANTS.INSURANCE.BASIC ? [-50, -30] : 
                           [-150, -100]
            },
            choiceC: {
                text: "Skip Medication",
                healthEffect: [-15, -10],
                moneyEffect: [0, 0]
            }
        })
    },
    {
        text: "You're experiencing back pain.",
        getChoices: (insurance) => ({
            choiceA: {
                text: "See a Specialist",
                healthEffect: [20, 30],
                moneyEffect: insurance === GAME_CONSTANTS.INSURANCE.PREMIUM ? [-50, -30] : 
                           insurance === GAME_CONSTANTS.INSURANCE.BASIC ? [-200, -150] : 
                           [-400, -300]
            },
            choiceB: {
                text: "Get Physical Therapy",
                healthEffect: [10, 20],
                moneyEffect: insurance === GAME_CONSTANTS.INSURANCE.PREMIUM ? [-30, -20] : 
                           insurance === GAME_CONSTANTS.INSURANCE.BASIC ? [-100, -75] : 
                           [-200, -150]
            },
            choiceC: {
                text: "Try Home Remedies",
                healthEffect: [-5, 5],
                moneyEffect: [-20, -10]
            }
        })
    },
    {
        text: "You've been experiencing severe tooth pain.",
        getChoices: (insurance) => ({
            choiceA: {
                text: "Visit Dentist",
                healthEffect: [15, 20],
                moneyEffect: insurance === GAME_CONSTANTS.INSURANCE.PREMIUM ? [-100, -75] : 
                           insurance === GAME_CONSTANTS.INSURANCE.BASIC ? [-300, -250] : 
                           [-800, -600]
            },
            choiceB: {
                text: "Try Home Remedies",
                healthEffect: [-5, 5],
                moneyEffect: [-20, -10]
            },
            choiceC: {
                text: "Ignore It",
                healthEffect: [-15, -10],
                moneyEffect: [0, 0]
            }
        })
    },
    {
        text: "You've caught the seasonal flu.",
        getChoices: (insurance) => ({
            choiceA: {
                text: "See Doctor & Get Medicine",
                healthEffect: [10, 15],
                moneyEffect: insurance === GAME_CONSTANTS.INSURANCE.PREMIUM ? [-30, -20] : 
                           insurance === GAME_CONSTANTS.INSURANCE.BASIC ? [-80, -60] : 
                           [-150, -120]
            },
            choiceB: {
                text: "Over-the-Counter Medicine",
                healthEffect: [5, 10],
                moneyEffect: [-40, -20]
            },
            choiceC: {
                text: "Rest at Home",
                healthEffect: [-5, 5],
                moneyEffect: [0, 0]
            }
        })
    },
    {
        text: "Your knee has been hurting after a minor injury.",
        getChoices: (insurance) => ({
            choiceA: {
                text: "Get MRI & Treatment",
                healthEffect: [20, 25],
                moneyEffect: insurance === GAME_CONSTANTS.INSURANCE.PREMIUM ? [-150, -100] : 
                           insurance === GAME_CONSTANTS.INSURANCE.BASIC ? [-400, -300] : 
                           [-1000, -800]
            },
            choiceB: {
                text: "Physical Therapy",
                healthEffect: [10, 15],
                moneyEffect: insurance === GAME_CONSTANTS.INSURANCE.PREMIUM ? [-50, -30] : 
                           insurance === GAME_CONSTANTS.INSURANCE.BASIC ? [-150, -100] : 
                           [-300, -200]
            },
            choiceC: {
                text: "Walk It Off",
                healthEffect: [-10, -5],
                moneyEffect: [0, 0]
            }
        })
    },
    {
        text: "You're experiencing unusual fatigue and headaches.",
        getChoices: (insurance) => ({
            choiceA: {
                text: "Full Medical Checkup",
                healthEffect: [15, 25],
                moneyEffect: insurance === GAME_CONSTANTS.INSURANCE.PREMIUM ? [-80, -60] : 
                           insurance === GAME_CONSTANTS.INSURANCE.BASIC ? [-200, -150] : 
                           [-500, -400]
            },
            choiceB: {
                text: "Basic Blood Test",
                healthEffect: [5, 15],
                moneyEffect: insurance === GAME_CONSTANTS.INSURANCE.PREMIUM ? [-40, -30] : 
                           insurance === GAME_CONSTANTS.INSURANCE.BASIC ? [-100, -80] : 
                           [-250, -200]
            },
            choiceC: {
                text: "Adjust Sleep Schedule",
                healthEffect: [-5, 5],
                moneyEffect: [0, 0]
            }
        })
    }
];

const MONEY_SCENARIOS = [
    {
        text: "You need extra money. What will you do?",
        getChoices: (insurance) => ({
            choiceA: {
                text: "Sell Plasma (Quick Cash)",
                healthEffect: [-5, -5],
                moneyEffect: [50, 50]
            },
            choiceB: {
                text: "Medical Research Trial",
                healthEffect: [-20, 20],
                moneyEffect: [200, 200]
            },
            choiceC: {
                text: "Start Crowdfunding",
                healthEffect: [0, 0],
                moneyEffect: [0, 300] // Random success rate
            }
        })
    },
    {
        text: "You have some free time. How do you want to earn extra money?",
        getChoices: (insurance) => ({
            choiceA: {
                text: "Work Overtime Shift",
                healthEffect: [-10, -5],
                moneyEffect: [100, 150]
            },
            choiceB: {
                text: "Do Food Delivery",
                healthEffect: [-5, -2],
                moneyEffect: [50, 80]
            },
            choiceC: {
                text: "Online Freelancing",
                healthEffect: [-3, 0],
                moneyEffect: [30, 100]
            }
        })
    },
    {
        text: "A startup is looking for weekend beta testers.",
        getChoices: (insurance) => ({
            choiceA: {
                text: "Full Weekend Testing",
                healthEffect: [-15, -10],
                moneyEffect: [300, 400]
            },
            choiceB: {
                text: "Part-time Testing",
                healthEffect: [-8, -5],
                moneyEffect: [150, 200]
            },
            choiceC: {
                text: "Decline Opportunity",
                healthEffect: [0, 0],
                moneyEffect: [0, 0]
            }
        })
    },
    {
        text: "Your company is offering paid training courses.",
        getChoices: (insurance) => ({
            choiceA: {
                text: "Take All Courses",
                healthEffect: [-10, -5],
                moneyEffect: [200, 300]
            },
            choiceB: {
                text: "Take Basic Course",
                healthEffect: [-5, -2],
                moneyEffect: [100, 150]
            },
            choiceC: {
                text: "Skip Training",
                healthEffect: [0, 0],
                moneyEffect: [0, 0]
            }
        })
    },
    {
        text: "A friend needs help moving apartments.",
        getChoices: (insurance) => ({
            choiceA: {
                text: "Help All Weekend",
                healthEffect: [-15, -10],
                moneyEffect: [200, 250]
            },
            choiceB: {
                text: "Help One Day",
                healthEffect: [-8, -5],
                moneyEffect: [100, 150]
            },
            choiceC: {
                text: "Decline",
                healthEffect: [0, 0],
                moneyEffect: [0, 0]
            }
        })
    }
];

// Define REGULAR_SCENARIOS correctly
const REGULAR_SCENARIOS = [...HEALTH_SCENARIOS, ...MONEY_SCENARIOS];

// Export for debugging
console.log('Available scenarios:', {
    health: HEALTH_SCENARIOS.length,
    money: MONEY_SCENARIOS.length,
    regular: REGULAR_SCENARIOS.length
});

// Helper function to determine if money scenario should appear
function shouldShowMoneyScenario(currentMoney, initialMoney) {
    // Show money scenarios more frequently when money is below 30% of initial amount
    return currentMoney < (initialMoney * 0.3);
}

// Update the game.js nextScenario method to use this logic:

// First scenario is always insurance choice, followed by regular scenarios
const GAME_SCENARIOS = [INSURANCE_CHOICE, ...REGULAR_SCENARIOS]; 

// Add this to your scenarios
const AGE_SPECIFIC_SCENARIOS = {
    26: {
        text: "You are now 26 and no longer eligible for coverage under your parents' health insurance. You need to make a decision about your own insurance.",
        choiceA: { 
            text: `Premium ($${GAME_CONSTANTS.INSURANCE_COSTS.PREMIUM}/mo)`, 
            healthEffect: [0, 0], 
            moneyEffect: [-GAME_CONSTANTS.INSURANCE_COSTS.PREMIUM, -GAME_CONSTANTS.INSURANCE_COSTS.PREMIUM],
            insuranceEffect: GAME_CONSTANTS.INSURANCE.PREMIUM
        },
        choiceB: { 
            text: `Basic ($${GAME_CONSTANTS.INSURANCE_COSTS.BASIC}/mo)`, 
            healthEffect: [0, 0], 
            moneyEffect: [-GAME_CONSTANTS.INSURANCE_COSTS.BASIC, -GAME_CONSTANTS.INSURANCE_COSTS.BASIC],
            insuranceEffect: GAME_CONSTANTS.INSURANCE.BASIC
        },
        choiceC: { 
            text: "Risk going without Insurance", 
            healthEffect: [0, 0], 
            moneyEffect: [0, 0],
            insuranceEffect: GAME_CONSTANTS.INSURANCE.NONE
        }
    }
};