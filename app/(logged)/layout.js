"use client";

import { useState,  } from 'react';
import { Inter } from 'next/font/google'
import '../globals.css'
import Link from 'next/link';
import { FiLogOut,FiChevronLeft, FiMenu ,FiUser,FiCheck,FiLock,FiSettings} from 'react-icons/fi';
import {RxEyeOpen,RxEyeClosed} from 'react-icons/rx'


const inter = Inter({ subsets: ['latin'] })



export default function RootLayout({ children }) {
  
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };
  return (
    <html lang="en">
      <body className={inter.className}>

        <div className='flex'>
        <div  className={`min-h-screen flex-row bg-purple-950 p-5 transition-all ease-in-out duration-2000 ${isNavOpen ? 'w-128' : 'w-16'}`}>
        <h2 className="text-white text-2xl mb-[5vh]" onClick={toggleNav}>
            <span className="cursor-pointer">{isNavOpen ? <FiChevronLeft/> : <FiMenu/>}</span>
          </h2>
        <div className=' mb-[5vh] '>
              
                {/* <Link href="/"  className={`text-white my-0 hover:underline flex gap-2  transition-all ease-in-out duration-2000${!isNavOpen ? 'justify-center ml-1' : 'justify-left ml-4'} h-6 `}>
                <FiHome />{isNavOpen && 'Home'}
                </Link> */}
              
            </div>
          
          <ul className={`flex flex-col gap-5`}>
          
            <div className=" ">
              <li>
                <Link href="/profile" className={`text-white hover:underline flex gap-2 my-0 transition-all ease-in-out duration-2000${!isNavOpen ? 'justify-center ml-1' : 'justify-left ml-4 '} h-6 ` }>
                <FiUser />{isNavOpen && 'Editar Perfil de Usuário'} 
                </Link>
              </li>
              <li>
                <Link href="/newpassword" className={`text-white hover:underline flex gap-2 my-0 transition-all ease-in-out duration-2000${!isNavOpen ? 'justify-center ml-1' : 'justify-left ml-4'} h-6 `}>
                <FiLock /> {isNavOpen && 'Alterar Senha'}
                </Link>
              </li>
              <li>
                <Link href="/openview" className={`text-white hover:underline flex gap-2 my-0 transition-all ease-in-out duration-2000${!isNavOpen ? 'justify-center ml-1' : 'justify-left ml-4 '} h-6 `}>
                <RxEyeOpen /> {isNavOpen && 'Área Aberta'}
                </Link>
              </li>
              <li>
                <Link href="/secretview" className={`text-white hover:underline flex gap-2 my-0 transition-all ease-in-out duration-2000${!isNavOpen ? 'justify-center ml-1' : 'justify-left ml-4 '} h-6 `}>
                <RxEyeClosed /> {isNavOpen && 'Área Restrita'}
                </Link>
              </li>
              
              <li >
                <Link href="/admin"  className={`text-white hover:underline flex gap-2 my-0 transition-all ease-in-out duration-2000${!isNavOpen ? 'justify-center ml-1' : 'justify-left ml-4'} h-6 `}>
                <FiSettings width={48} height={48}/>{isNavOpen && 'Admin'}
                </Link>
              </li>
            </div>
            
          </ul>

          <div className=' mt-[5vh] '>
              
              <Link href="/"  className={`text-white my-0 hover:underline flex gap-2  transition-all ease-in-out duration-2000${!isNavOpen ? 'justify-center ml-1' : 'justify-left ml-4'} h-6 `}>
              <FiLogOut />{isNavOpen && 'Logout'}
              </Link>
            
          </div>
        </div>
        
        <div className={`flex-1 `}>
        {children}
        </div>

        </div>

      
        
        </body>
    </html>
  )
}
