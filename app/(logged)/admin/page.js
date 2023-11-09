"use client"; 
import { useState, useEffect } from 'react';

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Lógica para verificar se o usuário logado é um administrador
    // Atualize o estado 'isAdmin' com o resultado da verificação.
  }, []);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-gray-800">
        <div className="max-w-md p-4 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-extrabold mb-4">Você não tem permissão de administrador.</h2>
          <p>Você precisa de permissão de administrador para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <header className="p-4">
        <h1 className="text-3xl font-extrabold text-slate-100 text-center">Área de Administração</h1>
      </header>
      <div className="flex flex-row bg-slate-900 text-slate-800 flex-1 ">
        {/* Conteúdo da área de administração */}
      </div>
    </div>
  );
}
