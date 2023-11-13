"use client";

import { useEffect, useState,  } from 'react';
import { Inter } from 'next/font/google'
import '../globals.css'
import Link from 'next/link';
import { FiLogOut,FiChevronLeft, FiMenu ,FiUser,FiCheck,FiLock,FiSettings, FiDivide} from 'react-icons/fi';
import {RxEyeOpen,RxEyeClosed} from 'react-icons/rx'
import {BiUser,} from 'react-icons/bi';
import {BsKey} from 'react-icons/bs';
import {LiaUserSecretSolid} from 'react-icons/lia';
import {TbLockShare,TbMessageShare} from 'react-icons/tb';
import { usePathname } from 'next/navigation';
import axios from '../axios';
import { useRouter } from 'next/navigation';
import { collection,addDoc,setDoc,doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const inter = Inter({ subsets: ['latin'] })




export default function RootLayout({ children }) {

  const router = useRouter();
  const pathname = usePathname()
  
  const [isNavOpen, setIsNavOpen] = useState(false);

  

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const logout = async () => {

    // try {
    //   const response = await axios.post('http://localhost:5000/api/logout', {email:JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).email : ''});
    //   console.log(response.data);
    //   localStorage.removeItem('authToken');
    //   localStorage.removeItem('user');
    //   router.push('/');
    // }
    // catch (error) {
    //   console.log("erro ao deslogar",error.response.data.message);
    // }

    // update users status on firebase
    
    localStorage.getItem('usuarioRef') !== null && await updateDoc(doc(db, "users", localStorage.getItem('usuarioRef')), 
    
    {
      
      status: 'inactive',
      updated_at: new Date(),
    }

    );

    localStorage.removeItem('user')
    localStorage.removeItem('usuarioRef')

    
}

      
    
  

  

  return (
   
      

        <div className='flex'>
        <div  onMouseLeave={() => setIsNavOpen(false)} className={`min-h-[100vh] flex-row bg-purple-950 p-0 transition-all ease-in-out duration-2000 ${isNavOpen ? 'w-128' : 'w-16'} border-r-2 border-purple-500`}>
        <h2 className="text-white text-2xl font-bold mx-3 my-3 " onClick={toggleNav}>
            <span className="cursor-pointer flex items-center">{isNavOpen ? (<><FiChevronLeft className='text-purple-700 w-10 h-10   '/>{isNavOpen && <h3 className='text-white font-extrabold text-xl  transition-all ease-in-out duration-2000 hover:text-purple-700'>Fechar</h3>}</>): <FiMenu className='text-white w-10 h-10  hover:text-purple-700'/>}</span>
          </h2>
          <div className='border-b-2 w-full border-purple-500'/>
        <div className=' mb-[5vh] '>
        
                {/* <Link href="/"  className={`text-white my-0 hover:underline flex gap-2  transition-all ease-in-out duration-2000${!isNavOpen ? 'justify-center ml-1' : 'justify-left ml-4'} h-6 `}>
                <FiHome />{isNavOpen && 'Home'}
                </Link> */}
              
            </div>
          
          <ul className={`flex flex-col `}>
          
            <div className=" ">
            <div className='border-b-2 w-full  border-purple-500'/>
              <li className='my-2'>
                <Link href="/openview" className={`text-white hover:text-purple-700 flex gap-2 my-0 transition-all ease-in-out duration-2000${!isNavOpen ? 'justify-center ml-3' : 'justify-left pl-3 '} h-10 flex items-center  `}>
                <TbMessageShare className={`transition-all ease-in-out duration-2000 ${pathname === '/openview' && 'text-purple-700 scale-125'  } w-10 h-10`}/> {isNavOpen && <h3 className={` font-extrabold text-xl transition-all ease-in-out duration-2000 ${pathname === '/openview' && 'm-auto text-purple-700' }  transition-all ease-in-out duration-2000 hover:text-purple-700`}>Área Aberta</h3>}
                </Link>
              </li>
              <div className='border-b-2 w-full border-purple-500'/>
              <li className='my-2'>
                <Link href="/secretview" className={`text-white hover:text-purple-700 flex gap-2 my-0 transition-all ease-in-out duration-2000${!isNavOpen ? 'justify-center ml-3' : 'justify-left pl-3 '} h-10 flex items-center `}>
                <TbLockShare className={`transition-all ease-in-out duration-2000 ${pathname === '/secretview' && 'text-purple-700 scale-125' } w-10 h-10`}/> {isNavOpen && <h3 className={` font-extrabold text-xl transition-all ease-in-out duration-2000 ${pathname === '/secretview' && 'm-auto text-purple-700' }  transition-all ease-in-out duration-2000 hover:text-purple-700`}>Área Restrita</h3>}
                </Link>
              </li>
              
              
              <div className='border-b-2 w-full border-purple-500'/>
              <li className='my-2'>
                <Link href="/profile" className={`text-white hover:text-purple-700 flex gap-2 my-0   ${!isNavOpen ? 'justify-center' : 'justify-left ml-3'} h-10 flex items-center ` }>
                <BiUser className={`transition-all ease-in-out duration-2000 ${pathname === '/profile' && 'text-purple-700 scale-125'} w-10 h-10`}/>{isNavOpen && <h3 className={` font-extrabold text-xl transition-all ease-in-out duration-2000 ${pathname === '/profile' && 'm-auto text-purple-700 ' } transition-all ease-in-out duration-2000 hover:text-purple-700`}>Editar Perfil de Usuário</h3>} 
                </Link>
              </li>
              <div className='border-b-2 w-full border-purple-500'/>
              <li className='my-2'>
                <Link href="/newpassword" className={`text-white hover:text-purple-700 flex gap-2 my-0 transition-all ease-in-out duration-2000${!isNavOpen ? 'justify-center ml-3' : 'justify-left pl-3'} h-10 flex items-center `}>
                <BsKey className={`transition-all ease-in-out duration-2000 ${pathname === '/newpassword' && 'text-purple-700 scale-125' } w-10 h-10`}/> {isNavOpen && <h3 className={` font-extrabold text-xl transition-all ease-in-out duration-2000 ${pathname === '/newpassword' && 'm-auto text-purple-700' } transition-all ease-in-out duration-2000 hover:text-purple-700 `}>Alterar Senha</h3>}
                </Link>
              </li>
              <div className='border-b-2 w-full border-purple-500'/>
              
              <li className='my-2'>
                <Link href="/admin"  className={`text-white hover:text-purple-700 flex gap-2 my-0 transition-all ease-in-out duration-2000${!isNavOpen ? 'justify-center ml-3' : 'justify-left pl-3'} h-10 flex items-center `}>
                <FiSettings className={`transition-all ease-in-out duration-2000 ${pathname === '/admin' && 'text-purple-700 scale-125'} w-10 h-10 `}/>{isNavOpen && <span className={` font-extrabold text-xl transition-all ease-in-out duration-2000 ${pathname === '/admin' && 'm-auto text-purple-700' } transition-all ease-in-out duration-2000 hover:text-purple-700 `}>Configuração </span>}
                </Link>
              </li>
              <div className='border-b-2 w-full border-purple-500'/>
            </div>

            
          </ul>

          <div className=' mt-[5vh] '>
              
              <Link href="/" onClick={() => logout()} className={`text-white my-0 hover:text-purple-700 flex gap-2  transition-all ease-in-out duration-2000${!isNavOpen ? 'justify-center ' : 'justify-left '} h-10 ml-3 flex items-center `}>
              <FiLogOut className={`transition-all ease-in-out duration-2000  w-10 h-10`}/>{isNavOpen && <span className='text-white transition-all ease-in-out duration-2000 font-extrabold text-xl hover:text-purple-700 '>Logout</span>}
              </Link>
            
          </div>
        </div>
        
        <div className={`flex-1 `}>
        {children}
        </div>
        

        </div>

      
        
        
    
  )
}
