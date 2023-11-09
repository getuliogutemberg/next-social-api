"use client";
import { useState, useEffect } from 'react';

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
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <header className="p-4 ">
        <h1 className="text-3xl font-extrabold text-slate-100 text-center">Editar Perfil</h1>
      </header>
      <div className="flex flex-row bg-slate-900 text-slate-800 flex-1 ">
      
      <div className="w-full max-w-md m-4 p-2 mx-auto bg-white rounded-lg shadow-md h-fit">
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-600">Nome:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userProfile.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
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
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
          {/* Outros campos do perfil */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-900 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
          >
            Salvar Alterações
          </button>
        </form>
      </div>

      </div>
    </div>
  );
}
