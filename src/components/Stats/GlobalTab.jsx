import {
    getCorrectAnswerCount,
    getFormattedMilliseconds,
    getSessionLength,
    getAverageTimeToAnswer
} from '../../utils/helpers';

const GlobalTab = ({stats, loading}) => {
    const totalCorrectAnswers = stats.reduce((accum, session) => {
        return accum += getCorrectAnswerCount(session.answers);
    }, 0);
    const totalQuestionsAnswered = stats.reduce((accum, session) => {
        return accum += session.answers.length;
    }, 0);
    const overallCorrectPercentage = totalQuestionsAnswered ? Math.round((totalCorrectAnswers / totalQuestionsAnswered) * 100) + '%': 'N/A';

    const totalTimePlayed = getFormattedMilliseconds(stats.reduce((accum, session) => {
        return accum += getSessionLength(session.startTime, session.endTime);
    }, 0));

    const totalAverageTimeToAnswer = stats.reduce((accum, session) => {
        return accum += getAverageTimeToAnswer(session.answers);
    }, 0);
    const averageTimeToAnswer = getFormattedMilliseconds(totalAverageTimeToAnswer * 1000);

    return (
        <div className={loading ? 'tab-content tab-content--loading' : 'tab-content'}>
            <div className="tab-pane fade show active mb-5" id="global">
                <h2 className="mb-4">Global</h2>
                <h3>Overall correct answer percentage</h3>
                <p className="display-4">{loading ? '...' : overallCorrectPercentage}</p>
                <h3>Total time played</h3>
                <p className="display-4">{loading ? '...' : totalTimePlayed}</p>
                <h3>Average time to answer</h3>
                <p className="display-4">{loading ? '...' : averageTimeToAnswer}</p>
            </div>
        </div>
)};

export default GlobalTab;