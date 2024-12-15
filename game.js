class Game {
    constructor() {
        // Initialize elements first
        this.initializeElements();
        
        // Initialize UI elements with constants
        this.initializeUI();
        
        this.hasChosenInsurance = false;
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize money buttons
        this.initializeMoneyButtons();
        
        // Add decay tracking
        this.decayStarted = false;
        this.healthDecayInterval = null;
        this.moneyDecayInterval = null;
        
        // Add cooldown tracking
        this.lastPlasmaTime = 0;
        this.lastTrialTime = 0;
        this.lastCrowdfundTime = 0;
        
        // Start decay after insurance choice
        this.startDecay();
        
        // Set up initial insurance choice scenario
        this.currentScenario = {
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
        
        // Type out the insurance choice scenario
        this.typeWriter(this.currentScenario.text, this.scenarioText, () => {
            // Set button texts and show them one by one
            this.choiceABtn.textContent = this.currentScenario.choiceA.text;
            this.choiceBBtn.textContent = this.currentScenario.choiceB.text;
            this.choiceCBtn.textContent = this.currentScenario.choiceC.text;
            
            // Show buttons one by one with delay
            this.choiceABtn.style.display = 'block';
            setTimeout(() => {
                this.choiceABtn.classList.add('fade-in');
                this.choiceABtn.disabled = false;
                
                setTimeout(() => {
                    this.choiceBBtn.style.display = 'block';
                    this.choiceBBtn.classList.add('fade-in');
                    this.choiceBBtn.disabled = false;
                    
                    setTimeout(() => {
                        this.choiceCBtn.style.display = 'block';
                        this.choiceCBtn.classList.add('fade-in');
                        this.choiceCBtn.disabled = false;
                    }, 200);
                }, 200);
            }, 200);
        });
        
        // Initialize buttons as disabled initially
        this.choiceABtn.disabled = true;
        this.choiceBBtn.disabled = true;
        this.choiceCBtn.disabled = true;
    }

    initializeElements() {
        // Define all stats with their properties
        const stats = {
            money: { 
                initial: GAME_CONSTANTS.INITIAL_MONEY,
                format: (value) => `$${value.toLocaleString()}`,
                barWidth: (value) => `${(value / GAME_CONSTANTS.INITIAL_MONEY) * 100}%`
            },
            health: { 
                initial: GAME_CONSTANTS.INITIAL_HEALTH,
                format: (value) => `${value}%`,
                barWidth: (value) => `${value}%`
            },
            intelligence: { 
                initial: GAME_CONSTANTS.INITIAL_INTELLIGENCE,
                format: (value) => `${value}%`,
                barWidth: (value) => `${value}%`
            },
            social: { 
                initial: GAME_CONSTANTS.INITIAL_SOCIAL,
                format: (value) => `${value}%`,
                barWidth: (value) => `${value}%`
            },
            looks: { 
                initial: GAME_CONSTANTS.INITIAL_LOOKS,
                format: (value) => `${value}%`,
                barWidth: (value) => `${value}%`
            },
            eq: { 
                initial: GAME_CONSTANTS.INITIAL_EQ,
                format: (value) => `${value}%`,
                barWidth: (value) => `${value}%`
            },
            mental: { 
                initial: GAME_CONSTANTS.INITIAL_MENTAL,
                format: (value) => `${value}%`,
                barWidth: (value) => `${value}%`
            }
        };
        
        // Initialize all stats and their displays
        for (const [stat, config] of Object.entries(stats)) {
            // Get DOM elements
            this[`${stat}Display`] = document.getElementById(`${stat}Value`);
            this[`${stat}Bar`] = document.getElementById(`${stat}Bar`);
            
            // Set initial value
            this[stat] = config.initial;
            
            // Update display
            if (this[`${stat}Display`]) {
                this[`${stat}Display`].textContent = config.format(this[stat]);
            }
            if (this[`${stat}Bar`]) {
                this[`${stat}Bar`].style.width = config.barWidth(this[stat]);
            }
        }
        
        // Initialize non-stat elements
        this.age = 25;
        this.occupation = GAME_CONSTANTS.UI.INITIAL_VALUES.OCCUPATION;
        this.insurance = GAME_CONSTANTS.INITIAL_INSURANCE;
        
        // Get DOM elements for non-stat displays
        this.ageDisplay = document.getElementById('ageValue');
        this.occupationDisplay = document.getElementById('occupationValue');
        this.insuranceDisplay = document.getElementById('insuranceValue');
        this.scenarioText = document.getElementById('scenario');
        this.choiceABtn = document.getElementById('choiceA');
        this.choiceBBtn = document.getElementById('choiceB');
        this.choiceCBtn = document.getElementById('choiceC');
        this.newsFeed = document.getElementById('newsFeed');
        
        // Update non-stat displays
        if (this.ageDisplay) this.ageDisplay.textContent = this.age;
        if (this.occupationDisplay) this.occupationDisplay.textContent = this.occupation;
        if (this.insuranceDisplay) this.insuranceDisplay.textContent = this.insurance;
    }

    setupEventListeners() {
        this.choiceABtn.addEventListener('click', () => this.makeChoice('A'));
        this.choiceBBtn.addEventListener('click', () => this.makeChoice('B'));
        this.choiceCBtn.addEventListener('click', () => this.makeChoice('C'));
    }

    updateHealth(change, isDecay = false) {
        this.health = Math.round(Math.max(0, Math.min(GAME_CONSTANTS.MAX_HEALTH, this.health + change)));
        
        // Update display with rounded number
        this.healthDisplay.textContent = `${Math.round(this.health)}%`;
        this.healthBar.style.width = `${this.health}%`;
        
        // Add drip animation if it's a decrease
        if (change < 0) {
            this.healthBar.classList.add('dripping');
            setTimeout(() => this.healthBar.classList.remove('dripping'), 500);
            
            // Add flash for decay
            if (isDecay) {
                this.healthDisplay.classList.add('flashing');
                setTimeout(() => this.healthDisplay.classList.remove('flashing'), 500);
            }
        }
        
        // Update color based on health level and apply to both bar and number
        let healthColor;
        if (this.health < GAME_CONSTANTS.LOW_HEALTH_THRESHOLD) {
            healthColor = GAME_CONSTANTS.COLORS.LOW_HEALTH;
        } else if (this.health < GAME_CONSTANTS.MEDIUM_HEALTH_THRESHOLD) {
            healthColor = GAME_CONSTANTS.COLORS.MEDIUM_HEALTH;
        } else {
            healthColor = GAME_CONSTANTS.COLORS.GOOD_HEALTH;
        }
        
        this.healthBar.style.backgroundColor = healthColor;
        this.healthDisplay.style.color = healthColor;
        
        // Check for game over
        if (this.health <= 0) {
            this.endGame(GAME_CONSTANTS.MESSAGES.GAME_OVER_HEALTH);
        }
    }

    updateMoney(change) {
        if (!this.moneyDisplay) return; // Guard clause
        
        this.money = Math.max(0, this.money + change);
        this.moneyDisplay.textContent = `$${this.money.toLocaleString()}`;
        
        // Update money bar width based on percentage of initial money
        if (this.moneyBar) {
            const percentage = Math.min((this.money / GAME_CONSTANTS.INITIAL_MONEY) * 100, 100);
            this.moneyBar.style.width = `${percentage}%`;
        }
        
        // Check for game over
        if (this.money <= 0) {
            this.endGame(GAME_CONSTANTS.MESSAGES.GAME_OVER_MONEY);
        }
    }

    updateInsurance(newInsurance) {
        this.insurance = newInsurance;
        this.insuranceDisplay.textContent = newInsurance.charAt(0).toUpperCase() + newInsurance.slice(1);
        console.log('Insurance updated to:', newInsurance);
    }

    makeChoice(choice) {
        console.log('Making choice:', choice);
        if (!this.currentScenario) return;
        
        let effect;
        if (this.currentScenario.getChoices) {
            console.log('Getting dynamic choices for insurance:', this.insurance);
            const choices = this.currentScenario.getChoices(this.insurance);
            effect = choice === 'A' ? choices.choiceA : 
                    choice === 'B' ? choices.choiceB : choices.choiceC;
        } else {
            effect = choice === 'A' ? this.currentScenario.choiceA : 
                    choice === 'B' ? this.currentScenario.choiceB : 
                    this.currentScenario.choiceC;
        }
        
        console.log('Current scenario:', this.currentScenario);
        console.log('Selected effect:', effect);
        
        // Generate news item based on choice and scenario
        const newsText = this.generateNewsText(this.currentScenario.text, effect, choice);
        console.log('Generated news text:', newsText);
        if (newsText) {
            console.log('Adding news item to feed');
            this.addNewsItem(newsText);
        }
        
        // Handle insurance effect first
        if (effect.insuranceEffect) {
            console.log('Updating insurance to:', effect.insuranceEffect);
            this.updateInsurance(effect.insuranceEffect);
            this.hasChosenInsurance = true;
            console.log('Has chosen insurance:', this.hasChosenInsurance);
        }
        
        const healthChange = Math.floor(Math.random() * 
            (effect.healthEffect[1] - effect.healthEffect[0] + 1)) + effect.healthEffect[0];
        const moneyChange = Math.floor(Math.random() * 
            (effect.moneyEffect[1] - effect.moneyEffect[0] + 1)) + effect.moneyEffect[0];
        
        // Show toast for the choice effects
        if (healthChange !== 0 || moneyChange !== 0) {
            let message = '';
            if (healthChange !== 0) message += `Health ${healthChange > 0 ? '+' : ''}${healthChange} `;
            if (moneyChange !== 0) message += `Money ${moneyChange > 0 ? '+$' : '-$'}${Math.abs(moneyChange)}`;
            const button = choice === 'A' ? this.choiceABtn : 
                          choice === 'B' ? this.choiceBBtn : 
                          this.choiceCBtn;
            this.showToast(message.trim(), healthChange < 0 || moneyChange < 0 ? 'warning' : 'health-effect', button);
        }
        
        this.updateHealth(healthChange);
        this.updateMoney(moneyChange);

        // Check game-ending conditions
        if (this.money <= 0) {
            this.endGame(GAME_CONSTANTS.MESSAGES.GAME_OVER_MONEY);
            return;
        }
        if (this.health <= 0) {
            this.endGame(GAME_CONSTANTS.MESSAGES.GAME_OVER_HEALTH);
            return;
        }

        // Remove fade-in classes for next scenario
        this.choiceABtn.classList.remove('fade-in');
        this.choiceBBtn.classList.remove('fade-in');
        this.choiceCBtn.classList.remove('fade-in');
        
        // Continue with next scenario
        this.nextScenario();
    }

    generateNewsText(scenarioText, effect, choice) {
        // Don't generate news for insurance choice
        if (effect.insuranceEffect) return null;

        let outcome = '';
        const healthChange = (effect.healthEffect[0] + effect.healthEffect[1]) / 2;
        const moneyChange = (effect.moneyEffect[0] + effect.moneyEffect[1]) / 2;

        if (healthChange > 0) {
            outcome = 'You feel better';
        } else if (healthChange < 0) {
            outcome = 'You feel worse';
        }

        if (moneyChange !== 0) {
            outcome += moneyChange > 0 ? ' and earned $' + Math.abs(Math.round(moneyChange)) : 
                                       ' and spent $' + Math.abs(Math.round(moneyChange));
        }

        // Remove the question mark if present
        const situation = scenarioText.replace(/\?$/, '').trim();
        return `📰 ${situation} You ${effect.text.toLowerCase()}. ${outcome}.`;
    }

    addNewsItem(text) {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.textContent = text;

        this.newsFeed.style.display = 'block';
        this.newsFeed.classList.add('visible');
        
        this.newsFeed.appendChild(newsItem);
        console.log('News feed children:', this.newsFeed.children.length);

        // Keep only last 3 news items
        while (this.newsFeed.children.length > 3) {
            this.newsFeed.removeChild(this.newsFeed.firstChild);
        }
    }

    nextScenario() {
        console.log('Next scenario called. Has chosen insurance:', this.hasChosenInsurance);
        // If insurance hasn't been chosen yet, keep showing insurance choice
        if (!this.hasChosenInsurance) {
            console.log('Waiting for insurance choice');
            return; // Don't change scenario until insurance is chosen
        }
        
        console.log('Getting new scenario');
        // Get current scenario index in regular scenarios
        const currentIndex = REGULAR_SCENARIOS.indexOf(this.currentScenario);
        console.log('Current scenario index:', currentIndex);
        
        // Determine if we should prioritize money scenarios
        const needMoney = shouldShowMoneyScenario(this.money, GAME_CONSTANTS.INITIAL_MONEY);
        
        // Get available scenarios based on money situation
        const availableScenarios = needMoney ? 
            MONEY_SCENARIOS : 
            REGULAR_SCENARIOS.filter(s => !MONEY_SCENARIOS.includes(s));
        
        // Get a new random index that's different from the current one
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * availableScenarios.length);
        } while (newIndex === currentIndex);
        
        this.currentScenario = availableScenarios[newIndex];
        
        // Update the scenario text and choices
        if (this.currentScenario) {
            // Hide all buttons initially
            this.choiceABtn.style.opacity = '0';
            this.choiceBBtn.style.opacity = '0';
            this.choiceCBtn.style.opacity = '0';
            
            // Update scenario text with typewriter effect
            this.typeWriter(this.currentScenario.text, this.scenarioText, () => {
                // After text is typed, set up the choices
                let choices;
                if (this.currentScenario.getChoices) {
                    choices = this.currentScenario.getChoices(this.insurance);
                    this.choiceABtn.textContent = choices.choiceA.text;
                    this.choiceBBtn.textContent = choices.choiceB.text;
                    this.choiceCBtn.textContent = choices.choiceC.text;
                } else {
                    this.choiceABtn.textContent = this.currentScenario.choiceA.text;
                    this.choiceBBtn.textContent = this.currentScenario.choiceB.text;
                    this.choiceCBtn.textContent = this.currentScenario.choiceC.text;
                }

                // Show buttons one by one with delay
                this.choiceABtn.style.display = 'block';
                setTimeout(() => {
                    this.choiceABtn.classList.add('fade-in');
                    this.choiceABtn.disabled = false;
                    
                    setTimeout(() => {
                        this.choiceBBtn.style.display = 'block';
                        this.choiceBBtn.classList.add('fade-in');
                        this.choiceBBtn.disabled = false;
                        
                        setTimeout(() => {
                            this.choiceCBtn.style.display = 'block';
                            this.choiceCBtn.classList.add('fade-in');
                            this.choiceCBtn.disabled = false;
                        }, 200);
                    }, 200);
                }, 200);
            });
        }
    }

    endGame(message) {
        // Clear decay intervals
        if (this.healthDecayInterval) clearInterval(this.healthDecayInterval);
        if (this.moneyDecayInterval) clearInterval(this.moneyDecayInterval);
        
        this.typeWriter(message, this.scenarioText);
        this.choiceABtn.style.display = 'none';
        this.choiceBBtn.style.display = 'none';
        this.choiceCBtn.style.display = 'none';
    }

    initializeMoneyButtons() {
        // Initialize money-earning buttons
        this.sellPlasmaBtn = document.getElementById('sellPlasma');
        this.medicalTrialBtn = document.getElementById('medicalTrial');
        this.crowdfundingBtn = document.getElementById('crowdfunding');
        this.workBtn = document.getElementById('work');
        this.gymBtn = document.getElementById('gym');

        // Add event listeners
        this.sellPlasmaBtn.addEventListener('click', () => this.sellPlasma());
        this.medicalTrialBtn.addEventListener('click', () => this.participateInTrial());
        this.crowdfundingBtn.addEventListener('click', () => this.startCrowdfunding());
        this.workBtn.addEventListener('click', () => this.work());
        this.gymBtn.addEventListener('click', () => this.goToGym());
    }

    sellPlasma() {
        const now = Date.now();
        if (now - this.lastPlasmaTime < 7 * 24 * 60 * 60 * 1000) { // 7 days cooldown
            this.showToast("Must wait 7 days between plasma donations!", 'warning', this.sellPlasmaBtn);
            return;
        }
        
        this.updateHealth(-5);
        this.updateMoney(50);
        this.showToast("Sold plasma: -5 Health, +$50", 'health-effect', this.sellPlasmaBtn);
        this.lastPlasmaTime = now;
        this.sellPlasmaBtn.disabled = true;
        setTimeout(() => this.sellPlasmaBtn.disabled = false, 7 * 24 * 60 * 60 * 1000);
    }

    participateInTrial() {
        const now = Date.now();
        if (now - this.lastTrialTime < 30 * 24 * 60 * 60 * 1000) { // 30 days cooldown
            this.showToast("Must wait 30 days between medical trials!", 'warning', this.medicalTrialBtn);
            return;
        }

        const healthEffect = Math.floor(Math.random() * 41) - 20; // -20 to +20
        this.updateHealth(healthEffect);
        this.updateMoney(200);
        this.showToast(`Medical trial: ${healthEffect > 0 ? '+' : ''}${healthEffect} Health, +$200`, 
            healthEffect < 0 ? 'warning' : 'health-effect', this.medicalTrialBtn);
        this.lastTrialTime = now;
        this.medicalTrialBtn.disabled = true;
        setTimeout(() => this.medicalTrialBtn.disabled = false, 30 * 24 * 60 * 60 * 1000);
    }

    startCrowdfunding() {
        const now = Date.now();
        if (now - this.lastCrowdfundTime < 14 * 24 * 60 * 60 * 1000) { // 14 days cooldown
            this.showToast("Must wait 14 days between crowdfunding campaigns!", 'warning', this.crowdfundingBtn);
            return;
        }

        const amount = Math.floor(Math.random() * 301); // 0 to 300
        this.updateMoney(amount);
        this.showToast(`Crowdfunding raised: +$${amount}`, 'money-effect', this.crowdfundingBtn);
        this.lastCrowdfundTime = now;
        this.crowdfundingBtn.disabled = true;
        setTimeout(() => this.crowdfundingBtn.disabled = false, 14 * 24 * 60 * 60 * 1000);
    }

    work() {
        this.updateHealth(-GAME_CONSTANTS.EARNINGS.WORK.HEALTH_COST);
        this.updateMoney(GAME_CONSTANTS.EARNINGS.WORK.BASE);
        this.showToast(`Worked shift: -${GAME_CONSTANTS.EARNINGS.WORK.HEALTH_COST} Health, +$${GAME_CONSTANTS.EARNINGS.WORK.BASE}`, 'money-effect', this.workBtn);
    }

    goToGym() {
        if (this.money < GAME_CONSTANTS.EARNINGS.GYM.MONEY_COST) {
            this.showToast("Not enough money for gym!", 'warning', this.gymBtn);
            return;
        }
        
        this.updateMoney(-GAME_CONSTANTS.EARNINGS.GYM.MONEY_COST);
        this.updateHealth(GAME_CONSTANTS.EARNINGS.GYM.HEALTH_GAIN);
        this.showToast(
            `Went to gym: -$${GAME_CONSTANTS.EARNINGS.GYM.MONEY_COST}, +${GAME_CONSTANTS.EARNINGS.GYM.HEALTH_GAIN} Health`, 
            'health-effect', 
            this.gymBtn
        );
    }

    startDecay() {
        if (this.decayStarted) return;
        
        // Base decay interval is 500ms
        const updateHealthDecay = () => {
            // Every 10 years after 25 increases decay rate by 20%, but start with a smaller base decay
            const ageEffect = Math.max(0, this.age - 25) / 10;
            const healthDecayAmount = -0.2 * (1 + (ageEffect * 0.5)); // Reduced from -1 to -0.2
            
            this.updateHealth(healthDecayAmount, true);
        };
        
        this.healthDecayInterval = setInterval(updateHealthDecay, 500);
        
        this.moneyDecayInterval = setInterval(() => {
            this.updateMoney(-1, true);
        }, 1000);

        // this.ageDecayInterval = setInterval(() => {
        //     this.updateAge(+1);
        //     // Recalculate health decay when age changes
        //     if (this.healthDecayInterval) {
        //         clearInterval(this.healthDecayInterval);
        //         this.healthDecayInterval = setInterval(updateHealthDecay, 500);
        //     }
        // }, 10000);
        
        this.decayStarted = true;
    }

    typeWriter(text, element, callback = null) {
        const speed = 30; // milliseconds per character
        let i = 0;
        element.textContent = '';
        element.classList.add('typing');
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                element.classList.remove('typing');
                if (callback) callback();
            }
        }
        
        type();
    }

    initializeUI() {
        document.querySelector('.insurance-label').textContent = 'Insurance:';
        document.querySelector('.money-actions h3').textContent = GAME_CONSTANTS.UI.LABELS.NEED_MONEY;

        // Initialize money buttons
        const moneyButtonsContainer = document.querySelector('.money-buttons');
        GAME_CONSTANTS.UI.MONEY_ACTIONS.forEach(action => {
            const button = document.createElement('button');
            button.id = action.id;
            button.className = 'money-btn';
            button.textContent = action.text;
            moneyButtonsContainer.appendChild(button);
        });

        this.insuranceDisplay.textContent = GAME_CONSTANTS.UI.INITIAL_VALUES.INSURANCE;
    }

    showToast(message, type = 'info', button = null) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        if (button) {
            // Position toast above the button
            const buttonRect = button.getBoundingClientRect();
            toast.style.position = 'fixed';
            toast.style.left = `${buttonRect.left + (buttonRect.width / 2)}px`; // Center above button
            toast.style.top = `${buttonRect.top - 10}px`; // Slightly above button
        }
        
        document.body.appendChild(toast);
        
        // Remove the toast after animation completes
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 1500); // Match animation duration
    }

    updateAge(change) {
        this.age = Math.round(this.age + change);
        this.ageDisplay.textContent = this.age;
        
        // Check for age-specific scenarios
        if (this.age === 26) {
            // Force the 26-year-old insurance scenario
            this.currentScenario = AGE_SPECIFIC_SCENARIOS[26];
            
            // Clear current choices
            this.choiceABtn.style.display = 'none';
            this.choiceBBtn.style.display = 'none';
            this.choiceCBtn.style.display = 'none';
            
            // Type out the new scenario
            this.typeWriter(this.currentScenario.text, this.scenarioText, () => {
                // Show buttons one by one with delay
                this.choiceABtn.textContent = this.currentScenario.choiceA.text;
                this.choiceBBtn.textContent = this.currentScenario.choiceB.text;
                this.choiceCBtn.textContent = this.currentScenario.choiceC.text;
                
                this.choiceABtn.style.display = 'block';
                setTimeout(() => {
                    this.choiceABtn.classList.add('fade-in');
                    this.choiceABtn.disabled = false;
                    
                    setTimeout(() => {
                        this.choiceBBtn.style.display = 'block';
                        this.choiceBBtn.classList.add('fade-in');
                        this.choiceBBtn.disabled = false;
                        
                        setTimeout(() => {
                            this.choiceCBtn.style.display = 'block';
                            this.choiceCBtn.classList.add('fade-in');
                            this.choiceCBtn.disabled = false;
                        }, 200);
                    }, 200);
                }, 200);
            });
        }
        
        // Optional: Check for other occupation changes based on age
        if (this.age === 22) {
            this.updateOccupation('College Graduate');
        }
    }

    updateOccupation(newOccupation) {
        this.occupation = newOccupation;
        this.occupationDisplay.textContent = newOccupation;
        // Show toast for occupation change
        this.showToast(`New occupation: ${newOccupation}`, 'money-effect');
    }

    updateLearning(change) {
        this.learning = Math.max(0, Math.min(GAME_CONSTANTS.MAX_LEARNING, this.learning + change));
        this.learningDisplay.textContent = `${Math.round(this.learning)}%`;
        this.learningBar.style.width = `${this.learning}%`;
    }

    updateAppearance(change) {
        this.appearance = Math.max(0, Math.min(GAME_CONSTANTS.MAX_APPEARANCE, this.appearance + change));
        this.appearanceDisplay.textContent = `${Math.round(this.appearance)}%`;
        this.appearanceBar.style.width = `${this.appearance}%`;
    }

    updateMentalHealth(change, isDecay = false) {
        const oldMentalHealth = this.mentalHealth;
        this.mentalHealth = Math.round(Math.max(0, Math.min(GAME_CONSTANTS.MAX_MENTAL_HEALTH, this.mentalHealth + change)));
        
        // Update display with rounded number
        this.mentalHealthDisplay.textContent = `${Math.round(this.mentalHealth)}%`;
        this.mentalHealthBar.style.width = `${this.mentalHealth}%`;
        
        // Add drip animation if it's a decrease
        if (change < 0) {
            this.mentalHealthBar.classList.add('dripping');
            setTimeout(() => this.mentalHealthBar.classList.remove('dripping'), 500);
            
            // Add flash for decay
            if (isDecay) {
                this.mentalHealthDisplay.classList.add('flashing');
                setTimeout(() => this.mentalHealthDisplay.classList.remove('flashing'), 500);
            }
        }
        
        // Update color based on mental health level
        let mentalHealthColor;
        if (this.mentalHealth < GAME_CONSTANTS.LOW_MENTAL_HEALTH_THRESHOLD) {
            mentalHealthColor = GAME_CONSTANTS.COLORS.LOW_HEALTH;
        } else if (this.mentalHealth < GAME_CONSTANTS.MEDIUM_MENTAL_HEALTH_THRESHOLD) {
            mentalHealthColor = GAME_CONSTANTS.COLORS.MEDIUM_HEALTH;
        } else {
            mentalHealthColor = GAME_CONSTANTS.COLORS.MENTAL_HEALTH;
        }
        
        this.mentalHealthBar.style.backgroundColor = mentalHealthColor;
        this.mentalHealthDisplay.style.color = mentalHealthColor;
    }

    updateIntelligence(change) {
        this.intelligence = Math.max(0, Math.min(GAME_CONSTANTS.MAX_INTELLIGENCE, this.intelligence + change));
        this.intelligenceDisplay.textContent = `${Math.round(this.intelligence)}%`;
        this.intelligenceBar.style.width = `${this.intelligence}%`;
    }

    updateSocial(change) {
        this.social = Math.max(0, Math.min(GAME_CONSTANTS.MAX_SOCIAL, this.social + change));
        this.socialDisplay.textContent = `${Math.round(this.social)}%`;
        this.socialBar.style.width = `${this.social}%`;
    }

    updateLooks(change) {
        this.looks = Math.max(0, Math.min(GAME_CONSTANTS.MAX_LOOKS, this.looks + change));
        this.looksDisplay.textContent = `${Math.round(this.looks)}%`;
        this.looksBar.style.width = `${this.looks}%`;
    }

    updateEQ(change) {
        this.eq = Math.max(0, Math.min(GAME_CONSTANTS.MAX_EQ, this.eq + change));
        this.eqDisplay.textContent = `${Math.round(this.eq)}%`;
        this.eqBar.style.width = `${this.eq}%`;
    }

    updateMental(change) {
        this.mental = Math.max(0, Math.min(GAME_CONSTANTS.MAX_MENTAL, this.mental + change));
        this.mentalDisplay.textContent = `${Math.round(this.mental)}%`;
        this.mentalBar.style.width = `${this.mental}%`;
    }

    verifyElements() {
        const requiredElements = {
            'healthDisplay': this.healthDisplay,
            'healthBar': this.healthBar,
            'intelligenceDisplay': this.intelligenceDisplay,
            'intelligenceBar': this.intelligenceBar,
            'socialDisplay': this.socialDisplay,
            'socialBar': this.socialBar,
            'looksDisplay': this.looksDisplay,
            'looksBar': this.looksBar,
            'eqDisplay': this.eqDisplay,
            'eqBar': this.eqBar,
            'mentalDisplay': this.mentalDisplay,
            'mentalBar': this.mentalBar,
            'moneyDisplay': this.moneyDisplay,
            'moneyBar': this.moneyBar
        };

        for (const [name, element] of Object.entries(requiredElements)) {
            if (!element) {
                console.error(`Missing required element: ${name}`);
                return false;
            }
        }
        return true;
    }
}

// Add the event listener outside the class
window.addEventListener('load', () => {
    new LoadScreen(() => {
        new Game();
    });
}); 