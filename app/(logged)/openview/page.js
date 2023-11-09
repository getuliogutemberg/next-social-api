"use client";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { TbMessageShare } from 'react-icons/tb';

export default function Verified() {
  const [isEmailVerified, setEmailVerified] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Adicionado estado para controle de autenticação
  const [verificationCompleted, setVerificationCompleted] = useState(false);
  const [usersRegistred, setUsersRegistered] = useState([]);

  const getUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      console.log(response.data);
      setUsersRegistered(response.data);
    } catch (error) {
      console.log('Erro ao buscar os usuários:', error);
    }
  };
  useEffect(() => {
    getUsers()
    // setUsersRegistered([
    //   {
    //        name: 'Getulio',
    //        email: 'getulio.dev@gmail.com',
    //        password: '12345',
    //        status: 'logouted'
    //      },
    //      {
    //        name: 'Mayra',
    //        email: 'Mayra@email.com',
    //        password: '123456',
    //        status: 'logouted'
    //      }
    //    ])
  },[isLoggedIn])
 
  const verifyEmail = async () => {
    // Lógica para verificar o email do usuário
    // Atualize o estado 'isEmailVerified' com o resultado da verificação
    try {
      const response = await axios.get(`http://localhost:5000/api/verify-email/${localStorage.getItem('authToken')}`);
      console.log( 'resposta de verificação',response.data);
      setEmailVerified(response.data.success);

      setVerificationCompleted(true);
    } catch (error) {
      console.log(' erro na verificação', error.response.data.message);
      setEmailVerified(false);
      setVerificationCompleted(true);
    }
   
    
   

  };

  useEffect(() => {
    if (!verificationCompleted) {
    verifyEmail();
    }
  },[verificationCompleted])
 
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('user') !== null ? true : false)
  },[])

  if (isLoggedIn && !isEmailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-gray-800">
        <div className="max-w-md p-4 bg-white rounded-lg shadow-md text-center ">
          <h2 className="text-2xl font-extrabold mb-4 flex items-center justify-center"><TbMessageShare className='text-[40px] text-purple-800 mx-4'/>Seu email ainda não foi verificado.</h2>
          <p>Por favor, verifique seu email para acessar a seção aberta.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-gray-800 grid grid-cols-5 grid-rows-5 gap-4 h-full p-4 ">
     
    <div className="col-span-4 row-span-4"><div className="bg-white rounded-lg shadow-md text-center h-full ">
    <h2 className="text-2xl font-extrabold mb-4 flex items-center justify-center"><TbMessageShare className='text-[40px] text-purple-800 mx-4'/>Pagina de listagem aberta</h2>
    <p>aqui vai o conteudo aberto</p>
  </div></div>

    <div className="row-span-5 col-start-5 " >  <div className="bg-white rounded-lg shadow-md text-center h-full ">
    <h2 className="text-2xl font-extrabold mb-4">Lista de Usuarios</h2>
    <p>aqui é a lista de usuarios</p>
    {usersRegistred.map((user) => (
      <div key={user.email} className="mb-4">
        <p>{user.name}</p>
        <p>{user.email}</p>
        <p>{user.password}</p>
        <p>{user.status}</p>
      </div>
    ))}
    </div></div>

    <div className="col-span-4 row-start-5 ">
    <div className=" bg-white rounded-lg shadow-md text-center h-full ">
    <h2 className="text-2xl font-extrabold mb-4">novo post</h2>
    <p>aqui vai o conteudo aberto</p>
  </div>
    </div>

      
        
        
    

      


      
  </div>
  );
}
