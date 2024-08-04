const GlobalTab = () => (
    <div class="tab-content">
        <div class="tab-pane fade show active mb-5" id="global">
            <h2 class="mb-4">Global</h2>
            <h3>Overall correct answer percentage</h3>
            <p class="display-4 js-overall-correct-percentage js-loading-ellipsis">...</p>
            <h3>Total time played</h3>
            <p class="display-4 js-total-time-played js-loading-ellipsis">...</p>
            <h3>Average time to answer</h3>
            <p class="display-4 js-average-time-to-answer js-loading-ellipsis">...</p>
        </div>
    </div>
);

export default GlobalTab;