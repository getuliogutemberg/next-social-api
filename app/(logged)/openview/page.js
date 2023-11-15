"use client";
import Timeline from '../../components/Timeline';
import UserList from '../../components/UserList';
import ActionBar from '../../components/ActionBar';
import MainGrid from '@/app/components/MainGrid';
import { useState } from 'react';

export default function OpenView() {
  const [filter, setFilter] = useState({
    name: '',
    date: '',
  })
  const level = 0
  return (
    <MainGrid level={level}>

    <Timeline  level={level} filter={filter} setFilter={setFilter}/>

    <UserList level={level}/>
    
    <ActionBar level={level} setFilter={setFilter}/>
    
          
    </MainGrid>
  );
}
