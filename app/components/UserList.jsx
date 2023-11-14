import React from 'react'
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase';

const UserList = (props) => {
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
        const loggedUserId = JSON.parse(localStorage.getItem('user')).id;
      
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
      console.log(user)
return (
      <div key={user.email} className={`flex  px-0 mb-4 mx-4 max-[900px]:mx-1 max-[900px]:mt-1   max-[900px]:mb-1 ${user.status === 'active' ? 'bg-white ' : 'bg-gray-300 opacity-40'} hover:bg-purple-300 rounded-lg overflow-hidden shadow-md ${user.status === 'active' && JSON.parse(localStorage.getItem('user')).id !== user.id ? 'cursor-pointer' : 'cursor-not-allowed'} ${JSON.parse(localStorage.getItem('user')).id === user.id ? 'border-purple-500 border-2' : ''}`} onClick={user.status === 'active'&& JSON.parse(localStorage.getItem('user')).id !== user.id ? () => router.push(`/pvp/${user.email}`) : null} >
        <div className="w-2/3  text-end max-[1400px]:collapse">
          <h2 className="text-xl font-bold mb-0 max-[1400px]:collapse">{user.name}</h2>
          <p className="text-gray-600 mb-0 text-sm max-[1400px]:collapse">{user.email}</p>
          <p className={`text-xs font-semibold max-[1400px]:collapse ${user.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
            {user.status === 'active' ? 'Logado' : 'Desconectado'}
          </p>
        </div>
        <img src={user.imageURL} alt={user.name} className={`w-[70px] h-[70px] mx-auto max-[1400px]:w-full max-[1400px]:object-cover ${user.status === 'active' ? 'opacity-100 ' : 'opacity-30 grayscale-100'} ${user.status === 'active' ? 'opacity-100 ' : 'opacity-30 grayscale-100'} ${user.status === 'active' ? 'opacity-100 ' : 'opacity-30 grayscale-100'} `} />
      </div>)

    })}

    </div>
  )
}

export default UserList