const GlobalTab = ({stats, loading}) => {
    return (
        <div className={loading ? 'tab-content tab-content--loading' : 'tab-content'}>
            <div className="tab-pane fade show active mb-5" id="global">
                <h2 className="mb-4">Global</h2>
                <h3>Overall correct answer percentage</h3>
                <p className="display-4">{loading ? '...' : stats.overallCorrectPercentage}</p>
                <h3>Total time played</h3>
                <p className="display-4">{loading ? '...' : stats.totalTimePlayed}</p>
                <h3>Average time to answer</h3>
                <p className="display-4">{loading ? '...' : stats.averageTimeToAnswer}</p>
            </div>
        </div>
)};

export default GlobalTab;