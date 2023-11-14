"use client";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { TbMessageShare } from 'react-icons/tb';
import { SyncLoader } from 'react-spinners';

import UserList from '@/app/components/UserList';
import PostDetail from '@/app/components/PostDetail';
import PostDetailGrid from '@/app/components/PostDetailGrid';

export default function Postview({ params }) {
  const [level, setLevel] = useState(0);

  return (
    
    <PostDetailGrid>
    
    <PostDetail params={params} setLevel={setLevel}/>
    
    <UserList level={level} />
  
    </PostDetailGrid>
  );
}
