import { 
    getSessionStartDate,
    getCorrectAnswerCount,
    getFormattedMilliseconds,
    getSessionLength,
    getAverageTimeToAnswer
 } from '../../utils/helpers';

const SessionHistoryTab = ({stats, loading}) => (
    <div className={loading ? 'tab-content tab-content--loading' : 'tab-content'}>
        <h2 className="mb-4">Session history</h2>
        <div className="table-responsive js-stats-container">
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Start time</th>
                        <th scope="col">End time</th>
                        <th scope="col">Score</th>
                        <th scope="col">Correct percentage</th>
                        <th scope="col">Average time to answer</th>
                        <th scope="col">Session length</th>
                    </tr>
                </thead>
                <tbody>
                    {stats.map((session) => {
                        const correctAnswerCount = getCorrectAnswerCount(session.answers);
                        
                        return (
                        <tr>
                            <td>{getSessionStartDate(session)}</td>
                            <td>{new Date(session.startTime).toLocaleTimeString()}</td>
                            <td>{new Date(session.endTime).toLocaleTimeString()}</td>
                            <td>{correctAnswerCount} / {session.answers.length}</td>
                            <td>{Math.round(correctAnswerCount / session.answers.length * 100)}%</td>
                            <td>{getFormattedMilliseconds(getSessionLength(session.startTime, session.endTime))}</td>
                            <td>{getFormattedMilliseconds(getAverageTimeToAnswer(session.answers) * 1000)}</td>
                        </tr>
                    )})}
                </tbody>
            </table>
        </div>
    </div>
);

export default SessionHistoryTab;