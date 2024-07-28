/**
 * Get the symbol for the given mathematical string
 * @param {string} type 
 * @returns {string}
 */
export const getSymbol = (type) => {
    let symbol;

    switch (type) {
        case 'multiplication':
            symbol = 'x';
            break;
        case 'addition':
            symbol = '+';
            break;
        case 'subtraction':
            symbol = '-';
            break;
        default:
            break;
    }

    return symbol;
}

/**
 * Return a random element from the given array
 * @param {array} arr 
 * @returns {*}
 */
export const getRandomElement = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Translate string into array of two integers
 * @param {string} numDigits 
 */
export const getDigitsArr = (numDigits) => {
    return numDigits.split('x');
}

/**
 * Return the answer for the given question
 * @param {object} question 
 * @returns {integer}
 */
export const getAnswer = (question) => {
    let answer;

    switch (question.type) {
        case 'multiplication':
            answer = question.first * question.second
            break;
        case 'addition':
            answer = question.first + question.second
            break;
        case 'subtraction':
            answer = question.first - question.second
            break;
        default:
            break;
    }

    return answer;
}

export const getDistanceToNearestTen = (n) => {
    let distanceToTen;

    if (n > 5) {
        distanceToTen = 10 % n;
    } else {
        distanceToTen = n % 10;
    }

    return distanceToTen;
}

/**
 * Get zero-indexed digit of a number as an integer
 *
 * @param {integer|string} number The number to parse
 * @param {integer|string} digit Zero-indexed digit to get
 * @returns {integer}
 */
export const getDigit = (number, digit) => {
    return parseInt(number.toString()[digit]);
}

export const swapQuestion = (question) => {
    return {
        ...question,
        first: question.second,
        second: question.first,
    };
}

 /**
 * Return a string of the question and answer, e.g. "70 x 66 = 4620"
 * @param {object} question 
 * @returns {string}
 */
export const getQuestionAndAnswerText = (question) => {
    const answer = getAnswer(question);

    return `${question.first} ${getSymbol(question.type)} ${question.second} = ${answer}`;
}

/**
 * Build a string of text with a line for each question and answer, skipping questions where operands are 0 or 1
 * @param {array} questions 
 * @returns {string}
 */
export const buildHelpText = (questions) => {
    let helpText = '';
    const skipOperands = [0, 1];

    for (const question of questions) {
        if (skipOperands.includes(question.first) || skipOperands.includes(question.second)) {
            continue;
        }

        helpText += '\n' + getQuestionAndAnswerText(question);
    }

    return helpText;
}

export const isInArray = (arr, searchItem) => {
    return arr.some(item => JSON.stringify(item) === JSON.stringify(searchItem));
}

export const getPercentageString = (numerator, denominator) => {
    return Math.round(numerator / denominator * 100) + '%';
}

export const getFormattedMilliseconds = (timeInMilliseconds) => {
    const hours = Math.floor(timeInMilliseconds / (1000 * 60 * 60));
    timeInMilliseconds = timeInMilliseconds % (1000 * 60 * 60);
  
    const minutes = Math.floor(timeInMilliseconds / (1000 * 60));
    timeInMilliseconds = timeInMilliseconds % (1000 * 60);
  
    const seconds = Math.floor(timeInMilliseconds / 1000);
  
    // Format numbers as two-digit strings
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

// Return the question type with first char uppercase followed by a space and the subtype
export const getQuestionTypeLabel = (questionType, questionSubtype) => {
    return `${questionType.charAt(0).toUpperCase() + questionType.slice(1)} ${questionSubtype}`;
}

export const addPropertyIfNotExists = (obj, prop, addType = 'arr') => {
    if (!obj.hasOwnProperty(prop)) {
        switch (addType) {
            case 'arr':
                obj[prop] = [];
                break;
            case 'obj':
                obj[prop] = {};
                break;
        
            default:
                obj[prop] = false;
                break;
        }
    }

    return obj;
}

export const getResultsByQuestionType = (results) => {
    let resultsByQuestionType = {};
    results.answers.forEach((answer) => {
        answer.date = new Date(results.startTime).toLocaleDateString('en-GB');
        answer.dateTime = results.startTime;
        resultsByQuestionType = addPropertyIfNotExists(resultsByQuestionType, answer.type, 'obj');
        answer.numDigits = `${answer.firstNumDigits}x${answer.secondNumDigits}`;
        resultsByQuestionType[answer.type] = addPropertyIfNotExists(resultsByQuestionType[answer.type], answer.numDigits);
        resultsByQuestionType[answer.type][answer.numDigits].push(answer);
    });

    return resultsByQuestionType;
}