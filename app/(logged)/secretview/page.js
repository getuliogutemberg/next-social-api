"use client";

import ActionBar from '@/app/components/ActionBar';
import UserList from '@/app/components/UserList';
import Timeline from '@/app/components/Timeline';
import MainLayout from '@/app/components/MainLayout';

export default function Verified() {

 
 
  return (
    <MainLayout>
    
    <Timeline level={1}/>
    
    <UserList level={1}/>
    
    <ActionBar level={1}/>

    </MainLayout> 
  );
}
