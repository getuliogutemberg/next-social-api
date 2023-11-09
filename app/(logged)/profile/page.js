"use client";
import { useState, useEffect } from 'react';
import { BiIdCard } from "react-icons/bi";

export default function Profile() {
  const [userProfile, setUserProfile] = useState({
    name: 'Nome do Usuário',
    imageUrl: 'URL da Imagem',
    // Outros campos do perfil
  });

  useEffect(() => {
    // Lógica para buscar os dados do perfil do usuário no servidor
    // Atualize o estado do 'userProfile' com os dados recuperados
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile({ ...userProfile, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar as alterações do perfil para o servidor
  };

  return (
    <div className="min-h-screen flex items-center justify-around bg-slate-900">
      
     
      
      <div className="w-full max-w-md m-4 p-2 mx-auto bg-white rounded-lg shadow-md h-fit">
      <div className='flex flex-row items-center justify-center'>
    <BiIdCard className='text-[40px] text-purple-800 my-4' />
        <h2 className="text-2xl font-extrabold text-gray-800 text-center ml-4">Editar Perfil</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-600">Nome:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userProfile.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-900"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="imageUrl" className="block text-gray-600">URL da Imagem de Perfil:</label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={userProfile.imageUrl}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-900"
            />
          </div>
          {/* Outros campos do perfil */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-900 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-900"
          >
            Salvar Alterações
          </button>
        </form>
      </div>

      
    </div>
  );
}
