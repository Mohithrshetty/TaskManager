import React, { useContext } from 'react'
import { useUserAuth } from '../../Hooks/useUserAuth'
import { UserContext } from '../../Contexts/UserContext';
import DashboardLayout from '../../components/Layouts/DashboardLayout';

const Dashboard = () => {
  useUserAuth();

  const{ user }=useContext(UserContext);
  return <DashboardLayout>Dashboard</DashboardLayout>;
  
};

export default Dashboard;
