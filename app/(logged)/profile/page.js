"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { BiIdCard } from "react-icons/bi";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function Profile() {
  const router = useRouter();
  const [save, setSave] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: JSON.parse(localStorage.getItem('user')).name,
    imageURL: JSON.parse(localStorage.getItem('user')).imageURL,
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

  const handleSubmit = async(e) => {
    e.preventDefault();
    await updateDoc(doc(db, "users", JSON.parse(localStorage.getItem('user')).id),
    {
      name: userProfile.name,
      imageURL: userProfile.imageURL,
      updated_at: new Date(),
      
    })

    const response = await getDoc(doc(db, "users", JSON.parse(localStorage.getItem('user')).id))

    const {password, ...newUser} = response.data()

    localStorage.setItem('user', JSON.stringify(newUser))

    // router.push('/openview')
    router.refresh()
    setSave(true)
    setTimeout(() => {
      setSave(false)
      router.push('/openview')
    },3000)
    // Lógica para enviar as alterações do perfil para o servidor
  };

  return (
    <div className="min-h-screen flex items-center justify-around bg-slate-900">
      
     
      
      <div className="w-full max-w-md m-4 p-2 mx-auto bg-white rounded-lg shadow-md h-fit ">
      <div className='flex flex-row items-center justify-center'>
    <BiIdCard className='text-[40px] text-purple-800 my-4' />
        <h2 className="text-2xl font-extrabold text-gray-800 text-center ml-4">Editar Perfil</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col items-start justify-center">
        <div className="flex flex-row">
        <div className="flex flex-col items-center justify-center">
        <img
          src={userProfile.imageURL}
          alt="Profile"
          className="w-[300px] rounded"
        />
            {/* <label htmlFor="imageURL" className="block text-gray-600">URL da Imagem de Perfil:</label> */}
            {/* <input
              type="text"
              id="imageURL"
              name="imageURL"
              placeholder='URL da imagem de perfil'
              // defaultValue={JSON.parse(localStorage.getItem('user')).imageURL}
              onChange={handleInputChange}
              className="w-full px-3 py-1 border-b rounded-lg focus:outline-none focus:ring focus:ring-purple-900 text-slate-600"
            /> */}
          </div>
        
          <div className="flex flex-col w-full">
            {/* <label htmlFor="name" className="block text-gray-600">Nome:</label> */}
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={JSON.parse(localStorage.getItem('user')).name}
              onChange={handleInputChange}
              className="w-full px-3 py-1 border-b rounded-lg focus:outline-none focus:ring focus:ring-purple-900 text-slate-600 cursor-pointer"
            />

            <input
              type="text"
              id="email"
              name="email"
              disabled={true}
              defaultValue={JSON.parse(localStorage.getItem('user')).email}
              onChange={handleInputChange}
              className="w-full px-3 py-1 border-b rounded-lg focus:outline-none focus:ring focus:ring-purple-900 text-slate-600 cursor-pointer"
            />
<div className="flex items-center justify-start px-3 gap-4  py-1">
<label htmlFor="admin" className=" text-gray-600">Autorização</label>
            <select
              type="selector"
              id="level"
              name="level"
              disabled={true}
              defaultValue={JSON.parse(localStorage.getItem('user')).level}
              onChange={handleInputChange}
              className="w-full px-3 py-1 border-b rounded-lg focus:outline-none focus:ring focus:ring-purple-900 text-slate-600 cursor-pointer"
            >
              <option value="0">Limitada</option>
              <option value="1">Ilimitada</option>
              
            </select>
            </div>

 <div className="flex items-center justify-start px-3 gap-4  py-1">
 <label htmlFor="admin" className=" text-gray-600">Administrador</label><input
              type="checkbox"
              id="admin"
              name="admin"
              disabled={true}
              defaultValue={JSON.parse(localStorage.getItem('user')).admin}
              onChange={handleInputChange}
              className=" rounded-lg focus:outline-none focus:ring focus:ring-purple-900 text-slate-600 cursor-pointer"
            />
</div>
          </div>
          
          {/* Outros campos do perfil */}

          </div>
          <input
              type="text"
              id="imageURL"
              name="imageURL"
              placeholder='URL da imagem de perfil'
              // defaultValue={JSON.parse(localStorage.getItem('user')).imageURL}
              onChange={handleInputChange}
              className="w-full px-3 py-1 border-b rounded-lg focus:outline-none focus:ring focus:ring-purple-900 text-slate-600 cursor-pointer"
            />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-900 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-900"
          >
            Salvar Alterações
          </button>
        </form>
        {save && <span className='text-red-400 font-extrabold '>Registrando alterações...</span>}
      </div>

      
    </div>
  );
}
