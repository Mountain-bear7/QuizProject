const dom = {
    title: document.getElementById('title'),
    progress: {
        progressFill: document.getElementById('progress-fill'),
        questionNumber: document.getElementById('question-number'),
        totalQuestions: document.getElementById('total-questions'),
    },
    questionWrap: document.getElementById('question-wrap'),
    step: {
        question: document.getElementById('question'),
        questionPosition: document.getElementById('question-position'),
    },
    answers: document.getElementById('answers'),
    next: document.getElementById('next'),
    result: {
        resultBlock: document.getElementById('result'),
        validAnswers: document.getElementById('valid-answers'),
        questionsCount: document.getElementById('result-total-questions'),
    }
}

let totalSteps = data.questions.length
let step = 0
let validAnswersCount = 0

//Клик по кнопке "Следующий вопрос"
dom.next.onclick = () => {
    step = step < totalSteps ? step + 1 : step
    renderQuiz(totalSteps, step)
}

//Функция отрисовки всего опроса
function renderQuiz(total, step){
    renderProgress(total, step)
    if(step+1 == total){
        changeButtonOnResult()
    }
    if (step < total){
        const answers = data.questions[step].answers
        const answersHtml = buildAnswers(answers)
        renderQuestion(step)
        renderAnswers(answersHtml)
        isDisableButton(true)
    }else if(step == total){
        renderResults()
    }

}
renderQuiz(totalSteps, step)

//Отрисовка данных прогресс-бара
function renderProgress(total, step){
    const prograssPrecent = 100 / total * step
    dom.progress.questionNumber.innerHTML = step
    dom.progress.totalQuestions.innerHTML = total
    dom.progress.progressFill.style.width = `${prograssPrecent}%`
}

//Отрисовка вопросов
function renderQuestion(step){
    dom.step.questionPosition.innerHTML = `${step + 1}.`
    dom.step.question.innerHTML = data.questions[step].question
}

//Создание HTMl кода для ответов
function buildAnswers(answers){
    const answersHTML = []
    answers.forEach((answer, idx) =>{
    const html = `<div class="quiz__answer" data-id="${idx+1}">${answer}</div>`
    answersHTML.push(html)
    })
    return answersHTML.join('')
}
const answersHTML = buildAnswers(data.questions[0].answers)

//Отрисовка ответов
function renderAnswers(htmlString){
    dom.answers.innerHTML = htmlString
}

//Отслеживание клика на ответе
dom.answers.onclick = (event) =>{
    const target = event.target
    if(target.classList.contains('quiz__answer')){
        const answerNumber = target.dataset.id
        const isValid = checkAnswer(step, answerNumber)
        const answerClass = isValid 
        ? 'quiz__answer_valid'
        : 'quiz__answer_invalid'
        target.classList.add(answerClass)
        isDisableButton(false)
        validAnswersCount = isValid ? validAnswersCount + 1 : validAnswersCount
    }
}

//Проверка правильности ответа
function checkAnswer(step, answer){
    const validAnswer = data.questions[step].validAnswer
    return validAnswer == answer
}

//Блокировка кнопки
function isDisableButton(isDisable){
    if(isDisable){
        dom.next.classList.add('quiz__btn_disable')
    }
    else{
        dom.next.classList.remove('quiz__btn_disable')
    }
}

//Смена надписи на кнопке
function changeButtonOnResult(){
        dom.next.innerText = 'Посмотреть результат'
        dom.next.dataset.result = 'result'
}

//Показать результат опроса
function renderResults(){
    //Скрываем
    dom.answers.style.display = 'none'
    dom.next.style.display = 'none'
    dom.questionWrap.style.display = 'none'
    //Показываем
    dom.result.resultBlock.style.display = 'block'
    dom.result.validAnswers.innerHTML = validAnswersCount
    dom.result.questionsCount.innerHTML = totalSteps
}