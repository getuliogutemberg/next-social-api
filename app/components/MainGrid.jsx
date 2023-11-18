"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';


const MainGrid = (props) => {

  const router = useRouter();
  const [user, setUser] = useState({
  
  });
  const getUser = async () =>{
    const user = await getDoc(doc(db, "users", localStorage.getItem('user_id')));
    // console.log(user.data());
    
    setUser(user.data());
  }

  const virifyUserLevel = (user) => {
  if (user !== undefined && user.level < props.level) {
    router.push('/openview')
    return false
  } else {
    return true
  }
  }

  useEffect(() => {
    getUser()
  },[])

  useEffect(() => {
    virifyUserLevel(user)
    
  },[user])

  return (
    <div className="bg-slate-900 text-gray-800 grid grid-cols-12 grid-rows-6 gap-4 h-[100vh] p-4  ">
       {virifyUserLevel(user) && props.children}
    </div>
  )
}

export default MainGrid