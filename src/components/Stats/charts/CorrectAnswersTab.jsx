import { getResultsByQuestionType, addPropertyIfNotExists, getQuestionTypeLabel, getCorrectAnswerCount } from '../../../utils/helpers';
import { Line } from 'react-chartjs-2';

const CorrectAnswersTab = ({stats, loading}) => {
    let resultsByQuestionType = {};
    
    const populateResultsByQuestionType = (results) => {
        results.answers.forEach((answer) => {
            answer.date = new Date(results.startTime).toLocaleDateString('en-GB');
            resultsByQuestionType = addPropertyIfNotExists(resultsByQuestionType, answer.type, 'obj');
            answer.numDigits = `${answer.firstNumDigits}x${answer.secondNumDigits}`;
            resultsByQuestionType[answer.type] = addPropertyIfNotExists(resultsByQuestionType[answer.type], answer.numDigits);
            resultsByQuestionType[answer.type][answer.numDigits].push(answer);
        });
    }

    const getCorrectAnswersDatasetData = (questionType, questionSubtype, sessionResultsByQuestionType) => {
        const datasetData = [];
        sessionResultsByQuestionType.forEach((session) => {
            if (!session.hasOwnProperty(questionType) || !session[questionType].hasOwnProperty(questionSubtype)) {
                return;
            }
            datasetData.push({
                x: session[questionType][questionSubtype][0].dateTime,
                y: (getCorrectAnswerCount(session[questionType][questionSubtype]) / session[questionType][questionSubtype].length) * 100,
            });
        });

        return datasetData;
    }

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
      
        return `${year}-${month}-${day}`;
      }

    const getOverallCorrectAnswersData = () => {
        const datasetData = [];
        stats.forEach((session) => {
            datasetData.push({
                x: session['answers'][0].dateTime,
                y: (getCorrectAnswerCount(session['answers']) / session['answers'].length) * 100,
            });
        });

        return datasetData;
    }

    const sessionResultsByQuestionType = [];
    stats.forEach((session) => {
        populateResultsByQuestionType(session);
        sessionResultsByQuestionType.push(getResultsByQuestionType(session));
    });

    let correctAnswersDatasets = [];
    correctAnswersDatasets.push({
        label: 'Overall',
        data: getOverallCorrectAnswersData(),
        fill: false,
        tension: 0
    })

    // Build data for each of the question types
    Object.keys(resultsByQuestionType).forEach((questionType) => {
        Object.keys(resultsByQuestionType[questionType]).forEach((questionSubtype) => {
            correctAnswersDatasets.push({
                label: getQuestionTypeLabel(questionType, questionSubtype),
                data: getCorrectAnswersDatasetData(questionType, questionSubtype, sessionResultsByQuestionType),
                fill: false,
                tension: 0,
                hidden: true,
            });
        });
    });

    const data = {
        labels: stats.map(session => session.startTime),
        datasets: correctAnswersDatasets,
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Correct answer percentage',
            },
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    tooltipFormat: 'dd MMM, Y, h:mm a',
                    displayFormats: {
                        day: 'MMM d',
                    },
                },
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Correct answer %'
                },
                ticks: {
                    callback: function(value, index, ticks) {
                        return value + '%';
                    }
                }
            }
        },
    };

    return (
        <div className={loading ? 'tab-content tab-content--loading' : 'tab-content'}>
            <Line data={data} options={options} />
        </div>
    );
}

export default CorrectAnswersTab;