const levelTitle = document.getElementById('level-title');
const messageDisplay = document.getElementById('message');
const hintDisplay = document.getElementById('hint');
const inputContainer = document.getElementById('input-container');
const livesDisplay = document.getElementById('lives-display');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let playerLives = 5;
let levelManager;
let savedPassword;

function initializeGame() {
    if (!levelTitle || !messageDisplay || !hintDisplay || !inputContainer || !livesDisplay || !canvas || !ctx) {
        console.error('CRITICAL ERROR: One or more essential elements are missing from the HTML.');
        return;
    }

    canvas.width = 800;
    canvas.height = 600;

    playerLives = 5;
    savedPassword = null;
    updateLivesDisplay();

    // Initialize levelManager here!
    levelManager = new Level1();
    levelManager.setupLevel();

    gameLoop();
}



function updateLivesDisplay() {
    livesDisplay.textContent = `Lives: ${playerLives}`;
}

function loseLife() {
    playerLives--;
    alert("You lost a life!");
    updateLivesDisplay();
    if (playerLives <= 0) {
        alert("Game Over! Restarting...");
        restartGame();
    }
}

function nextLevel(nextLevel) {
    alert("Great job! Moving to the next level...");
    levelManager = nextLevel;
    levelManager.setupLevel();
}

function setSavedPassword(password) {
    savedPassword = password;
}

function getSavedPassword() {
    return savedPassword;
}

function restartGame() {
    playerLives = 3;
    updateLivesDisplay();
    savedPassword = null;
    levelManager = new Level1();
    levelManager.setupLevel();
}

function gameLoop() {
    if (!levelManager) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    levelManager.update();
    levelManager.render(ctx);
    requestAnimationFrame(gameLoop);
}

class Level1 {
    constructor() {
        this.title = "Level 1: Create a Strong Password";
        this.message = "Create a good strong password (Hint: use a passphrase)";
        this.hint = "Example: CorrectBatteryHorseStaple";
    }

    setupLevel() {
        levelTitle.textContent = this.title;
        messageDisplay.textContent = this.message;
        hintDisplay.textContent = this.hint;
        hintDisplay.style.display = 'block';

        inputContainer.innerHTML = `
            <input type="password" id="password-input" placeholder="Enter password">
            <button id="submit-button">Submit</button>
        `;

        const submitButton = document.getElementById('submit-button');
        if (submitButton) {
            submitButton.onclick = () => {
                const password = document.getElementById('password-input').value;
                this.checkPassword(password);
            };
        }
    }

    checkPassword(password) {
        if (password.length >= 12) {
            setSavedPassword(password);
            nextLevel(new Level2());
        } else {
            loseLife();
        }
    }

    update() { }
    render(ctx) { }
}

class Level2 {
    constructor() {
        this.title = "Level 2: Guess Mary's Password";
        this.message = "Guess Mary's password. Mary was born on 03/20/2005.";
        this.correctPassword = "Mary2005";
    }

    setupLevel() {
        levelTitle.textContent = this.title;
        messageDisplay.textContent = this.message;
        hintDisplay.style.display = 'none';

        inputContainer.innerHTML = `
            <input type="password" id="guess-input" placeholder="Enter password">
            <button id="guess-submit-button">Submit</button>
        `;

        const submitButton = document.getElementById('guess-submit-button');
        if (submitButton) {
            submitButton.onclick = () => {
                const guess = document.getElementById('guess-input').value;
                this.checkGuess(guess);
            };
        }
    }

    checkGuess(guess) {
        if (guess === this.correctPassword) {
            nextLevel(new Level3());
        } else {
            loseLife();
        }
    }

    update() { }
    render(ctx) { }
}

class Level3 {
    constructor() {
        this.title = "Level 3: Decode the Cipher";
        this.message = "Decode the Caesar cipher: 'Wklv lv d whvw'";
        this.hint = "Hint: Shift backward by 3!";
        this.correctAnswer = "This is a test";
    }

    setupLevel() {
        levelTitle.textContent = this.title;
        messageDisplay.textContent = this.message;
        hintDisplay.textContent = this.hint;
        hintDisplay.style.display = 'block';

        inputContainer.innerHTML = `
            <input type="text" id="cipher-input" placeholder="Enter decoded text">
            <button id="cipher-submit-button">Submit</button>
        `;

        const submitButton = document.getElementById('cipher-submit-button');
        if (submitButton) {
            submitButton.onclick = () => {
                const answer = document.getElementById('cipher-input').value;
                this.checkAnswer(answer);
            };
        }
    }

