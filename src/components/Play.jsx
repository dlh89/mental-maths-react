import Header from './Header';
import { useEffect, useState, useRef, Fragment } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ReactComponent as Tick } from '../images/tick.svg';
import { ReactComponent as Cross } from '../images/cross.svg';
import { ReactComponent as StopwatchWhite } from '../images/stopwatch-white.svg';
import { ReactComponent as StopwatchBlack } from '../images/stopwatch.svg';
import { useAuth } from '../AuthContext';
import {
    getRandomElement,
    getDigitsArr,
    getSymbol,
    getAnswer,
    getPercentageString,
    getFormattedMilliseconds,
    getResultsByQuestionType
} from '../utils/helpers';
import multiplication from '../utils/multiplication';
import { pushResultsToDb } from '../firebase-service';

const Play = () => {
    const [searchParams] = useSearchParams();
    const [questionTypes, setQuestionTypes] = useState(searchParams.getAll('question_types'));
    const [multiplicationDigits, setMultiplicationDigits] = useState(searchParams.getAll('multiplication_digits'));
    const [additionDigits, setAdditionDigits] = useState(searchParams.getAll('addition_digits'));
    const [subtractionDigits, setSubtractionDigits] = useState(searchParams.getAll('subtraction_digits'));
    const [includeSubtractionNegatives, setIncludeSubtractionNegatives] = useState(searchParams.get('subtraction_include_negatives'));
    const [repeatIncorrectQuestions, setRepeatIncorrectQuestions] = useState(searchParams.get('repeat_incorrect_questions'));

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
    const [resultsByQuestionType, setResultsByQuestionType] = useState([]);
    const isSessionEnded = useRef(false);

    const user = useAuth();

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
        if (question.type === 'multiplication') {
            setAnswerHelp(multiplication.getAnswerHelp(question));
        }
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

    const getTotalCorrectAnswers = (answers) => {
        return answers.reduce((accumulator, answer) => {
            if (answer.isCorrect) {
                accumulator++;
            }
            return accumulator;
        }, 0);
    };

    const getAverageTimeToAnswer = (answers) => {
        const totalTimeToAnswer = answers.reduce((accumulator, answer) => {
            return accumulator += answer.timeToAnswer;
        }, 0);

        return Math.round(totalTimeToAnswer / answers.length);
    }

    const handleEndSession = () => {
        const shouldEndSession = window.confirm('Are you sure you want to end the session?');
        if (!shouldEndSession) {
            return;
        }
        isSessionEnded.current = true;
        setScore(prevItems => ({
            ...prevItems,
            endTime: new Date().getTime()
        }));

        setResultsByQuestionType(getResultsByQuestionType(score));
    }

    const renderQuestionTypeDigits = (questionType) => {
        switch (questionType) {
            case 'multiplication':
                return (
                    <Fragment>
                        {Object.keys(resultsByQuestionType['multiplication']).map(multiplicationDigit => (
                            <div key={multiplicationDigit}>
                                <h5>{multiplicationDigit}</h5>
                                <p><strong>Score:</strong> {getTotalCorrectAnswers(resultsByQuestionType['multiplication'][multiplicationDigit])} / {resultsByQuestionType['multiplication'][multiplicationDigit].length}</p>
                                <p><strong>Average time to answer:</strong> {getAverageTimeToAnswer(resultsByQuestionType['multiplication'][multiplicationDigit])} seconds</p>
                            </div>
                        ))}
                    </Fragment>
                );
            case 'addition':
                return (
                    <Fragment>
                        {Object.keys(resultsByQuestionType['addition']).map(additionDigit => (
                            <div key={additionDigit}>
                                <h5>{additionDigit}</h5>
                                <p><strong>Score:</strong> {getTotalCorrectAnswers(resultsByQuestionType['addition'][additionDigit])} / {resultsByQuestionType['addition'][additionDigit].length}</p>
                                <p><strong>Average time to answer:</strong> {getAverageTimeToAnswer(resultsByQuestionType['addition'][additionDigit])} seconds</p>
                            </div>
                        ))}
                    </Fragment>
                );
            case 'subtraction':
                return (
                    <Fragment>
                        {Object.keys(resultsByQuestionType['subtraction']).map(subtractionDigit => (
                            <div key={subtractionDigit}>
                                <h5>{subtractionDigit}</h5>
                                <p><strong>Score:</strong> {getTotalCorrectAnswers(resultsByQuestionType['subtraction'][subtractionDigit])} / {resultsByQuestionType['subtraction'][subtractionDigit].length}</p>
                                <p><strong>Average time to answer:</strong> {getAverageTimeToAnswer(resultsByQuestionType['subtraction'][subtractionDigit])} seconds</p>
                            </div>
                        ))}
                    </Fragment>
                );
            default:
                return null;
        }
    }

    const capitaliseFirstChar = str => str.charAt(0).toUpperCase() + str.slice(1);

    useEffect(() => {
        if (!queue.length) {
            setQuestionsSinceRepeat(0);
        }
    }, [queue]);

    useEffect(() => {
        if (readyForNextQuestion) {
            setReadyForNextQuestion(false);
            setAverageTimeToAnswer(getAverageTimeToAnswer(score.answers));
            nextQuestion();
        }
    }, [readyForNextQuestion])

    useEffect(() => {
        if (isSessionEnded.current && user?.currentUser?.uid) {
            pushResultsToDb(user.currentUser.uid, score);
        }
    }, [score, user]);

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
                {!isSessionEnded.current ? (
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
                            <div className="answer-help mb-4">
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
                        {score.answers.length > 0 && (
                            <div className="mt-3">
                                <button className="btn btn-secondary" onClick={handleEndSession}>End session</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <h2 className="heading-2">Results</h2>
                        <h3>Overall</h3>
                        <p>{getTotalCorrectAnswers(score.answers)} / {score.answers.length} ({getPercentageString(getTotalCorrectAnswers(score.answers), score.answers.length)})</p>                 
                        <h3>Average time to answer</h3>
                        <p>{averageTimeToAnswer} {averageTimeToAnswer === 1 ? 'second' : 'seconds'}</p>
                        <h3>Session length</h3>
                        <p>{getFormattedMilliseconds(Math.abs(score.endTime - score.startTime))}</p>
                        <h3>Question types</h3>
                        {questionTypes.map(questionType => (
                            <Fragment key={questionType}>
                                <h4>{capitaliseFirstChar(questionType)}</h4>
                                {renderQuestionTypeDigits(questionType)}
                            </Fragment>
                        ))}
                    </div>   
                )}
            </div>
        </div>
    );
};

export default Play;