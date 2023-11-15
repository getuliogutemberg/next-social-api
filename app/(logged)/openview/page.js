"use client";
import Timeline from '../../components/Timeline';
import UserList from '../../components/UserList';
import ActionBar from '../../components/ActionBar';
import MainGrid from '@/app/components/MainGrid';

export default function OpenView() {
  const level = 0
  return (
    <MainGrid>

    <Timeline  level={level}/>

    <UserList level={level}/>
    
    <ActionBar level={level}/>
    
          
    </MainGrid>
  );
}
