import Header from "./Header";
import GlobalTab from "./Stats/GlobalTab";
import SessionHistoryTab from "./Stats/SessionHistoryTab";
import { useState } from "react";

const Stats = () => {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        { label: 'Global', content: <GlobalTab /> },
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
                        <li key={index} className="nav-item" isActive={index === activeTab}>
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