    checkAnswer(answer) {
        if (answer.toLowerCase() === this.correctAnswer.toLowerCase()) {
            nextLevel(new Level4());
        } else {
            loseLife();
        }
    }

    update() { }
    render(ctx) { }
}

class Level4 {
    constructor() {
        this.title = "Level 4: Spot the Phishing Scam";
        this.message = "Click on the real emails only:";
        this.emailSubjects = [
            "Your bank needs immediate verification! ",
            "Amazon Order Confirmation - Thank you for your purchase!",
            "URGNT: Your account has been compromised! Click here to secure. ",
            "Weekly Newsletter - Top Security Tips ",
            "You've won a free vacation! Claim now. "
        ];
        this.isPhishing = [true, false, true, false, true];
        this.correctSelections = 0;
        this.totalRealEmails = this.isPhishing.filter(isReal => !isReal).length;
    }

    setupLevel() {
        levelTitle.textContent = this.title;
        messageDisplay.textContent = this.message;
        hintDisplay.style.display = 'none';
        inputContainer.innerHTML = "";
        this.emailSubjects.forEach((subject, index) => {
            const button = document.createElement("button");
            button.textContent = subject;
            button.classList.add("option-button");
            button.onclick = () => this.checkEmail(index, button);
            inputContainer.appendChild(button);
        });
    }

    checkEmail(index, button) {
        if (this.isPhishing[index]) {
            loseLife();
            button.classList.add("incorrect-answer");
        } else {
            this.correctSelections++;
            button.classList.add("correct-answer");
        }

        button.disabled = true;

        if (this.correctSelections === this.totalRealEmails) {
            nextLevel(new Level5());
        }
    }

    update() { }
    render(ctx) { }
}

class Level5 {
    constructor() {
        this.title = "Level 5: Retype Your Password";
        this.message = "Retype your password to proceed:";
    }

    setupLevel() {
        levelTitle.textContent = this.title;
        messageDisplay.textContent = this.message;
        hintDisplay.style.display = 'none';

        inputContainer.innerHTML = `
            <input type="password" id="retype-input" placeholder="Enter password">
            <button id="retype-submit-button">Submit</button>
        `;

        const submitButton = document.getElementById('retype-submit-button');
        if (submitButton) {
            submitButton.onclick = () => {
                const retypedPassword = document.getElementById('retype-input').value;
                this.checkPassword(retypedPassword);
            };
        }
    }

    checkPassword(retypedPassword) {
        if (retypedPassword === getSavedPassword()) {
            nextLevel(new Level6());
        } else {
            loseLife();
        }
    }

    update() { }
    render(ctx) { }
}

class Level6 {
    constructor() {
        this.title = "Level 6: Attack the Hackers";
        this.message = "Attack the hackers! Use Spacebar to shoot.";
        this.enemies = [];
        this.bullets = [];
        this.playerX = canvas.width / 2 - 25;
        this.playerY = canvas.height - 60;
        this.score = 0;
        this.TARGET_SCORE = 20;
    }

    setupLevel() {
        levelTitle.textContent = this.title;
        messageDisplay.textContent = this.message;
        hintDisplay.style.display = 'none';
        inputContainer.innerHTML = "";
        this.spawnEnemies();

        // Use canvas bounding rectangle for mouse position
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.playerX = e.clientX - rect.left - 25; // Corrected calculation
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                this.bullets.push({ x: this.playerX + 20, y: this.playerY });
            }
        });
    }

    spawnEnemies() {
        for (let i = 0; i < 5; i++) {
            this.enemies.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height / 3 });
        }
    }

    update() {
        this.enemies.forEach(enemy => enemy.y += 2);
        this.enemies = this.enemies.filter(enemy => enemy.y < canvas.height);
        this.bullets.forEach(bullet => bullet.y -= 5);
        this.bullets = this.bullets.filter(bullet => bullet.y > 0);

        this.bullets.forEach((bullet, bulletIndex) => {
            this.enemies.forEach((enemy, enemyIndex) => {
                if (bullet.x > enemy.x && bullet.x < enemy.x + 30 && bullet.y > enemy.y && bullet.y < enemy.y + 30) {
                    this.bullets.splice(bulletIndex, 1);
                    this.enemies.splice(enemyIndex, 1);
                    this.score++;
                }
            });
        });

        if (this.enemies.length === 0) {
            this.spawnEnemies();
        }

        if (this.score >= this.TARGET_SCORE) {
            nextLevel(new Level8());
        }
    }

    render(ctx) {
        ctx.fillStyle = 'black';
        ctx.fillText("Score: " + this.score + "/" + this.TARGET_SCORE, canvas.width / 2 - 50, 70);

        ctx.fillStyle = 'blue';
        ctx.fillRect(this.playerX, this.playerY, 50, 50);

        ctx.fillStyle = 'red';
        this.enemies.forEach(enemy => ctx.fillRect(enemy.x, enemy.y, 30, 30));

        ctx.fillStyle = 'yellow';
        this.bullets.forEach(bullet => ctx.fillRect(bullet.x, bullet.y, 10, 20));
    }
}

