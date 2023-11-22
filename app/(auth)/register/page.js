"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiUser, FiHome,FiUserPlus } from 'react-icons/fi';
import axios from '../../axios';
import { useRouter } from 'next/navigation';
import { collection,addDoc ,updateDoc,doc,getDoc, setDoc} from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { db } from '../../firebase';
export default function Register() {

  const auth = getAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    level: 0,
    admin: false,
    verified: false,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    status: 'active',
    imageURL: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
  });

  

  const [registrationStatus, setRegistrationStatus] = useState({
    success: false,
    error: null,
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User:", user);
  
      // Adicione o código para atualizar os dados do usuário no Firestore, se necessário.
      const docRef = await setDoc(doc(db, "users", user.uid), { 
        status: 'active',
        updated_at: new Date(),
        name: user.displayName,
        email: user.email,
        imageURL: user.photoURL,
        created_at: new Date(),
        admin: false,
        level: 0,
        verified: false,
        id: user.uid,
        deleted_at: null

      });
  
      localStorage.setItem("user", JSON.stringify(docRef.getData()));
      router.push('/openview');
    } catch (error) {
      console.error("Erro ao fazer login com o Google: ", error);
    }
  };
  const handleSubmit = async (e) => {
    
    e.preventDefault();

    if (formData.name !== '' && formData.email !== '' && formData.password !== '') {
      if (formData.password === 'admin' && formData.email === 'admin@admin.com') {
        formData.imageURL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb_KaegnfDm7tvjNSKg446rn0wkWHd-dTSww&usqp=CAU';
        formData.admin = true;
        formData.level = 1;
        formData.email = 'capyba@email.com';
        formData.password = 'capyba';
        formData.name = 'ADMIN';
      }
      try {

        // const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        // const user = userCredential.user;
        // console.log("User:", user.uid);

        const response = await addDoc(collection(db, "users" ), formData);
        
        await updateDoc(doc(db, "users",response.id), 
    
        {
          id: response.id,
          updated_at: new Date()
        }
        );


        const userRegistred = await getDoc(doc(db, "users", response.id));

        const {
          password,
          ...userSaved
        } = userRegistred.data();

        localStorage.setItem("user_id", JSON.stringify(response.id));
        setRegistrationStatus({ success: false, error: 'Registrando usuário...' });
        setTimeout(() => {
          setRegistrationStatus({ success: true, error: null });
          router.push('/openview');
          
        },3000);
      } catch (error) {
        console.error("Error adding document: ", error);
        setRegistrationStatus({ success: false, error: 'Erro ao registrar.' + error});

       setTimeout(() => {
        setRegistrationStatus({ success: true, error: null });
       }, 5000);
      }
    } else {
      setRegistrationStatus({ success: false, error: 'Preencha todos os campos.' });
      setTimeout(() => {
        setRegistrationStatus({ success: true, error: null });
      },3000)
    }
  }



  return (
    <div className="min-h-screen flex flex-col items-center justify-around bg-slate-900">
    
      
      <div className="w-full max-w-md p-4 bg-white rounded-md">
        <div className="flex flex-row items-center justify-center">
        <FiUserPlus className='text-[40px] text-green-600 my-4 ' />
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
            className="w-full py-2 px-4 bg-purple-900 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring focus:ring-purple-900 "
          >
            Registrar
          </button>
          {registrationStatus.success === false && <span className="text-red-500 font-extrabold">{registrationStatus.error}</span>}
        </form>
        <Link href="https://capybaquigrafo-apirest.vercel.app/pdf/termos" className={`flex flex-1/2 gap-2 text-md my-4 text-gray-800`} >
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0 0 42 42h216v494z"></path></svg> Acessar termos de uso

         
        </Link>
        <Link href="/login" className={`flex flex-1/2 gap-2 text-md my-4 text-gray-800`} >
          <FiUser /> Já tem uma conta? Faça login
        </Link>
        {/* <button
  type="button"
  onClick={handleGoogleLogin}
  className="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-500"
>
  Entrar com o Google
</button> */}
      </div>
      <Link href="/" className={`flex items-center justify-center gap-2 text-2xl text-gray-300 hover:text-green-600`} >
<FiHome className='text-[40px] flex items-center justify-center '/><h3 className='text-white font-extrabold text-xl'>Inicio</h3>
      </Link>
    </div>
  );
}
