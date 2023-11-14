"use client";
import Timeline from '../../components/Timeline';
import UserList from '../../components/UserList';
import ActionBar from '../../components/ActionBar';
import MainLayout from '@/app/components/MainLayout';

export default function Verified() {

  return (
    <MainLayout>

    <Timeline  level={0}/>

    <UserList level={0}/>
    
    <ActionBar level={0}/>
    
          
    </MainLayout>
  );
}
