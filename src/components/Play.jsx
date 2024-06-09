import Header from './Header';
import { useEffect, useState, useRef, Fragment } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ReactComponent as Tick } from '../images/tick.svg';
import { ReactComponent as Cross } from '../images/cross.svg';
import { ReactComponent as StopwatchWhite } from '../images/stopwatch-white.svg';
import { ReactComponent as StopwatchBlack } from '../images/stopwatch.svg';
import {
    getRandomElement,
    getDigitsArr,
    getSymbol,
    getAnswer
} from '../utils/helpers';
import multiplication from '../utils/multiplication';

const Play = () => {
    const [searchParams] = useSearchParams();
    const [questionTypes, setQuestionTypes] = useState(searchParams.getAll('question_types'));
    const [multiplicationDigits, setMultiplicationDigits] = useState(searchParams.getAll('multiplication_digits'));
    const [additionDigits, setAdditionDigits] = useState(searchParams.getAll('addition_digits'));
    const [subtractionDigits, setSubtractionDigits] = useState(searchParams.getAll('subtraction_digits'));
    const [includeSubtractionNegatives, setIncludeSubtractionNegatives] = useState(searchParams.getAll('include_negatives'));
    const [repeatIncorrectQuestions, setRepeatIncorrectQuestions] = useState(searchParams.getAll('repeat_incorrect_questions'));

    const [score, setScore] = useState({
        answers: [],
        startTime: null,
        endTime: null,
        correct: 0,
        incorrect: 0,
    });

    const [averageTimeToAnswer, setAverageTimeToAnswer] = useState(0);
    const [timer, setTimer] = useState(0);
    const timerRef = useRef(null);
    const [question, setQuestion] = useState(false);
    const [queue, setQueue] = useState([]);
    const [questionsSinceRepeat, setQuestionsSinceRepeat] = useState(0);
    const [questionIsAnswered, setQuestionIsAnswered] = useState(false);
    const [answer, setAnswer] = useState(false);
    const [readyForNextQuestion, setReadyForNextQuestion] = useState(false);
    const [answerHelp, setAnswerHelp] = useState('');

    const startTimer = () => {
        setTimer(0);
        if (timerRef.current !== null) return; // Prevent multiple timers
        timerRef.current = setInterval(() => {
          setTimer(prevTime => prevTime + 1);
        }, 1000);
      };
    
    const stopTimer = () => {
        clearInterval(timerRef.current);
        timerRef.current = null;
    };

    const nextQuestion = () => {
        if (queue.length) {
            if (questionsSinceRepeat >= 1) {
                setQuestion(queue[0]);
                setQueue((prevItems) => prevItems.slice(1));
            } else {
                getNewQuestion();
                setQuestionsSinceRepeat(questionsSinceRepeat + 1);
            }
        } else {
            getNewQuestion();
        }

        setAnswerHelp('');
        setQuestionIsAnswered(false);
        startTimer();
    }

    const getNewQuestion = () => {
        const type = getRandomElement(questionTypes);
        const arithmeticTypeDigits = getArithmeticTypeDigits(type);
        const numDigits = getRandomElement(arithmeticTypeDigits);
        const digitsArr = getDigitsArr(numDigits);
        const question = generateQuestion(type, ...digitsArr);
        if (type === 'subtraction' && !includeSubtractionNegatives) {
            if (question.second > question.first) {
                // Re-order the question so the largest number is on the left hand side
                const tempSecond = question.second;
                question.second = question.first;
                question.first = tempSecond;
            }
        }
        setQuestion(question);
    }

    const getArithmeticTypeDigits = (type) => {
        let arithmeticTypeDigits = false;

        switch (type) {
            case 'multiplication':
                arithmeticTypeDigits = multiplicationDigits;
                break;
            case 'addition':
                arithmeticTypeDigits = additionDigits;
                break;
            case 'subtraction':
                arithmeticTypeDigits = subtractionDigits;
                break;
            default:
                break;
        }

        return arithmeticTypeDigits;
    }

    const generateQuestion = (type, firstNumDigits, secondNumDigits) => {
        const firstNumExcludeNums = getExcludeNums(type, firstNumDigits);
        const secondNumExcludeNums = getExcludeNums(type, secondNumDigits);
        const first = getNumber(firstNumDigits, firstNumExcludeNums);
        const second = getNumber(secondNumDigits, secondNumExcludeNums);
    
        const question = {
            'first': first,
            'second': second,
            'type': type,
            'firstNumDigits': firstNumDigits,
            'secondNumDigits': secondNumDigits,
        }
    
        return question;
    }

    /**
     * Return an array of numbers that can't be included for the number of digits
     * @param {string} type 
     * @param {string|integer} numDigits 
     * @returns {array}
     */
    const getExcludeNums = (type, numDigits) => {
        const excludeNums = [];
        if (parseInt(numDigits) === 1) {
            // Avoid questions such as 0 + 0
            excludeNums.push(0);
    
            if (type === 'multiplication') {
                // Avoid questions such as 1 x 1
                excludeNums.push(1);
            }
        }
    
        return excludeNums;
    }
    
    /**
     * Return a random number with the number of digits given
     * 0 will not be used for the first digit and any number in excludeNums will not be used
     * @param {integer} numDigits 
     * @param {array} excludeNums 
     * @returns {integer}
     */
    const getNumber = (numDigits, excludeNums = []) => {
        let number = '';
    
        for (let i = 0; i < numDigits; i++) {
            let randomDigit = getRandomDigit();
            while ((i === 0 && numDigits > 1 && randomDigit === 0) || excludeNums.includes(randomDigit)) {
                randomDigit = getRandomDigit();
            }
            number += randomDigit;
        }
    
        return parseInt(number);
    }

    /**
     * Return a random number between 0 and 9
     * @returns {integer}
     */
    const getRandomDigit = () => {
        return Math.round(Math.random() * 9);
    }

    const handleAnswer = () => {
        setQuestionIsAnswered(true);
        stopTimer();
        setAnswer(getAnswer(question));
        // TODO answerHelpText
        setAnswerHelp(multiplication.getAnswerHelp(question));
    }

    const handleMark = (isCorrect) => {
        const answeredQuestion = {
            ...question,
            timeToAnswer: timer,
            isCorrect,
        }

        setScore(prevItems => ({
            ...prevItems,
            answers: [...prevItems.answers, answeredQuestion],
            correct: isCorrect ? prevItems.correct + 1 : prevItems.correct,
            incorrect: !isCorrect ? prevItems.incorrect + 1 : prevItems.incorrect
        }));

        if (!isCorrect && repeatIncorrectQuestions) {
            setQueue((prevItems) => [...prevItems, question]);
        }
        setReadyForNextQuestion(true);
    }

    useEffect(() => {
        if (!queue.length) {
            setQuestionsSinceRepeat(0);
        }
    }, [queue]);

    useEffect(() => {
        if (readyForNextQuestion) {
            setReadyForNextQuestion(false);
            nextQuestion();
        }
    }, [readyForNextQuestion])

    useEffect(() => {
        // Start game
        setScore(prev => ({...prev, startTime: new Date().getTime()}))
        nextQuestion();
    }, []);

    return (
        <div>
            <Header />
            <div className="container">
                <h1 className="display-2">Mental Maths</h1>
                <div>
                    <div className="scoreboard">
                        <div className="scoreboard__score badge" title="Correctly answered questions"><Tick className="badge-icon" />{score.correct}</div>
                        <div className="scoreboard__score badge scoreboard__score--incorrect" title="Incorrectly answered questions"><Cross className="badge-icon" />{score.incorrect}</div>
                        <div className="scoreboard__score badge scoreboard__score--average-time" title="Average time to answer">
                            <StopwatchWhite className="badge-icon" /> {averageTimeToAnswer}
                        </div>
                    </div>
                    <div className="timer">
                        <StopwatchBlack />
                        <div>{timer}</div>
                    </div>
                    <div className="question">
                        {question && (
                            <Fragment>
                                {question.first} {getSymbol(question.type)} {question.second} = { questionIsAnswered && (<span className="question__answer">{answer}</span>) }
                            </Fragment>
                        )}
                    </div>
                    {answerHelp && (
                        <div class="answer-help mb-4">
                            {answerHelp}
                        </div>
                    )}
                    {!questionIsAnswered && (
                        <button className="btn btn-primary btn-lg" onClick={handleAnswer}>Answer</button>
                    )}
                    {questionIsAnswered && (
                        <div>
                            <p>Did you get the correct answer?</p>
                            <button className="btn btn-lg btn-success" onClick={(() => handleMark(true))}><Tick className="badge-icon"/> Yes</button>
                            <button className="btn btn-lg btn-danger" onClick={(() => handleMark(false))}><Cross className="badge-icon"/> No</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Play;