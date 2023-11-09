"use client";
import { useEffect, useState } from 'react';

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
          <h2 className="text-2xl font-extrabold mb-4">Seu email ainda não foi verificado.</h2>
          <p>Por favor, verifique seu email para acessar a seção restrita.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <header className="p-4">
        <h1 className="text-3xl font-extrabold text-slate-100 text-center">Seção Restrita para Emails Verificados</h1>
      </header>
      <div className="flex flex-row bg-slate-900 text-slate-800 flex-1 ">
        {/* Conteúdo da seção restrita */}
      </div>
    </div>
  );
}