class Level8 {
    constructor() {
        this.title = "Level 8: Protect Your Identity";
        this.message = "Answer the questions to protect your identity:";
        this.questions = [
            "Enter your real name or a made-up username?",
            "Post your home address or keep it private?",
            "Share your pet’s name (a common password hint) or something else?",
            "Reveal your birthday or keep it secret?",
            "Use a public Wi-Fi without a VPN or wait for a secure network?"
        ];
        this.options = [
            ["Real Name", "Made-up Username"],
            ["Post Address", "Keep Private"],
            ["Share Pet's Name", "Use a Random Answer"],
            ["Reveal Birthday", "Keep Secret"],
            ["Use a public Wi-Fi", "Wait for Secure Network"]
        ];
        this.safeChoices = [false, true, true, true, true];
        this.currentQuestion = 0;
        this.correctChoices = 0;
    }

    setupLevel() {
        levelTitle.textContent = this.title;
        this.showQuestion();
        hintDisplay.style.display = 'none';
    }

    showQuestion() {
        messageDisplay.textContent = this.questions[this.currentQuestion];
        inputContainer.innerHTML = "";
        this.options[this.currentQuestion].forEach((option, index) => {
            const button = document.createElement("button");
            button.textContent = option;
            button.classList.add("option-button");
            button.onclick = () => this.checkAnswer(index);
            inputContainer.appendChild(button);
        });
    }

    checkAnswer(choiceIndex) {
        if (choiceIndex === 0 && !this.safeChoices[this.currentQuestion]) {
            loseLife();
        } else {
            this.correctChoices++;
        }

        this.currentQuestion++;
        if (this.currentQuestion < this.questions.length) {
            this.showQuestion();
        } else {
            if (this.correctChoices === this.questions.length) {
                nextLevel(new Level9());
            }
        }
    }

    update() { }
    render(ctx) { }
}

class Level9 {
    constructor() {
        this.title = "Level 9: Block unsafe websites";
        this.message = "Block the unsafe websites!";
        this.messages = [
            "bankofamerica.com",
            "g00gle-security.com",
            "paypai-login.net",
            "youtube.com",
            "amaz0n-verification.com"
        ];
        this.isThreat = [false, true, true, false, true];
        this.correctSelections = 0;
        this.totalThreats = this.isThreat.filter(threat => threat).length;
    }

    setupLevel() {
        levelTitle.textContent = this.title;
        messageDisplay.textContent = this.message;
        hintDisplay.style.display = 'none';
        inputContainer.innerHTML = "";
        this.messages.forEach((message, index) => {
            const button = document.createElement("button");
            button.textContent = message;
            button.classList.add("message-button");
            button.onclick = () => this.checkMessage(index, button);
            inputContainer.appendChild(button);
        });
    }

    checkMessage(index, button) {
        if (this.isThreat[index]) {
            this.correctSelections++;
            button.classList.add("correct-answer");
            button.disabled = true;
        } else {
            loseLife();
            button.classList.add("incorrect-answer");
            button.disabled = true;
        }

        if (this.correctSelections === this.totalThreats) {
            nextLevel(new Level10());
        }
    }

    update() { }
    render(ctx) { }
}

