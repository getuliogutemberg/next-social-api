"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { BiIdCard } from "react-icons/bi";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function Profile() {
  const router = useRouter();
  const [save, setSave] = useState(false);
  const [user, setUser] = useState({

  });
  const [userEdit, setUserEdit] = useState({
    
  })

  const getUserEdit = async () =>{
    // console.log(params)
    const userEdit = await getDoc(doc(db, "users", JSON.parse(localStorage.getItem('user_id'))));
    // console.log(user.data());
    
    setUserEdit(userEdit.data());
  }
  const getUser = async () =>{
    
    const user = await getDoc(doc(db, "users", JSON.parse(localStorage.getItem('user_id'))));
    // console.log(user.data());
    
    setUser(user.data());
  }

  useEffect(() => {
    getUser()
    getUserEdit()
  },[])

  useEffect(() => {
    // Lógica para buscar os dados do perfil do usuário no servidor
    // Atualize o estado do 'userProfile' com os dados recuperados
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserEdit({ ...user, [name]: value });
  };

  const handleCheckboxChange = async(e) => {
    const { name, checked } = e.target;
    setUserEdit({ ...user, [name]: checked });

  }

  const handleSelectChange = async(e) => {
    const { name, value } = e.target;
    setUserEdit({ ...user, [name]: parseInt(value) });
  }
  const handleSubmit = async(e) => {
    e.preventDefault();
    
    await updateDoc(doc(db, "users", userEdit.id),
    {
      name: userEdit.name,
      imageURL: userEdit.imageURL,
      email: userEdit.email,
      level: userEdit.level,
      admin: userEdit.admin,
      verified: userEdit.verified,
      updated_at: new Date(),
      
    })

    
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
    <BiIdCard className='text-[40px] text-green-600 my-4' />
        <h2 className="text-2xl font-extrabold text-gray-800 text-center ml-4">Editar Perfil</h2>
      {userEdit.level > 0  && <div className="top-0 left-0 text-red-500 relative pl-4 scale-150">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" role="img" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><title></title><path d="M21.98 7.448L19.62 0H4.347L2.02 7.448c-1.352 4.312.03 9.206 3.815 12.015L12.007 24l6.157-4.552c3.755-2.81 5.182-7.688 3.815-12.015l-6.16 4.58 2.343 7.45-6.157-4.597-6.158 4.58 2.358-7.433-6.188-4.55 7.63-.045L12.008 0l2.356 7.404 7.615.044z"></path></svg>
      </div>}
      {userEdit.admin === true && <div className="top-0 left-0 text-black relative pl-4 scale-150">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" role="img" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><title></title><path d="M23.996 10.648l-6.153-5.644-.865.944 5.127 4.7H1.895l5.127-4.705L6.157 5 .004 10.648H0v3.72c0 1.682 1.62 3.052 3.61 3.052h3.794c1.99 0 3.61-1.37 3.61-3.051v-2.445h1.968v2.445c0 1.681 1.62 3.051 3.61 3.051h3.794c1.99 0 3.61-1.37 3.61-3.051v-3.72z"></path></svg>
        </div>}
        </div>
        
        {userEdit !== undefined && <form onSubmit={handleSubmit} className="flex flex-col items-start justify-center">
        <div className="flex flex-row max-[500px]:flex-col max-[500px]:w-full" >
        <div className="flex flex-col items-center justify-center">
        <img
          src={userEdit.imageURL}
          alt="Profile"
          className="w-[300px] rounded"
        />
           
          </div>
        
          <div className="flex flex-col w-full">
            {/* <label htmlFor="name" className="block text-gray-600">Nome:</label> */}
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={userEdit.name}
              onChange={handleInputChange}
              className="w-full px-3 py-1 border-b rounded-lg focus:outline-none focus:ring focus:ring-purple-900 text-slate-600 cursor-pointer"
            />

            <input
              type="text"
              id="email"
              name="email"
              disabled={user.admin ? false : user.level === 1 ? false : true}
              defaultValue={userEdit.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-1 border-b rounded-lg focus:outline-none focus:ring focus:ring-purple-900 text-slate-600 cursor-pointer ${userEdit.admin ? false : userEdit.level === 1 ? '' : 'opacity-50 '}`}
            />
            <div className="flex items-center justify-start px-3 gap-4  py-1">
            <label htmlFor="admin" className={`text-gray-600 ${userEdit.admin ? false : userEdit.level === 1 ? '' : 'opacity-50 '}`}>Autorização</label>
            <select
              type="selector"
              id="level"
              name="level"
              disabled={userEdit.admin ? false : userEdit.level === 1 ? false : true}
              // defaultValue={0}
              onChange={handleSelectChange}
              className={`w-full px-3 py-1 border-b rounded-lg focus:outline-none focus:ring focus:ring-purple-900 text-slate-600 cursor-pointer ${userEdit.admin ? false : userEdit.level === 1 ? '' : 'opacity-50 '}`}
            >
              {userEdit.level === 0 ? <><option value={0} selected >Limitada</option> <option value={1} >Ilimitada</option> </> : <><option value={0}  >Limitada</option> <option value={1} selected>Ilimitada</option></>}
              
              
            </select>
            </div>

 <div className="flex items-center justify-start px-3 gap-4  py-1">
 <label htmlFor="admin" className={` text-gray-600 ${user.admin ? '' : 'opacity-50 '}`}>Administrador</label>
            <input
              type="checkbox"
              id="admin"
              name="admin"
              disabled={user.admin ? false : true}
              checked={userEdit.admin ? 'on' : ''}
              onChange={handleCheckboxChange}
              className={` rounded-lg focus:outline-none focus:ring focus:ring-purple-900 text-slate-600 cursor-pointer ${user.admin ? '' : 'opacity-50 '}`}
            />
</div>
          </div>
          
          {/* Outros campos do perfil */}

          </div>
          <input
              type="text"
              id="imageURL"
              name="imageURL"
              placeholder='Cole a aqui URL da imagem'
              // defaultValue={JSON.parse(localStorage.getItem('user')).imageURL}
              onChange={handleInputChange}
              className="w-full px-3 py-1 border-b rounded-lg focus:outline-none focus:ring focus:ring-purple-900 text-slate-600 cursor-pointer text-center"
            />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-900 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring focus:ring-purple-900"
          >
            Salvar Alterações
          </button>
        </form>}
        {save && <span className='text-red-400 font-extrabold '>Registrando alterações...</span>}
      </div>

      
    </div>
  );
}
