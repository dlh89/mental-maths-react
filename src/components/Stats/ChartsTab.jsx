import { useState } from 'react';
import {
    Chart as ChartJS,
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import autocolors from 'chartjs-plugin-autocolors';
import CorrectAnswersTab from './charts/CorrectAnswersTab';
import AverageTimeToAnswerTab from './charts/AverageTimeToAnswerTab';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, autocolors);

const ChartsTab = ({ stats, loading }) => {
    const [activeTab, setActiveTab] = useState(0);
    const tabs = [
        { label: 'Correct answer percentage', content: <CorrectAnswersTab stats={stats} loading={loading} /> },
        { label: 'Average time to answer', content: <AverageTimeToAnswerTab stats={stats} loading={loading} /> },
    ];
    
    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    return (
        <div className={loading ? 'tab-content tab-content--loading' : 'tab-content'}>
            <h2 className="mb-4">Charts</h2>
            <ul className="nav nav-pills mb-4">
                {tabs.map((tab, index) => (
                    <li key={index} className="nav-item">
                        <button className={index === activeTab ? 'nav-link active' : 'nav-link'} onClick={() => handleTabClick(index)}>{tab.label}</button>
                    </li>
                ))}
            </ul>
            {tabs[activeTab].content}
        </div>
    )
};

export default ChartsTab;