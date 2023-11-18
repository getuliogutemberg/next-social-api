"use client"; 
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {FiSettings} from 'react-icons/fi'
import { doc, getDoc , collection, onSnapshot, query,deleteDoc} from 'firebase/firestore';
import { db } from '../../firebase';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Admin() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [usersRegistred, setUsersRegistered] = useState([]);
  const [user, setUser] = useState({
    
  });
  const getUser = async () =>{
    const user = await getDoc(doc(db, "users", JSON.parse(localStorage.getItem('user_id'))));
    console.log(user.data());
    
    setUser(user.data());
  }

  useEffect(() => {
    user.admin === false && router.push('/openview')
  },[user])

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const users = [];

      querySnapshot.forEach((doc) => {
        users.push({...doc.data(), id: doc.id});
      })

      setUsersRegistered(users);
    })
  }, [])

  useEffect(() => {
    const q = query(collection(db, 'posts'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const posts = [];

      querySnapshot.forEach((doc) => {
        posts.push({...doc.data(), id: doc.id});
      })

      console.log(posts);
      setPosts(posts);
    })
  }, [])

  useEffect(() => {
    getUser()
  },[])

  return (
    <div className="bg-slate-900 text-gray-800 grid grid-cols-5 grid-rows-5 gap-4 h-full p-4 ">
     
    {user !== undefined && user.admin === true && <div className="col-span-6 row-span-6">
        <div className="bg-white rounded-lg shadow-md text-center h-full p-4 gap-4 flex flex-col">
          <h2 className="text-2xl font-extrabold mb-4 flex items-center justify-center">
            <FiSettings className='text-[40px] text-purple-800 mx-4'/>Configurações
          </h2>
          <h2 className="text-2xl font-extrabold mb-4 text-left">Usuários Cadastrados</h2>
          <table className="w-full border">
            <thead className='text-left border'>
              <tr className='bg-purple-800 text-white'>
                <th className="text-left font-medium p-2 border">Nome</th>
                <th className="text-left font-medium p-2 border">Email</th>
                <th className="text-left font-medium p-2 border" >Status</th>
                <th className="text-left font-medium p-2 border">Permissão</th>
                <th className="text-left font-medium p-2 border w-[300px]">Edição</th>

              </tr>
            </thead>
            <tbody>
              {usersRegistred.map((user)=>(
                <tr key={user.id} className='border hover:bg-slate-300 ' >
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.status}</td>
                  <td className="p-2">{user.admin ? 'Admin' : 'User'}</td>
                  <td className="p-2 flex gap-2 justify-end">
                    <button
                      onClick={() => router.push(`/profile/${user.id}`)}
                      className="bg-purple-800 hover:bg-purple-900 text-white font-bold py-2 px-4 rounded"
                    >
                      Editar Cadastro
                    </button>
                    <button
                      onClick={() => router.push(`/newpassword/${user.id}`)}
                      className="bg-purple-800 hover:bg-purple-900 text-white font-bold py-2 px-4 rounded"
                    >
                      Editar Senha
                    </button>
                    <button
                      onClick={async()=>{
                        await deleteDoc(doc(db, 'users', user.id))

                      }}
                      className="bg-purple-800 hover:bg-purple-900 text-white font-bold py-2 px-4 rounded"
                    >
                      Deletar
                    </button>
                    
                  </td>
                </tr>
              ))}
              
            </tbody>
          </table>
<h2 className='text-2xl font-extrabold mb-4 text-left'>Posts Cadastrados</h2>
          <table className="w-full border">
            <thead className='text-left border'>
              <tr className='bg-purple-800 text-white'>
                <th className="text-left font-medium p-2 border">Post</th>
                <th className="text-left font-medium p-2 border">Data</th>
                <th className="text-left font-medium p-2 border">Nivel</th>
                <th className="text-left font-medium p-2 border">N° Comentários</th>
                <th className="text-left font-medium p-2 border">N° Likes</th>
                <th className="text-left font-medium p-2 border">Autor</th>
                <th className="text-left font-medium p-2 border w-[300px]">Edição</th>

              </tr>
            </thead>
            <tbody>
              {posts.map((post)=>(
                <tr key={post.id} className='border hover:bg-slate-300'>
                  <td className="p-2">{post.title}</td>
                  <td className="p-2">{format(post.created_at.toDate(), "EEEE, d 'de' MMMM - HH:mm 'h'", {
                locale: ptBR, // Você também precisa importar a localização desejada, como 'pt-BR'
              })}</td>
                  <td className="p-2">{post.permission}</td>
                  <td className="p-2">{post.comments.length}</td>
                  <td className="p-2">{post.likes.length}</td>
                  <td className="p-2">{post.createdBy.name}</td>
                  <td className="p-2 flex gap-2 justify-end">
                    <button
                      onClick={() => router.push(`/post/${post.id}`)}
                      className="bg-purple-800 hover:bg-purple-900 text-white font-bold py-2 px-4 rounded"
                    >
                      Editar Post
                    </button>
                    
                  </td>
                </tr>
              ))}
              
            </tbody>
          </table>
          
        </div>
    </div>}
   
    </div>
  );
}
