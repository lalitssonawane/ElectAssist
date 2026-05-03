document.addEventListener('DOMContentLoaded', () => {
    // --- Tab Switching Logic ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- Flashcards Logic ---
    const flashcardsData = [
        { term: 'Electoral College', def: 'A body of electors established by the US Constitution, which forms every four years for the sole purpose of electing the president and vice president.' },
        { term: 'Primary Election', def: 'An election that narrows the field of candidates before a general election.' },
        { term: 'Absentee Ballot', def: 'A vote cast by someone who is unable or unwilling to attend the official polling station.' },
        { term: 'Gerrymandering', def: 'The manipulation of an electoral constituency\'s boundaries so as to favor one party or class.' },
        { term: 'Swing State', def: 'A US state where the two major political parties have similar levels of support among voters, viewed as important in determining the overall result of a presidential election.' }
    ];

    let currentCardIndex = 0;
    const flashcardEl = document.getElementById('active-flashcard');
    const termEl = document.getElementById('flashcard-term');
    const defEl = document.getElementById('flashcard-def');
    const counterEl = document.getElementById('card-counter');

    function updateFlashcard() {
        if (!flashcardEl) return;
        flashcardEl.classList.remove('is-flipped');
        setTimeout(() => {
            termEl.textContent = flashcardsData[currentCardIndex].term;
            defEl.textContent = flashcardsData[currentCardIndex].def;
            counterEl.textContent = `${currentCardIndex + 1} / ${flashcardsData.length}`;
        }, 150);
    }

    document.getElementById('prev-card')?.addEventListener('click', () => {
        if (currentCardIndex > 0) {
            currentCardIndex--;
            updateFlashcard();
        }
    });

    document.getElementById('next-card')?.addEventListener('click', () => {
        if (currentCardIndex < flashcardsData.length - 1) {
            currentCardIndex++;
            updateFlashcard();
        }
    });

    if (termEl) updateFlashcard();

    // --- AI Assignment Logic ---
    const quizData = [
        {
            question: "Which of the following is responsible for formally electing the US President?",
            options: ["Popular Vote", "Congress", "Electoral College", "Supreme Court"],
            correct: 2
        },
        {
            question: "When are federal general elections held in the US?",
            options: ["First Tuesday of November", "Tuesday next after the first Monday in November", "First Monday of November", "Last Tuesday of October"],
            correct: 1
        },
        {
            question: "What is a Swing State?",
            options: ["A state that always votes for one party", "A state where both major parties have similar levels of support", "A state with the highest population", "A state that doesn't participate in the Electoral College"],
            correct: 1
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    if (quizArea) {
        quizData.forEach((q, qIndex) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'quiz-question';
            qDiv.innerHTML = `<h4>${qIndex + 1}. ${q.question}</h4>`;
            
            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'quiz-options';
            
            q.options.forEach((opt, optIndex) => {
                const label = document.createElement('label');
                label.className = 'quiz-option';
                label.innerHTML = `<input type="radio" name="q${qIndex}" value="${optIndex}"> ${opt}`;
                optionsDiv.appendChild(label);
            });
            
            qDiv.appendChild(optionsDiv);
            quizArea.appendChild(qDiv);
        });
    }

    document.getElementById('submit-quiz')?.addEventListener('click', () => {
        let score = 0;
        let allAnswered = true;
        quizData.forEach((q, qIndex) => {
            const selected = document.querySelector(`input[name="q${qIndex}"]:checked`);
            if (!selected) {
                allAnswered = false;
            } else if (parseInt(selected.value) === q.correct) {
                score++;
            }
        });

        if (!allAnswered) {
            alert("Please answer all questions before submitting!");
            return;
        }

        const resultDiv = document.getElementById('quiz-result');
        const feedbackText = document.getElementById('ai-feedback-text');

        resultDiv.style.display = 'block';
        let feedback = `You scored ${score} out of ${quizData.length}. `;
        if (score === quizData.length) {
            feedback += "Outstanding performance! You clearly understand the core concepts of the electoral process.";
        } else if (score > 0) {
            feedback += "Good effort! Review the flashcards to brush up on the concepts you missed.";
        } else {
            feedback += "You might need a refresher. I recommend checking out the Process Timeline and Flashcards.";
        }
        
        feedbackText.textContent = feedback;
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    });

    // --- Chat Assistant Logic ---
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    // Simple predefined responses
    const responses = {
        'how do i register to vote?': 'To register to vote, you typically need to visit your state or national election portal online, or go to a local post office or DMV. You will need a valid ID and proof of residence. Deadlines are usually 15-30 days before the election!',
        'where is my polling place?': 'Your polling place is assigned based on your registered address. You can usually find it by checking your local election board\'s website or looking at the voter card mailed to you.',
        'what is the electoral college?': 'In the US, the Electoral College is a process where electors from each state vote for the president. A candidate needs 270 out of 538 electoral votes to win. It is not decided strictly by the popular vote.',
        'what should i bring on election day?': 'Requirements vary by location. Many states require a government-issued photo ID (like a driver\'s license or passport). It is also good to bring your voter registration card and a list of candidates you support.',
        'what is mail-in voting?': 'Mail-in voting allows you to receive a ballot by mail, fill it out at home, and mail it back or drop it off at an official ballot box before election day. It is safe, secure, and convenient.',
        'what is the election process?': 'The general election process involves several stages:\n1. Voter Registration.\n2. Primary Elections & Caucuses (to choose party nominees).\n3. Campaigning & Debates.\n4. The General Election (where voters cast ballots).\n5. Counting & Certification.\nIn the US, the final step for the presidency is the Electoral College vote.',
        'how do primaries work?': 'Primary elections are held by political parties to select their nominees for the general election. They can be open (anyone can vote) or closed (only registered party members can vote).',
        'default': 'That is a great question! While I am just a simple Election Assistant demo, I recommend checking out official government election websites (like vote.gov in the US) for the most accurate and localized information.'
    };

    function addMessage(text, isUser = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const p = document.createElement('p');
        p.textContent = text;
        msgDiv.appendChild(p);

        // Remove quick replies if they exist, to keep chat clean, unless it's a new bot message
        const quickReplies = chatMessages.querySelector('.quick-replies');
        if (quickReplies && isUser) {
            quickReplies.style.display = 'none';
        }

        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleUserInput(query = null) {
        const text = query || userInput.value.trim();
        if (!text) return;

        // User message
        addMessage(text, true);
        userInput.value = '';

        // Simulate thinking delay
        setTimeout(() => {
            const lowerText = text.toLowerCase();
            let botReply = responses['default'];

            // Simple intent matching
            for (const key in responses) {
                if (key !== 'default' && lowerText.includes(key.replace('?', ''))) {
                    botReply = responses[key];
                    break;
                }
            }

            addMessage(botReply, false);
        }, 600);
    }

    // Expose function for inline onclick handlers in HTML
    window.askAssistant = function(question) {
        // Switch to assistant tab if not already there
        const assistantTabBtn = document.querySelector('[data-tab="assistant"]');
        if (!assistantTabBtn.classList.contains('active')) {
            assistantTabBtn.click();
        }
        
        handleUserInput(question);
    };

    sendBtn.addEventListener('click', () => handleUserInput());
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserInput();
        }
    });
});
