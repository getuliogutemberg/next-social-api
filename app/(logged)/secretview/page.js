"use client";

import ActionBar from '@/app/components/ActionBar';
import UserList from '@/app/components/UserList';
import Timeline from '@/app/components/Timeline';
import MainGrid from '@/app/components/MainGrid';

export default function Verified() {

 
 
  return (
    <MainGrid>
    
    <Timeline level={1}/>
    
    <UserList level={1}/>
    
    <ActionBar level={1}/>

    </MainGrid> 
  );
}
