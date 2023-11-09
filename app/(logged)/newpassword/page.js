"use client"
import { useState } from 'react';

import { BsKey } from 'react-icons/bs';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para validar a senha atual e atualizar a senha no banco de dados
  };

  return (
    <div className="min-h-screen flex items-center justify-around bg-slate-900">
      <div className="w-full max-w-md p-4 bg-white rounded-md">
        <div className='flex flex-row items-center justify-center'>
    <BsKey className='text-[40px] text-gray-800 my-4' />
        <h2 className="text-2xl font-extrabold text-gray-800 text-center ml-4">Alterar Senha</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="currentPassword" className="block text-gray-600">Senha Atual:</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400 text-gray-900"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-600">Nova Senha:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400 text-gray-900"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-600">Confirme a Nova Senha:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400 text-gray-900"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-900 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
          >
            Alterar Senha
          </button>
        </form>
        {/* <Link href="/" className={`flex gap-2 text-md my-4 text-gray-800`} >
        <FiHome /> Inicio
      </Link> */}
      
         
      </div>
    </div>
  );
}
