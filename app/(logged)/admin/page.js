"use client"; 
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSettings } from 'react-icons/fi';
import { doc, getDoc, collection, onSnapshot, query, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function Admin() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [file, setFile] = useState(null);
  const [usersRegistred, setUsersRegistered] = useState([]);
  const [user, setUser] = useState({});
  const [progress, setProgress] = useState(0);

  const getUser = async () => {
    const user = await getDoc(doc(db, 'users', JSON.parse(localStorage.getItem('user_id'))));
    setUser(user.data());
  };

  const uploadFile = () => {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100  ;
        setProgress(percentComplete); // Atualiza o estado do progresso
        console.log(percentComplete)
      }
    });

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        setProgress(0);
        if (xhr.status === 200) {
          console.log('Upload concluído com sucesso!');
          try {
            const data = JSON.parse(xhr.responseText);
            console.log('Resposta do servidor:', data);
            
          } catch (error) {
            console.error('Erro ao analisar a resposta JSON:', error);
          }
        } else {
          console.error('Erro ao enviar o arquivo:', xhr.statusText);
        }
      }
    };

    xhr.open('POST', 'https://capybaquigrafo-apirest.vercel.app/upload', true);
    xhr.send(formData);
  };


  useEffect(() => {
    user.admin === false && router.push('/openview');
  }, [user]);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const users = [];

      querySnapshot.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id });
      });

      setUsersRegistered(users);
    });
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'posts'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const posts = [];

      querySnapshot.forEach((doc) => {
        posts.push({ ...doc.data(), id: doc.id });
      });

      setPosts(posts);
    });
  }, []);
  

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="bg-slate-900 text-gray-800 grid grid-cols-5 grid-rows-5 gap-4 h-full p-4 ">
     
    {user !== undefined && user.admin === true && <div className="col-span-6 row-span-6">
        <div className="bg-white rounded-lg shadow-md text-center h-full p-4 gap-4 flex flex-col">
          <h2 className="text-2xl font-extrabold mb-4 flex items-center justify-center">
            <FiSettings className='text-[40px] text-green-600 mx-4'/>Configurações
          </h2>
          <h2 className="text-2xl font-extrabold mb-4 text-left">Usuários Cadastrados</h2>
          <table className="w-full border">
            <thead className='text-left border'>
              <tr className='bg-green-600 text-white'>
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
                  <td className="p-2">
                    {user.status} 
                    <button 
                      className="ml-2 bg-purple-800 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                      onClick={ async ()=>{
                        if (user.status === 'active') {
                          await fetch('https://capybaquigrafo-apirest.vercel.app/logout', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email: user.email }),
                          });
                        } else {
                          await fetch('https://capybaquigrafo-apirest.vercel.app/login', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              email: user.email,
                              password: user.password,
                            }),
                          });
                        }}}
                        
                      >
                        {user.status === 'active' ? 'logout' : 'login'}

                      </button>
                    </td>
                  <td className="p-2">{user.admin ? 'Admin' : 'User'}</td>
                  <td className="p-2 flex gap-2 justify-end">
                    <button
                      onClick={() => router.push(`/profile/${user.id}`)}
                      className="bg-purple-800 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Editar Cadastro
                    </button>
                    <button
                      onClick={() => router.push(`/newpassword/${user.id}`)}
                      className="bg-purple-800 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Editar Senha
                    </button>
                    <button
                      onClick={async()=>{
                        await deleteDoc(doc(db, 'users', user.id))

                      }}
                      className="bg-purple-800 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Deletar
                    </button>
                    
                  </td>
                </tr>
              ))}
              <tr key={user.id} className='border hover:bg-slate-300 ' >
                  <td colSpan={7} className="p-2 bg-slate-200" >
                   <button onClick={async()=>{
                    await fetch('https://capybaquigrafo-apirest.vercel.app/add', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        "name": "Getulio",
                        "email": "getulio@email.com",
                        "password":"12345",
                        "imageURL":"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    }),
                    })
                   }} className='bg-purple-800 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex gap-2 items-center' ><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M678.3 642.4c24.2-13 51.9-20.4 81.4-20.4h.1c3 0 4.4-3.6 2.2-5.6a371.67 371.67 0 0 0-103.7-65.8c-.4-.2-.8-.3-1.2-.5C719.2 505 759.6 431.7 759.6 349c0-137-110.8-248-247.5-248S264.7 212 264.7 349c0 82.7 40.4 156 102.6 201.1-.4.2-.8.3-1.2.5-44.7 18.9-84.8 46-119.3 80.6a373.42 373.42 0 0 0-80.4 119.5A373.6 373.6 0 0 0 137 888.8a8 8 0 0 0 8 8.2h59.9c4.3 0 7.9-3.5 8-7.8 2-77.2 32.9-149.5 87.6-204.3C357 628.2 432.2 597 512.2 597c56.7 0 111.1 15.7 158 45.1a8.1 8.1 0 0 0 8.1.3zM512.2 521c-45.8 0-88.9-17.9-121.4-50.4A171.2 171.2 0 0 1 340.5 349c0-45.9 17.9-89.1 50.3-121.6S466.3 177 512.2 177s88.9 17.9 121.4 50.4A171.2 171.2 0 0 1 683.9 349c0 45.9-17.9 89.1-50.3 121.6C601.1 503.1 558 521 512.2 521zM880 759h-84v-84c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v84h-84c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h84v84c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-84h84c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path></svg>adicionar novo usuario </button>
                  </td>
                </tr>
            </tbody>
          </table>
<h2 className='text-2xl font-extrabold mb-4 text-left'>Posts Cadastrados</h2>
          <table className="w-full border">
            <thead className='text-left border'>
              <tr className='bg-green-600 text-white'>
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
                      className="bg-purple-800 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Editar Post
                    </button>
                    
                  </td>
                </tr>
              ))}
              
            </tbody>
          </table>

         <table className="w-full border">
          <thead className='text-left border'>
            <tr className='bg-green-600 text-white'>
              <th className="text-left font-medium p-2 border">Arquivo Termos de uso </th>
              <th className="text-left font-medium p-2 border w-[300px]">Edição</th>
              

            </tr>
          </thead>
          <tbody >
            <tr className='border hover:bg-slate-300 '>
              <td className="p-2 flex justify-center flex-col">
              <button
                      onClick={() => router.push(`https://capybaquigrafo-apirest.vercel.app/pdf/termos`)}
                      className="hover:bg-slate-400 text-slate-800  py-2 px-4 rounded "
                    >
                <div className="flex gap-2 items-center "><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0 0 42 42h216v494z"></path> </svg>Acessar termos de uso</div></button>
                {progress !== 0 && <Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box>}
                </td>
              
              <td className="p-2" >
                <div className="flex gap-2 items-center ">
                <input
        type="file"
        name="file"
        id="file"
        accept=".pdf"
        required
        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-100 file:text-violet-700 hover:file:bg-violet-200"
        onChange={(e) => setFile(e.target.files[0])}
      />
                <button
                      onClick={() => uploadFile()}
                      
                      className="bg-purple-800 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Atualizar Termos
                    </button>
                    </div>
                    </td>
              
            </tr>
            
          </tbody>
         </table>
          
        </div>
    </div>}
   
    </div>
  );
}
