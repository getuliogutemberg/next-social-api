"use client"

import { useState } from 'react';
import Link from 'next/link';
import { FiUser, FiHome,FiUserPlus } from 'react-icons/fi';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Envie os dados de registro para a API ou serviço de autenticação
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-around bg-slate-900">
    
      
      <div className="w-full max-w-md p-4 bg-white rounded-md">
        <div className="flex flex-row items-center justify-center">
        <FiUserPlus className='text-[40px] text-gray-800 my-4 ' />
      <h2 className="text-3xl font-extrabold text-gray-900 text-center ml-[20px] "> Registro</h2>
        </div>
        <form onSubmit={handleSubmit}>
        
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-600">Nome:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400 text-gray-900" 
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400 text-gray-900"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-600">Senha:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400 text-gray-900"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-900 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400 "
          >
            Registrar
          </button>
        </form>

        <Link href="/login" className={`flex flex-1/2 gap-2 text-md my-4 text-gray-800`} >
          <FiUser /> Já tem uma conta? Faça login
        </Link>
      </div>
      <Link href="/" className={`flex flex-1/2 gap-2 text-2xl text-gray-300`} >
        <FiHome />Inicio
      </Link>
    </div>
  );
}
