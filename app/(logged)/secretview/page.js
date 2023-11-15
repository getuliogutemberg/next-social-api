"use client";

import ActionBar from '@/app/components/ActionBar';
import UserList from '@/app/components/UserList';
import Timeline from '@/app/components/Timeline';
import MainGrid from '@/app/components/MainGrid';

export default function SecretView() {

  const level = 1
 
  return (
    <MainGrid>
    
    <Timeline level={level}/>
    
    <UserList level={level}/>
    
    <ActionBar level={level}/>

    </MainGrid> 
  );
}
