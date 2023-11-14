'use client'
import React from 'react'
import { useState } from 'react';
import { addDoc ,updateDoc,doc,query, collection, onSnapshot} from 'firebase/firestore';
import {db} from '../firebase';
const ActionBar = (props) => {
    const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const [dateFilter, setDateFilter] = useState('');
  const [nameSearch, setNameSearch] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verifique se todos os campos obrigatórios estão preenchidos
    if (title === '' || description === '') {
      setPostError('Os campos de título e descricão precisam estar preenchidos.');
      setTimeout(() => {
        setPostError('');
      }, 3000);
      return;
    }
    
    const userData = JSON.parse(localStorage.getItem('user'));
    const {verified,status,deleted_at,updated_at,created_at,...creator } = userData;
  

        // Crie um objeto com os dados do novo post
        const newPost = {
          title,
          description,
          image: image!==''? image :'https://img.freepik.com/free-photo/abstract-textured-backgound_1258-30588.jpg',
          comments: [],
          likes: [],
          createdBy: creator, // Substitua pelo nome do usuário real
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
          permission: 'public',
          level: props.level
        };

         // Crie um objeto com os dados do novo post
        //  const newPost = {
        //   title,
        //   description,
        //   image: image!==''? image :'https://img.freepik.com/free-photo/abstract-textured-backgound_1258-30588.jpg',
        //   comments: [],
        //   likes: [],
        //   createdBy: creator, // Substitua pelo nome do usuário real
        //   created_at: new Date(),
        //   updated_at: new Date(),
        //   deleted_at: null,
        //   permission: 'limited',
        //   level: 1
        // };

    try {
      // Chame a função de callback para enviar o novo post para o servidor
      // const response = await axios.post('http://localhost:5000/api/posts',newPost)
      // console.log(newPost);
      // Limpe os campos do formulário
      const response = await addDoc(collection(db, "posts" ), newPost);
      await updateDoc(doc(db, "posts", response.id), 
    
        {
          id: response.id,
          updated_at: new Date(),
         
        }
      );
    setTitle('');
    setDescription('');
    setImage('');
    return console.log('post criado com sucesso',response.id);
    } catch (error) {
      console.log('Erro ao criar o post:', error);
    }
    
    

    
  };

  const handleFilter = async () => {
    // try {
    //   const response = await axios.get('http://localhost:5000/api/users');
    //   console.log(response.data);
    //   setUsersRegistered(response.data);
    // } catch (error) {
    //   console.log('Erro ao buscar os usuários:', error);
    // }
  }

  return (
    <div className=" col-span-10 row-span-1 row-start-6 col-start-1 bg-white rounded-lg shadow-md  text-center p-4 overflow-auto max-[900px]:p-2 justify-center flex items-center ">
    {/* <h2 className="text-2xl font-extrabold mb-4">Novo Post</h2> */}
    <form onSubmit={handleSubmit} className="flex gap-4 max-[900px]:gap-2  w-full  ">
      <div className="flex-1 flex-col gap-4 flex max-[900px]:gap-2 ">

      <div className="flex gap-4 max-[900px]:gap-2">
        {/* <label htmlFor="title" className="block text-gray-600 text-left">Título:</label> */}
        <input
        placeholder='Título'
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-sm focus:outline-none focus:ring focus:ring-purple-900 text-gray-900"
        />
        {/* <label htmlFor="image" className="block text-gray-600 text-left">Imagem (URL):</label> */}
        <input
          placeholder='Imagem (URL)'
          type="text"
          id="image"
          value={image}
          onChange={(e) => setImage(e.target.value )}
          className="w-full  border rounded-sm focus:outline-none focus:ring focus:ring-purple-900 text-gray-900"
        />
      </div>
     
      <div className=" ">
        {/* <label htmlFor="description" className="block text-gray-600 text-left">Descrição:</label> */}
        <textarea
          placeholder='Descrição'
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          
          className="h-full w-full  border rounded-sm focus:outline-none focus:ring focus:ring-purple-900 text-gray-900"
        ></textarea>
      </div>
      
      </div>
      <button
        type="submit"
        className="flex-1 max-w-fit px-4 py-10 min-h-fit m-0 bg-purple-900 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-900 self-center"
      >
        Postar
      </button>
    </form>
  
<div className=" max-[700px]:hidden w-full col-span-4 row-start-5  rounded-lg text-center p-4 overflow-auto max-[900px]:p-2 justify-center flex items-center  ">
{/* <h2 className="text-2xl font-extrabold mb-4">filtros</h2> */}
<form onSubmit={handleFilter} className="  flex flex-row gap-4 max-[900px]:gap-2  w-full ">
  <div className="flex flex-col gap-4 max-[900px]:gap-2 w-full justify-around ">
  <input
        placeholder='Buscar por nome:'
        type="text"
        id="name"
        value={nameSearch}
        onChange={(e) => setNameSearch(e.target.value)}
        className="w-full border rounded-sm focus:outline-none focus:ring focus:ring-purple-900 text-gray-900"
       />
      {/* <label htmlFor="image" className="block text-gray-600 text-left">Imagem (URL):</label> */}
      <input
        placeholder='Buscar por data:'
        type="date"
        id="date"
        value={dateFilter}
        onChange={(e) => setDateFilter(e.target.value)}
        className="w-full  border rounded-sm focus:outline-none focus:ring focus:ring-purple-900 text-gray-900"
        />
        </div>

    <button
        type="submit"
        className="flex-1 max-w-fit px-4 py-10 min-h-fit m-0 bg-purple-900 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-900 self-center"
      >
        Filtrar
      </button>

  </form>
</div>

</div>
  )
}

export default ActionBar