class Level10 {
    constructor() {
        this.title = "Level 10: Escape the Digital Vault";
        this.correctDecodedMessage = "SECURE";
        this.correctTwoFACode = "123456";
        this.phishingEmails = [
            "Verify your account now or lose access!",
            "Your friend sent you a gift card! Click here.",
            "Security update required: Download now!"
        ];
        this.isPhishing = [true, false, true];
        this.wifiNetworks = ["Starbucks_WiFi", "SecureHomeNetwork", "FreeAirportWiFi"];
        this.isSafeNetwork = [false, true, false];
        this.correctSelections = 0;
        this.totalCorrectAnswers = 5;
        this.currentQuestion = 0;
        this.questions = [
            "Enter your secure password:",
            "Decode this message: 'TFDSFVS' (Caesar Cipher Shift Backwards 1)",
            "Which email is a phishing attempt?",
            "Enter the 2FA Code to unlock the escape door:",
            "Choose a secure WiFi network to escape:"
        ];
    }

    setupLevel() {
        levelTitle.textContent = this.title;
        this.showQuestion();
        hintDisplay.style.display = 'none';
    }

    showQuestion() {
        messageDisplay.textContent = this.questions[this.currentQuestion];
        inputContainer.innerHTML = "";

        switch (this.currentQuestion) {
            case 0: // Password
                inputContainer.innerHTML = `
                    <input type="password" id="password-input-level10" placeholder="Enter password">
                    <button id="password-submit-button">Submit</button>
                `;
                const passwordSubmitButton = document.getElementById('password-submit-button');
                if (passwordSubmitButton) {
                    passwordSubmitButton.onclick = () => this.checkPassword();
                }
                break;
            case 1: // Decode message
                inputContainer.innerHTML = `
                    <input type="text" id="decode-input-level10" placeholder="Enter decoded message">
                    <button id="decode-submit-button">Submit</button>
                `;
                const decodeSubmitButton = document.getElementById('decode-submit-button');
                if (decodeSubmitButton) {
                    decodeSubmitButton.onclick = () => this.checkDecode();
                }
                break;
            case 2: // Phishing email
                this.phishingEmails.forEach((email, index) => {
                    const button = document.createElement("button");
                    button.textContent = email;
                    button.classList.add("option-button");
                    button.onclick = () => this.checkPhishing(index, button);
                    inputContainer.appendChild(button);
                });
                break;
            case 3: // 2FA code
                inputContainer.innerHTML = `
                    <input type="text" id="2fa-input-level10" placeholder="Enter 2FA code">
                    <button id="2fa-submit-button">Submit</button>
                `;
                const twoFASubmitButton = document.getElementById('2fa-submit-button');
                if (twoFASubmitButton) {
                    twoFASubmitButton.onclick = () => this.check2FA();
                }
                break;
            case 4: // WiFi network
                this.wifiNetworks.forEach((network, index) => {
                    const button = document.createElement("button");
                    button.textContent = network;
                    button.classList.add("option-button");
                    button.onclick = () => this.checkWiFi(index, button);
                    inputContainer.appendChild(button);
                });
                break;
            default:
                break;
        }
    }

    checkPassword() {
        const password = document.getElementById('password-input-level10').value;
        if (password === getSavedPassword()) {
            this.correctSelections++;
            this.currentQuestion++;
            this.showQuestion();
        } else {
            loseLife();
        }
    }

    checkDecode() {
        const decoded = document.getElementById('decode-input-level10').value;
        if (decoded.toUpperCase() === this.correctDecodedMessage) {
            this.correctSelections++;
            this.currentQuestion++;
            this.showQuestion();
        } else {
            loseLife();
        }
    }

    checkPhishing(index, button) {
        if (this.isPhishing[index]) {
            this.correctSelections++;
            button.classList.add("correct-answer");
            button.disabled = true;
            this.currentQuestion++;
            this.showQuestion();
        } else {
            loseLife();
            button.classList.add("incorrect-answer");
            button.disabled = true;
        }
    }

    check2FA() {
        const code = document.getElementById('2fa-input-level10').value;
        if (code === this.correctTwoFACode) {
            this.correctSelections++;
            this.currentQuestion++;
            this.showQuestion();
        } else {
            loseLife();
        }
    }

    checkWiFi(index, button) {
        if (this.isSafeNetwork[index]) {
            this.correctSelections++;
            button.classList.add("correct-answer");
            button.disabled = true;
            if (this.correctSelections >= this.totalCorrectAnswers) {
                alert("Congratulations! You've escaped the vault!");
                restartGame();
            }
        } else {
            loseLife();
            button.classList.add("incorrect-answer");
            button.disabled = true;
        }
    }

    update() { }
    render(ctx) { }
}

window.onload = initializeGame;

