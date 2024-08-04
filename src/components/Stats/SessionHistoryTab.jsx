const SessionHistoryTab = () => (
    <div className="tab-content">
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
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

export default SessionHistoryTab;