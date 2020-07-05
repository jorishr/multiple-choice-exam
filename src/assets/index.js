(() => {
    const examData  = require('./exam-data/question.json');
    const submitBtn = document.querySelector('form > button');
    
    generateQuestions();

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if(validate()){
            const score = getScore();
            updateScoreboard(score);
            clearFields();
            hideQuestions();   
        };
    });

    function generateQuestions(){
        for(let i = 0; i < examData.length; i++){
            const questionList = document.querySelector('.question-list');
            const questionBox  = document.createElement('div');
            questionBox.classList.add('question')
            questionBox.innerHTML = `
                <h2 class="question__question"></h2>
                <fieldset class="question__options">
                    <legend>Choose one answer</legend>
                    <input type="radio" name=""/>
                    <label for=""></label>
                    <input type="radio" name=""/>
                    <label for=""></label>
                    <input type="radio" name=""/>
                    <label for=""></label>
                </div>
            `
            questionList.append(questionBox);
            document.querySelectorAll('.question__question')[i]
                .innerText   = examData[i].question;    
            const fieldsets  = document.querySelectorAll('fieldset')[i];
            const inputElems = fieldsets.querySelectorAll('input');
            const labelElems = fieldsets.querySelectorAll('label');
            const choices    = examData[i].choices;

            for(let j = 0; j < choices.length; j++){
                inputElems[j].value = choices[j];
                inputElems[j].setAttribute('name', `question${i + 1}`);//  i not j
                labelElems[j].setAttribute('for', `question${i + 1}`);
                labelElems[j].innerHTML = choices[j];
            }
        }   
    };

    function validate(){
        const options = Array.from(document.querySelectorAll('input'));
        const answers = options.filter(el => el.checked);
        if(answers.length !== examData.length){
            return confirm('You did not answer all questions. Are you sure you want to submit your exam?');
        } else return true;
    }

    function getScore(){
        let score = 0;
        const options = Array.from(document.querySelectorAll('input'));
        const answer  = options.filter(el => el.checked);
        for(let i = 0; i < answer.length; i++){
            if(answer[i].value === examData[i].answer) score++;
        }
        return score;
    }

    function updateScoreboard(score){
        document.querySelector('.score__title').innerText = `Your score is: ${score} / ${examData.length}`;
        score >= Math.ceil(examData.length / 2) ? 
            document.querySelector('.score__evaluation').innerText = `You passed the exam.`
            : document.querySelector('.score__evaluation').innerText = `You failed the exam.`
    }

    function clearFields(){
        const inputs = Array.from(document.querySelectorAll('input'));
        inputs.filter(input => input.checked)
            .forEach(input => input.checked = false);
    }

    function hideQuestions(){
        document.querySelector('form').style.display = 'none';
    }
})();