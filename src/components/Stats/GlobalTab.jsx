const GlobalTab = ({stats}) => {
    return (
        <div className="tab-content">
            <div className="tab-pane fade show active mb-5" id="global">
                <h2 className="mb-4">Global</h2>
                <h3>Overall correct answer percentage</h3>
                <p className="display-4">{stats.overallCorrectPercentage}</p>
                <h3>Total time played</h3>
                <p className="display-4">{stats.totalTimePlayed}</p>
                <h3>Average time to answer</h3>
                <p className="display-4">{stats.averageTimeToAnswer}</p>
            </div>
        </div>
)};

export default GlobalTab;