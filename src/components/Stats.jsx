import Header from "./Header";
import GlobalTab from "./Stats/GlobalTab";
import SessionHistoryTab from "./Stats/SessionHistoryTab";
import { useEffect, useState } from "react";
import { getStats } from "../firebase-service";
import { useAuth } from '../AuthContext';

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
            setStats(statsData);
          } catch (err) {
            setError('Failed to fetch stats');
          } finally {
            setLoading(false);
          }
        };
    
        fetchStats();
    }, [user]);

    const tabs = [
        { label: 'Global', content: <GlobalTab stats={stats} loading={loading} /> },
        { label: 'Charts', content: <div>TODO</div> },
        { label: 'Session History', content: <SessionHistoryTab stats={stats} loading={loading} /> }
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