"use client"
// pages/Login.js
// Esta página de login também contém um formulário simples que coleta o email e a senha do usuário. Quando o formulário é enviado, os dados podem ser enviados para uma API ou serviço de autenticação para verificação.
import { useState } from 'react';
import Link from 'next/link';
import { FiHome ,FiUserPlus,FiLogIn} from 'react-icons/fi';
import { useRouter } from 'next/navigation'
import { doc, getDocs,collection, query, updateDoc, where, limit } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {db} from '../../firebase';



export default function Login() {
  const auth = getAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [isLoggedIn, setIsLoggedIn] = useState({
    status: false,
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      
      const { email, password } = formData;
      
      // Consulta a coleção de usuários
    const usersQuery = query(collection(db, "users"), where("email", "==", email),where("password", "==", password), limit(1));

    // Obtém a coleção de documentos
    const querySnapshot = await getDocs(usersQuery);

      if (querySnapshot.empty) {
      setIsLoggedIn({
        status: false,
        message: 'Email ou senha inválido. Por favor, tente novamente.',
      });

      setTimeout(() => {
        setIsLoggedIn({
          status: false,
          message: '',
        });
      }, 3000);

      return;

      }
  
      // Pega o primeiro documento da coleção
    const userDoc = querySnapshot.docs[0];

    localStorage.setItem("user_id", JSON.stringify(userDoc.id));

    // Atualiza o status do usuário no Firestore (se necessário)
    await updateDoc(doc(db, "users", userDoc.id), {
      status: 'active',
      updated_at: new Date(),
    });

    setIsLoggedIn({
      status: true,
      message: "Login bem-sucedido!",
    });

    console.log("Login bem-sucedido!");

    setTimeout(() => {
      router.push('/openview');
    }, 1000);
  } catch (error) {
    // Tratar erros de autenticação
    console.error("Erro ao fazer login:", error);

    setIsLoggedIn({
      status: false,
      message: 'Email ou senha inválido. Por favor, tente novamente.',
    });

    setTimeout(() => {
      setIsLoggedIn({
        status: false,
        message: '',
      });
    }, 3000);
  }
};



  return (
    <div className="min-h-screen flex flex-col items-center justify-around  bg-slate-900">


      <div className="w-full max-w-md p-4 bg-white rounded-md">
        <div className="flex flex-row items-center justify-center">
        <FiLogIn className='text-[40px] text-purple-800 my-4'/>
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mx-[20px] "> Login</h2>
        </div>
        <form onSubmit={handleSubmit}>
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
            Entrar
          </button>
          {isLoggedIn.status === false && <span className="text-red-500 font-extrabold">{isLoggedIn.message}</span>}
        </form>
        {isLoggedIn.status === true && <span className="text-green-500 font-extrabold">{isLoggedIn.message}</span>}

        <Link href="/register" className={`flex flex-1/2 gap-2 text-md my-4 text-gray-800`} >
                <FiUserPlus /> Criar Conta
                </Link>
        
      </div>

      <Link href="/" className={`flex items-center justify-center gap-2 text-2xl text-gray-300 hover:text-purple-800`} >
        <FiHome className='text-[40px] flex items-center justify-center '/><h3 className='text-white font-extrabold text-xl'>Inicio</h3>
      </Link>
     
    </div>
  );
}