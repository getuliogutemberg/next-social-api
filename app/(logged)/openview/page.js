"use client";
import Timeline from '../../components/Timeline';
import UserList from '../../components/UserList';
import ActionBar from '../../components/ActionBar';
import MainGrid from '@/app/components/MainGrid';

export default function Verified() {

  return (
    <MainGrid>

    <Timeline  level={0}/>

    <UserList level={0}/>
    
    <ActionBar level={0}/>
    
          
    </MainGrid>
  );
}
