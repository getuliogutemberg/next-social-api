"use client";
import { useEffect, useState } from 'react';
import {TbLockShare} from 'react-icons/tb'

export default function Verified() {
  const [isEmailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    // Lógica para verificar se o email do usuário está verificado.
    // Atualize o estado 'isEmailVerified' com o resultado da verificação.
  }, []);

  if (!isEmailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-gray-800">
        <div className="max-w-md p-4 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-extrabold mb-4  flex items-center justify-center"> <TbLockShare className='text-[40px] text-purple-800 mx-4 '/>Seu email ainda não foi verificado.</h2>
          <p>Por favor, verifique seu email para acessar a seção restrita.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-gray-800 grid grid-cols-5 grid-rows-5 gap-4 h-full p-4 ">
     
    <div className="col-span-4 row-span-4"><div className="bg-white rounded-lg shadow-md text-center h-full ">
    <h2 className="text-2xl font-extrabold mb-4 flex items-center justify-center"><TbLockShare className='text-[40px] text-purple-800 mx-4'/>Pagina de listagem Secreta</h2>
    <p>aqui vai o conteudo secreto</p>
  </div></div>

    <div className="row-span-5 col-start-5 " >  <div className="bg-white rounded-lg shadow-md text-center h-full ">
    <h2 className="text-2xl font-extrabold mb-4">Lista de Usuarios</h2>
    <p>aqui é a lista de usuarios</p>
    </div></div>

    <div className="col-span-4 row-start-5 ">
    <div className=" bg-white rounded-lg shadow-md text-center h-full ">
    <h2 className="text-2xl font-extrabold mb-4">novo post</h2>
    <p>aqui vai o conteudo secreto</p>
  </div>
    </div>

      
        
        
    

      


      
  </div>
  );
}
