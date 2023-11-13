"use client"; 
import { useState, useEffect } from 'react';
import {FiSettings} from 'react-icons/fi'

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    
  }, []);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-gray-800">
        <div className="max-w-md p-4 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-extrabold mb-4 flex items-center justify-center"><FiSettings className='text-[40px] text-purple-800 mx-4'/>Você não tem permissão de administrador.</h2>
          <p>Você precisa de permissão de administrador para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-gray-800 grid grid-cols-5 grid-rows-5 gap-4 h-full p-4 ">
     
    <div className="col-span-6 row-span-6"><div className="bg-white rounded-lg shadow-md text-center h-full ">
    <h2 className="text-2xl font-extrabold mb-4 flex items-center justify-center"><FiSettings className='text-[40px] text-purple-800 mx-4'/>Configuracoes</h2>
    <p>aqui sera o conteudo de configuracoes</p>
  </div></div>

   

    

      
        
        
    

      


      
  </div>
  );
}
