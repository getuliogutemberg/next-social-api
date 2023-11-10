"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiUser, FiHome,FiUserPlus } from 'react-icons/fi';
import axios from '../../axios';
import { useRouter } from 'next/navigation';

export default function Register() {

  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [registrationStatus, setRegistrationStatus] = useState({
    success: false,
    error: null,
  });

  useEffect(() => {
    console.log(router)
  },[])



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Dados do formulário:', formData);
   
     try { 
      const response = await axios.post('http://localhost:5000/api/register', formData);  // Faz a solicitação ao backend
      console.log('Resposta do servidor:', response.data.message);
      console.log('Resposta do servidor:', response.data.user);
      // Lógica adicional de redirecionamento ou feedback ao usuário
      localStorage.setItem('authToken', response.data.authToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // Registro bem-sucedido
      setRegistrationStatus({ success: true, error: null });
      
      // Redirecionar para a página desejada (por exemplo, a página de login)
      router.push('/openview');


    } catch (error) {
      console.log('Erro na solicitação:', error.response.data.message);
      console.log('Usuario:', error.response.data.user);

       // Registro falhou
       setRegistrationStatus({ success: false, error: 'Erro ao registrar.' + error.response.data.message });

       setTimeout(() => {
        setRegistrationStatus({ success: false, error: null });
       }, 5000);
    }
    
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-around bg-slate-900">
    
      
      <div className="w-full max-w-md p-4 bg-white rounded-md">
        <div className="flex flex-row items-center justify-center">
        <FiUserPlus className='text-[40px] text-purple-800 my-4 ' />
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
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-900 text-gray-900" 
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
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-900 text-gray-900"
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
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-900 text-gray-900"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-900 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-900 "
          >
            Registrar
          </button>
          {registrationStatus.success === false && <span className="text-red-500 font-extrabold">{registrationStatus.error}</span>}
        </form>

        <Link href="/login" className={`flex flex-1/2 gap-2 text-md my-4 text-gray-800`} >
          <FiUser /> Já tem uma conta? Faça login
        </Link>
      </div>
      <Link href="/" className={`flex items-center justify-center gap-2 text-2xl text-gray-300 hover:text-purple-800`} >
<FiHome className='text-[40px] flex items-center justify-center '/><h3 className='text-white font-extrabold text-xl'>Inicio</h3>
      </Link>
    </div>
  );
}
