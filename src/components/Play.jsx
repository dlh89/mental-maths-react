import Header from './Header';
import { useEffect, useState, useRef, Fragment } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ReactComponent as Tick } from '../images/tick.svg';
import { ReactComponent as Cross } from '../images/cross.svg';
import { ReactComponent as StopwatchWhite } from '../images/stopwatch-white.svg';
import { ReactComponent as StopwatchBlack } from '../images/stopwatch.svg';

const Play = () => {
    const [searchParams] = useSearchParams();
    useEffect(() => {
        // TODO process get params
    }, []);

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

    const startTimer = () => {
        if (timerRef.current !== null) return; // Prevent multiple timers
        timerRef.current = setInterval(() => {
          setTimer(prevTime => prevTime + 1);
        }, 1000);
      };
    
    const stopTimer = () => {
        clearInterval(timerRef.current);
        timerRef.current = null;
    };

    const handleAnswer = () => {
        stopTimer();
        // TODO update score, show mark buttons
    }

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
                                {question} = { question.answer && (<span className="question__answer">{question.answer}</span>) }
                            </Fragment>
                        )}
                    </div>
                    <button className="btn btn-primary btn-lg" onClick={handleAnswer}>Answer</button>
                </div>
            </div>
        </div>
    );
};

export default Play;