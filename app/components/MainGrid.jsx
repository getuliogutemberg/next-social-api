"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


const MainGrid = (props) => {

    const router = useRouter();

  useEffect(() => {
    
    localStorage.getItem('user') === null && router.push('/');
    // localStorage.getItem('user') !== null && JSON.parse(localStorage.getItem('user')).status !== 'active' && router.back();
  },[])
  return (
    <div className="bg-slate-900 text-gray-800 grid grid-cols-12 grid-rows-6 gap-4 h-[100vh] p-4  ">
       {props.children}
    </div>
  )
}

export default MainGrid