"use client";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { TbMessageShare } from 'react-icons/tb';
import { SyncLoader } from 'react-spinners';
 import { getDoc, query, querySnapshot,collection, getDocs,onSnapshot } from 'firebase/firestore';
 import {db} from '../../firebase';
 import { addDoc ,updateDoc,doc} from 'firebase/firestore';
import { FiLogIn } from 'react-icons/fi';
import {TfiComments} from 'react-icons/tfi';
import {AiFillHeart,AiOutlineHeart} from 'react-icons/ai';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
 
  

export default function Verified() {

  const router = useRouter();

  const [isEmailVerified, setEmailVerified] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState('carregando...');  // Adicionado estado para controle de autenticação
  const [verificationCompleted, setVerificationCompleted] = useState(true);

  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  
  const [usersRegistred, setUsersRegistered] = useState([]);
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    // try {
    //   const response = await axios.get('http://localhost:5000/api/posts');
    //   console.log(response.data.posts);
    //   setPosts(response.data.posts);
    // } catch (error) {
    //   console.log('Erro ao buscar os posts:', error);
    // }
  }
  

  const getUsers = async () => {
    // try {
    //   const response = await axios.get('http://localhost:5000/api/users');
    //   console.log(response.data);
    //   setUsersRegistered(response.data);
    // } catch (error) {
    //   console.log('Erro ao buscar os usuários:', error);
    // }
   
  };

  // Função para definir a ordem de classificação
  const compareUsers = (userA, userB) => {
    const loggedUserId = JSON.parse(localStorage.getItem('user')).id;
  
    // Verifica se o usuário logado é igual a userA ou userB
    const isUserALoggedIn = userA.id === loggedUserId;
    const isUserBLoggedIn = userB.id === loggedUserId;
  
    // Se userA for o usuário logado, ele deve ser o primeiro
    if (isUserALoggedIn) {
      return -1;
    }
    // Se userB for o usuário logado, ele deve ser o primeiro
    else if (isUserBLoggedIn) {
      return 1;
    }
  
    // Continua com a lógica original de priorização, ordem alfabética e nível de autorização
    if (userA.status === 'active' && userB.status !== 'active') {
      return -1;
    } else if (userA.status !== 'active' && userB.status === 'active') {
      return 1;
    }
  
    const nameComparison = userA.name.localeCompare(userB.name);
  
    if (nameComparison !== 0) {
      return nameComparison;
    }
  
    const authorizationComparison = userB.authorizationLevel - userA.authorizationLevel;
  
    return authorizationComparison;
  };

  // useEffect(() => {
  //   usersRegistred.map((user) => {
  //     console.log('user', user);
  //     if (JSON.parse(localStorage.getItem('user')) && user.email === JSON.parse(localStorage.getItem('user')).email && user.status === 'active') {
  //       return setIsLoggedIn(true);
  //     }
  //     setIsLoggedIn(false)

  //     router.push('/login');
      
      
  //   });
    
  // },[])

  // useEffect(() => {
  //   isLoggedIn === false && setTimeout(() => router.push('/login'),5000);
  // },[isLoggedIn])


  // useEffect(() => {
  //   getUsers()
  //   getPosts()
    
  // },[isLoggedIn])

  // lendo os usuarios registrados

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

      setPosts(posts);
    })
  }, [])

 
  const verifyEmail = async () => {
    // Lógica para verificar o email do usuário
    // Atualize o estado 'isEmailVerified' com o resultado da verificação
    try {
      const response = await axios.get(`http://localhost:5000/api/verify-email/${localStorage.getItem('authToken')}`);
      console.log( 'resposta de verificação',response.data);
      setEmailVerified(response.data.success);

      setVerificationCompleted(true);
    } catch (error) {
      console.log(' erro na verificação', error);
      setEmailVerified(true);
      setVerificationCompleted(true);
    }
   
    
   

  };


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
          level: 0
        };

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
      console.log('Erro ao criar o post:', error.response.data.message);
    }
    
    

    
  };


  useEffect(() => {
    if (!verificationCompleted) {
    verifyEmail();
    }
  },[verificationCompleted])
 
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('user') !== null ? true : false)
  },[])

  // if (isLoggedIn === true && !isEmailVerified) {
  //   return (

  //     <div className="min-h-screen flex items-center justify-center bg-slate-900 text-gray-800">
         
  //       <div className="max-w-md p-4 bg-white rounded-lg shadow-md text-center ">
  //         <h2 className="text-2xl font-extrabold mb-4 flex items-center justify-center"><TbMessageShare className='text-[40px] text-purple-800 mx-4'/>Seu email ainda não foi verificado.</h2>
  //         <p>Por favor, verifique seu email para acessar a seção aberta.</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if(isLoggedIn === false && !isEmailVerified) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-slate-900 text-gray-800">
  //       <div className="max-w-md p-4 bg-white rounded-lg shadow-md text-center ">
  //         <h2 className="text-2xl font-extrabold mb-4 flex items-center justify-center"><TbMessageShare className='text-[40px] text-purple-800 mx-4'/>Usuario Nao Logado </h2>
          
  //         <p>Voce nao esta Logado.</p><SyncLoader color="purple" className="mt-4"/>
  //       </div>
        
  //     </div>
  //   );
  // }


  const handleLike = async (post) => {
    if(post.likes.filter(like => like.id === JSON.parse(localStorage.getItem('user')).id).length > 0) {
      const likesAfter = post.likes.filter(like => like.id !== JSON.parse(localStorage.getItem('user')).id);
      
      await updateDoc(doc(db, "posts", post.id),
    {
     likes: [
       ...likesAfter,
     ],
    })
    return
    };

    await updateDoc(doc(db, "posts", post.id),
    {
     likes: [
       ...post.likes,
       {
         id: JSON.parse(localStorage.getItem('user')).id,
         date: new Date(),
       },
       
     ],
    })
  }

  return (
    <div className="bg-slate-900 text-gray-800 grid grid-cols-5 grid-rows-5 gap-4 h-[100vh] p-4 ">
    
    <div className="col-span-4 row-span-4   rounded-lg text-center overflow-auto">
      <div className="text-2xl  mb-4 flex flex-1 items-center justify-start">
        <TbMessageShare className='text-[40px] text-purple-800 mx-4'/><h2 className="text-white">Posts públicos</h2></div>
      {/* <p>aqui vai o conteudo aberto</p> */}
      <div className=' flex flex-col gap-4 items-center'>

      
      {posts.length > 0 && posts.sort((a, b) => {
  const timeA = a.created_at.seconds * 1000 + a.created_at.nanoseconds / 1e6;
  const timeB = b.created_at.seconds * 1000 + b.created_at.nanoseconds / 1e6;

  // Ajuste a ordem da subtração se desejar ordenar de outra forma
  return timeB - timeA;
}).map((post)=>{
        if (post.level > 0) {
          return null;
        }
        // console.log(posts);
        return (
          <div key={post.id} className="bg-gray-100 rounded-lg hover:scale-105 hover:transition-all hover:duration-10 shadow-md p-4 flex flex-col justify-between cursor-pointer mx-4 w-[95%] max-h-[600px]">
                {post.created_at !== null && <span className="text-gray-800 text-center text-sm font-extralight  mx-4 mt-0">{format(post.created_at.toDate(), "EEEE, d 'de' MMMM - HH:mm (zzzz)", {
                locale: ptBR, // Você também precisa importar a localização desejada, como 'pt-BR'
              })}</span>}
            <div  onClick={() => router.push(`/postview/${post.id}`)} className='flex flex-row justify-between'>
            <div className='flex flex-col'> 
              <div className="flex justify-center items-center ml-4">
                <img
                  src={post.createdBy.imageURL}
                  alt={post.createdBy.name}
                  className="w-16 h-16 rounded-full"
                />
                <div className='flex flex-col ml-4'>
                <h2 className='text-3xl font-extrabold  text-left capitalize '>{post.title}</h2>
                  <p className=" text-sm text-left">{post.createdBy.name}</p>
                
                </div>
                
              </div>
              
              </div>
                {/* <h2 className='text-3xl font-extrabold  text-left capitalize '>{post.title}</h2> */}
          
            </div>
            <div  onClick={() => router.push(`/postview/${post.id}`)} className='flex flex-row gap-4 overflow-x-hidden'>
            <img
                src={post.image}
                alt={" "}
                className="rounded object-cover  w-[40%] h-[50%] "
              />
            <span className="text-gray-800 text-start text-md font-extralight  max-w-[50%] h-[50%] break-all">{post.description}</span>
            </div>
            <div className='flex flex-row justify-end gap-4 mx-4'> 

            <p  onClick={() => router.push(`/postview/${post.id}`)} className="text-purple-800 text-bold hover:scale-150 flex gap-4"><TfiComments  className='scale-150' /><p className='text-slate-900 text-xl'>{post.comments.length}</p></p>
            <p onClick={() => JSON.parse(localStorage.getItem('user')).id !== post.createdBy.id && handleLike(post)} className=" cursor-pointer text-red-400 text-bold hover:scale-150 flex gap-4">{post.likes.filter((like)=>like.id === JSON.parse(localStorage.getItem('user')).id).length > 0 ? <AiFillHeart className='scale-150'/> : post.likes.length !== 0 ? <AiFillHeart  className='scale-150'/> : <AiOutlineHeart  className='scale-150'/>}<p className='text-slate-900 text-xl'>{post.likes.length}</p></p>
            
            </div>
            

          </div>
        )
      })}

      </div>
    </div>
    

    
    <div className="row-span-5 col-start-5 bg-white rounded-lg shadow-md text-center h-full  overflow-auto">
    <h2 className="text-2xl font-extrabold mb-4 ">Usuários</h2>
    {/* <p>aqui é a lista de usuarios</p> */}
    {usersRegistred.sort(compareUsers).map((user) => {
      console.log(user)
return (
      <div key={user.email} className={`flex px-0 mb-4 mx-4 ${user.status === 'active' ? 'bg-white ' : 'bg-gray-300 opacity-40'} hover:bg-purple-300 rounded-lg overflow-hidden shadow-md ${user.status === 'active' && JSON.parse(localStorage.getItem('user')).id !== user.id ? 'cursor-pointer' : 'cursor-not-allowed'} ${JSON.parse(localStorage.getItem('user')).id === user.id ? 'border-purple-500 border-2' : ''}`} onClick={user.status === 'active'&& JSON.parse(localStorage.getItem('user')).id !== user.id ? () => router.push(`/pvp/${user.email}`) : null} >
        <div className="w-2/3  text-end">
          <h2 className="text-xl font-bold mb-0">{user.name}</h2>
          <p className="text-gray-600 mb-0 text-sm">{user.email}</p>
          <p className={`text-xs font-semibold ${user.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
            {user.status === 'active' ? 'Logado' : 'Desconectado'}
          </p>
        </div>
        <img src={user.imageURL} alt={user.name} className={`w-[70px] h-[70px] mx-auto ${user.status === 'active' ? 'opacity-100 ' : 'opacity-30 grayscale-100'} `} />
      </div>)

    })}

    </div>
    

    
      <div className="col-span-4 row-start-5 bg-white rounded-lg shadow-md text-center p-4 overflow-auto ">
        {/* <h2 className="text-2xl font-extrabold mb-4">Novo Post</h2> */}
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="flex-1 flex-col gap-4 flex ">

          <div className="flex gap-4">
            {/* <label htmlFor="title" className="block text-gray-600 text-left">Título:</label> */}
            <input
            placeholder='Título'
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-[70%] border rounded-sm focus:outline-none focus:ring focus:ring-purple-900 text-gray-900"
            />
            {/* <label htmlFor="image" className="block text-gray-600 text-left">Imagem (URL):</label> */}
            <input
              placeholder='Imagem (URL)'
              type="text"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value )}
              className="w-[30%]  border rounded-sm focus:outline-none focus:ring focus:ring-purple-900 text-gray-900"
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
              rows="4"
              className="w-full border rounded-sm focus:outline-none focus:ring focus:ring-purple-900 text-gray-900"
            ></textarea>
          </div>
          
          </div>
          <button
            type="submit"
            className="w-60 h-[10vh] min-h-fit m-2 bg-purple-900 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-900 self-center"
          >
            Postar
          </button>
        </form>
      
    </div>

      
        
        
    

      


      
  </div>
  );
}
