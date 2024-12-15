const GAME_CONSTANTS = {
    // Initial stats
    INITIAL_HEALTH: 50,
    INITIAL_MONEY: 1000,
    INITIAL_INSURANCE: 'none',
    INITIAL_INTELLIGENCE: 50,
    INITIAL_SOCIAL: 50,
    INITIAL_LOOKS: 50,
    INITIAL_EQ: 50,
    INITIAL_MENTAL: 75,
    
    // Health thresholds
    MAX_HEALTH: 100,
    LOW_HEALTH_THRESHOLD: 30,
    MEDIUM_HEALTH_THRESHOLD: 60,
    
    // Stat maximums
    MAX_INTELLIGENCE: 100,
    MAX_SOCIAL: 100,
    MAX_LOOKS: 100,
    MAX_EQ: 100,
    MAX_MENTAL: 100,
    
    // Colors
    COLORS: {
        GOOD_HEALTH: '#2ecc71',
        MEDIUM_HEALTH: '#f1c40f',
        LOW_HEALTH: '#e74c3c',
        INSURANCE: '#9b59b6',
        INTELLIGENCE: '#3498db',
        SOCIAL: '#e67e22',
        LOOKS: '#e84393',
        EQ: '#f1c40f',
        MENTAL: '#9b59b6'
    },
    
    // Insurance types
    INSURANCE: {
        NONE: 'none',
        BASIC: 'basic',
        PREMIUM: 'premium'
    },
    
    // Insurance costs
    INSURANCE_COSTS: {
        PREMIUM: 400,
        BASIC: 200,
        NONE: 0
    },
    
    // Messages
    MESSAGES: {
        GAME_OVER_MONEY: 'Game Over! You ran out of money!',
        GAME_OVER_HEALTH: 'Game Over! Your health reached 0.',
        WELCOME: 'Welcome to Healthcare Choices! First, choose your insurance plan.'
    },
    
    MONEY: {
        LOW_THRESHOLD: 0.5, // 50% of initial money
        CRITICAL_THRESHOLD: 0.2, // 20% of initial money
        EARNING_COOLDOWN: 2, // Number of turns before same earning option can appear again
    },
    
    EARNINGS: {
        PLASMA: {
            BASE: 50,
            HEALTH_COST: 5,
            COOLDOWN: 2
        },
        MEDICAL_TRIAL: {
            BASE: 200,
            HEALTH_RANGE: [-20, 20],
            COOLDOWN: 4
        },
        OVERTIME: {
            BASE: 100,
            HEALTH_COST: 10,
            COOLDOWN: 1
        },
        WORK: {
            BASE: 80,
            HEALTH_COST: 2,
        },
        GYM: {
            MONEY_COST: 30,
            HEALTH_GAIN: 10
        }
    },
    
    // UI Elements
    UI: {
        LABELS: {
            AGE: '👤',
            OCCUPATION: '💼',
            INSURANCE: 'Insurance:',
            MONEY: '💰',
            HEALTH: '❤️',
            NEED_MONEY: 'Actions:'
        },
        MONEY_ACTIONS: [
            {
                id: 'sellPlasma',
                text: 'Sell Plasma (-5 Health, +$50)'
            },
            {
                id: 'medicalTrial',
                text: 'Medical Trial (Risk/Reward)'
            },
            {
                id: 'crowdfunding',
                text: 'Try Crowdfunding'
            },
            {
                id: 'work',
                text: 'Work Shift'
            },
            {
                id: 'gym',
                text: 'Go to Gym (-$30, +10 Health)'
            }
        ],
        INITIAL_VALUES: {
            AGE: '25',
            OCCUPATION: 'School',
            INSURANCE: 'None',
            MONEY: '$1000',
            HEALTH: '50'
        }
    }
}; 