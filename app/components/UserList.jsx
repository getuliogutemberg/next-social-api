import React from 'react'
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase';
import { useRouter } from 'next/navigation';

const UserList = (props) => {

  const router = useRouter();
    const [usersRegistred, setUsersRegistered] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'users'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const users = [];
    
          querySnapshot.forEach((doc) => {
            users.push({...doc.data(), id: doc.id});
          })
    
          setUsersRegistered(users);
        })
      }, [])
    const compareUsers = (userA, userB) => {
        const loggedUserId = localStorage.getItem('user_id');
      
        // Verifica se o usuário logado é igual a userA ou userB
        const isUserALoggedIn = userA.id === loggedUserId;
        const isUserBLoggedIn = userB.id === loggedUserId;
      
        // Se userA for o usuário logado, ele deve ser o primeiro
        if (isUserALoggedIn) {
          return -1;
        }
        // Se userB for o usuário logado, ele deve ser o primeiro
        else if (isUserBLoggedIn) {
          return 1;
        }
      
        // Continua com a lógica original de priorização, ordem alfabética e nível de autorização
        if (userA.status === 'active' && userB.status !== 'active') {
          return -1;
        } else if (userA.status !== 'active' && userB.status === 'active') {
          return 1;
        }
      
        const nameComparison = userA.name.localeCompare(userB.name);
      
        if (nameComparison !== 0) {
          return nameComparison;
        }
      
        const authorizationComparison = userB.authorizationLevel - userA.authorizationLevel;
      
        return authorizationComparison;
      };
  return (
    <div className="row-span-6 col-start-11 col-span-2 bg-white rounded-lg shadow-md text-center h-full  overflow-auto min-w-[60px] ">
    <h2 className="text-2xl font-extrabold mb-4 max-[900px]:hidden ">Usuários</h2>
    {/* <p>aqui é a lista de usuarios</p> */}
    {usersRegistred.sort(compareUsers).map((user) => {
      if (user.level < props.level) {
        return null;
      }
      // console.log(user)
return (
  <>
      <div key={user.email} className={` flex  px-0 mb-4 mx-4 max-[900px]:mx-1 max-[900px]:mt-1   max-[900px]:mb-1 ${user.status === 'active' ? 'bg-white ' : 'bg-gray-300 opacity-40'} hover:bg-purple-300 rounded-lg overflow-hidden shadow-md ${user.status === 'active' && JSON.parse(localStorage.getItem('user_id')) !== user.id ? 'cursor-pointer hover:bg-green-400' : 'cursor-not-allowed hover:bg-gray-400'} ${JSON.parse(localStorage.getItem('user_id')) === user.id ? 'border-green-500 border-4 bg-green-300' : ''} ${user.status === 'active' && user.admin && JSON.parse(localStorage.getItem('user_id')) !== user.id ? 'border-purple-500 border-4 bg-purple-300' : ''} `} onClick={user.status === 'active'&& localStorage.getItem('user_id') !== user.id ? () => router.push(`/chat/${user.email}`) : null} >
       
        <div className="w-2/3  text-start max-[1400px]:collapse">
          <h2 className="text-xl font-bold mb-0 max-[1400px]:collapse">{user.name}</h2>
          <p className="text-gray-600 mb-0 text-sm max-[1400px]:collapse">{user.email}</p>
          <p className={`text-xs text-end pr-2 font-semibold max-[1400px]:collapse ${user.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
            {user.status === 'active' ? 'Logado' : 'Desconectado'}
          </p>
        </div>
       {user.admin === true && <div className=" text-black scale-100 absolute pl-5 pt-12 ">
       <svg stroke="currentColor" fill="currentColor" stroke-width="0" role="img" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><title></title><path d="M23.996 10.648l-6.153-5.644-.865.944 5.127 4.7H1.895l5.127-4.705L6.157 5 .004 10.648H0v3.72c0 1.682 1.62 3.052 3.61 3.052h3.794c1.99 0 3.61-1.37 3.61-3.051v-2.445h1.968v2.445c0 1.681 1.62 3.051 3.61 3.051h3.794c1.99 0 3.61-1.37 3.61-3.051v-3.72z"></path></svg>
         </div>}
       {user.level > 0  && <div className=" text-red-500 scale-100 absolute pl-1 pt-12 ">
       <svg stroke="currentColor" fill="currentColor" stroke-width="0" role="img" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><title></title><path d="M21.98 7.448L19.62 0H4.347L2.02 7.448c-1.352 4.312.03 9.206 3.815 12.015L12.007 24l6.157-4.552c3.755-2.81 5.182-7.688 3.815-12.015l-6.16 4.58 2.343 7.45-6.157-4.597-6.158 4.58 2.358-7.433-6.188-4.55 7.63-.045L12.008 0l2.356 7.404 7.615.044z"></path></svg>
       </div>}
        <img src={user.imageURL} alt={user.name} className={`w-[70px] h-[70px] mx-auto max-[1400px]:w-full max-[1400px]:object-cover ${user.status === 'active' ? 'opacity-100 ' : 'opacity-30 grayscale-100'} ${user.status === 'active' ? 'opacity-100 ' : 'opacity-30 grayscale-100'} ${user.status === 'active' ? 'opacity-100 ' : 'opacity-30 grayscale-100'} `} />
      </div>
         </>)

    })}

    </div>
  )
}

export default UserList