import { getResultsByQuestionType, addPropertyIfNotExists, getQuestionTypeLabel, getCorrectAnswerCount, getAverageTimeToAnswer } from '../../../utils/helpers';
import { Line } from 'react-chartjs-2';

const AverageTimeToAnswerTab = ({stats, loading}) => {
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

    const getAverageTimeToAnswerDatasetData = (questionType, questionSubtype, sessionResultsByQuestionType) => {
        const datasetData = [];
        sessionResultsByQuestionType.forEach((session) => {
            if (!session.hasOwnProperty(questionType) || !session[questionType].hasOwnProperty(questionSubtype)) {
                return;
            }
            datasetData.push({
                x: session[questionType][questionSubtype][0].dateTime,
                y: getAverageTimeToAnswer(session[questionType][questionSubtype]),
            });
        });

        return datasetData;
    }

    const getOverallAvgTimeToAnswerData = () => {
        const datasetData = [];
        stats.forEach((session) => {
            datasetData.push({
                x: session['answers'][0].dateTime,
                y: getAverageTimeToAnswer(session['answers']),
            });
        });

        return datasetData;
    }

    const sessionResultsByQuestionType = [];
    stats.forEach((session) => {
        populateResultsByQuestionType(session);
        sessionResultsByQuestionType.push(getResultsByQuestionType(session));
    });

    let averageTimeToAnswerDatasets = [];
    averageTimeToAnswerDatasets.push({
        label: 'Overall',
        data: getOverallAvgTimeToAnswerData(),
        fill: false,
        tension: 0
    })

    // Build data for each of the question types
    Object.keys(resultsByQuestionType).forEach((questionType) => {
        Object.keys(resultsByQuestionType[questionType]).forEach((questionSubtype) => {
            averageTimeToAnswerDatasets.push({
                label: getQuestionTypeLabel(questionType, questionSubtype),
                data: getAverageTimeToAnswerDatasetData(questionType, questionSubtype, sessionResultsByQuestionType),
                fill: false,
                tension: 0,
                hidden: true,
            });
        });
    });

    const data = {
        labels: stats.map(session => session.startTime),
        datasets: averageTimeToAnswerDatasets,
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Time to answer',
            },
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    tooltipFormat: 'yyyy-MM-dd HH:mm',
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
                    text: 'Time to answer (seconds)'
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

export default AverageTimeToAnswerTab;