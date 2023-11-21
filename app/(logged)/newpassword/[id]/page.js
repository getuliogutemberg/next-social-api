"use client"
import { getDoc,updateDoc,doc } from 'firebase/firestore';
import { useState } from 'react';
import { db } from '../../../firebase';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { BsKey } from 'react-icons/bs';

export default function ChangePassword({params}) {
  const router = useRouter()
  // const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState({

  });
  const [userEdit, setUserEdit] = useState({

  });

  const getUser = async () =>{
    
    const user = await getDoc(doc(db, "users", JSON.parse(localStorage.getItem('user_id'))));
    // console.log(user.data());
    
    setUser(user.data());
  }

  const getUserEdit = async () =>{
    
    const user = await getDoc(doc(db, "users", params.id));
    // console.log(user.data());
    
    setUserEdit(user.data());
  }

  useEffect(() => {
    getUserEdit()
    getUser()
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Lógica para validar a senha atual e atualizar a senha no banco de dados

    
    
      // Lógica para atualizar a senha no banco de dados
      if (newPassword === confirmPassword && newPassword !== '') {
        await updateDoc(doc(db, "users", params.id),
          {
            password: newPassword,
            updated_at: new Date(),
          })
        router.back()
      } else {
        setError('As senhas não coincidem');
        setTimeout(() => {
          setError('');
        }, 3000);
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-around bg-slate-900">
      <div className="w-full max-w-md p-4 bg-white rounded-md">
        <div className='flex flex-row items-center justify-center'>
    <BsKey className='text-[40px] text-green-600 my-4' />
        <h2 className="text-2xl font-extrabold text-gray-800 text-center ml-4">{user.name} alterando senha de {userEdit.name}</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
        
          <div className="mb-4">
            <label className="block text-gray-600">Email atual: {userEdit.email}</label>
            <label  className="block text-gray-600">Senha atual: {userEdit.password}</label>
           
          </div>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-600">Nova Senha:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-900 text-gray-900"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-600">Confirme a Nova Senha:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-900 text-gray-900"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-900 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring focus:ring-purple-900"
          >
            Alterar Senha
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      
         
      </div>
    </div>
  );
}
