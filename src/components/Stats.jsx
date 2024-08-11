import Header from "./Header";
import GlobalTab from "./Stats/GlobalTab";
import SessionHistoryTab from "./Stats/SessionHistoryTab";
import { useEffect, useState } from "react";
import { getStats } from "../firebase-service";
import { useAuth } from '../AuthContext';
import {
    getCorrectAnswerCount,
    getFormattedMilliseconds,
    getSessionLength,
    getAverageTimeToAnswer
} from '../utils/helpers';

const Stats = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = useAuth();

    useEffect(() => {
        if (!user.currentUser) {
            return;
        }
        const fetchStats = async () => {
          try {
            setLoading(true);
            const querySnapshot = await getStats(user.currentUser.uid);
            const statsData = querySnapshot.docs.map(doc => doc.data());
            populateStats(statsData);
          } catch (err) {
            setError('Failed to fetch stats');
          } finally {
            setLoading(false);
          }
        };
    
        fetchStats();
    }, [user]);

    const populateStats = (statsData) => {
        const totalCorrectAnswers = statsData.reduce((accum, session) => {
            return accum += getCorrectAnswerCount(session.answers);
        }, 0);
        const totalQuestionsAnswered = statsData.reduce((accum, session) => {
            return accum += session.answers.length;
        }, 0);
        const overallCorrectPercentage = totalQuestionsAnswered ? Math.round((totalCorrectAnswers / totalQuestionsAnswered) * 100) + '%': 'N/A';
    
        const totalTimePlayed = getFormattedMilliseconds(statsData.reduce((accum, session) => {
            return accum += getSessionLength(session.startTime, session.endTime);
        }, 0));
    
        const totalAverageTimeToAnswer = statsData.reduce((accum, session) => {
            return accum += getAverageTimeToAnswer(session.answers);
        }, 0);
        const averageTimeToAnswer = getFormattedMilliseconds(totalAverageTimeToAnswer * 1000);
        setStats({
            totalCorrectAnswers,
            totalQuestionsAnswered,
            overallCorrectPercentage,
            totalTimePlayed,
            totalAverageTimeToAnswer,
            averageTimeToAnswer,
        });
    }

    const tabs = [
        { label: 'Global', content: <GlobalTab stats={stats} /> },
        { label: 'Charts', content: <div>TODO</div> },
        { label: 'Session History', content: <SessionHistoryTab /> }
    ];
    
    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    return (
        <div>
            <Header />
            <div className="container">
                <h1 className="mb-4">Stats</h1>
                <ul className="nav nav-tabs mb-4">
                    {tabs.map((tab, index) => (
                        <li key={index} className="nav-item">
                            <button className={index === activeTab ? 'nav-link active' : 'nav-link'} onClick={() => handleTabClick(index)}>{tab.label}</button>
                        </li>
                    ))}
                </ul>
                {tabs[activeTab].content}
            </div>
        </div>
    );
}

export default Stats;