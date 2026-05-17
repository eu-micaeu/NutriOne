import React from 'react';
import { Calculator } from './Calculator';
import { DailyLog } from './DailyLog';
import type { User } from '../types';
import './Dashboard.css';

interface DashboardProps {
  user: User | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        <div className="dashboard-main">
          <DailyLog />
        </div>
        <div className="dashboard-side">
          <Calculator user={user} />
        </div>
      </div>
    </div>
  );
};
