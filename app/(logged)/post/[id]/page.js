"use client";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { TbMessageShare } from 'react-icons/tb';
import { SyncLoader } from 'react-spinners';

import UserList from '@/app/components/UserList';
import PostEdit from '@/app/components/PostEdit';
import PostEditGrid from '@/app/components/PostEditGrid';

export default function Postview({ params }) {
 

  return (
    
    <PostEditGrid>

    <PostEdit id={params.id}/>
     
    </PostEditGrid>
  );
}
