"use client";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { TbMessageShare } from 'react-icons/tb';
import { SyncLoader } from 'react-spinners';
import { usePathname } from 'next/navigation';
import { getDoc, query, querySnapshot,collection, getDocs,onSnapshot } from 'firebase/firestore';
import {db} from '../../../firebase';
import { addDoc ,updateDoc,doc} from 'firebase/firestore';

  

export default function Postview({ params }) {

  const router = useRouter();
  
  const [isEmailVerified, setEmailVerified] = useState(true);
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

  const getUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      console.log(response.data);
      setUsersRegistered(response.data);
    } catch (error) {
      console.log('Erro ao buscar os usuários:', error);
    }
  };

  // Função para definir a ordem de classificação
const compareUsers = (userA, userB) => {
  // Priorize usuários logados (active) primeiro
  if (userA.status === 'active' && userB.status !== 'active') {
    return -1;
  } else if (userA.status !== 'active' && userB.status === 'active') {
    return 1;
  }

  // Se ambos estiverem no mesmo estado, ordene por ordem alfabética do nome
  const nameComparison = userA.name.localeCompare(userB.name);

  if (nameComparison !== 0) {
    return nameComparison;
  }

  // Se ambos estiverem no mesmo estado e tiverem o mesmo nome, ordene por nível de autorização (status)
  const authorizationComparison = userB.authorizationLevel - userA.authorizationLevel;

  return authorizationComparison;
};

  // useEffect(() => {
  //   usersRegistred.map((user) => {
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
 
  // const verifyEmail = async () => {
  //   // Lógica para verificar o email do usuário
  //   // Atualize o estado 'isEmailVerified' com o resultado da verificação
  //   try {
  //     const response = await axios.get(`http://localhost:5000/api/verify-email/${localStorage.getItem('authToken')}`);
  //     console.log( 'resposta de verificação',response.data);
  //     setEmailVerified(response.data.success);

  //     setVerificationCompleted(true);
  //   } catch (error) {
  //     console.log(' erro na verificação', error.response.data.message);
  //     setEmailVerified(false);
  //     setVerificationCompleted(true);
  //   }
   
    
   

  // };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verifique se todos os campos obrigatórios estão preenchidos
    if (!title || !description) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const userData = JSON.parse(localStorage.getItem('user'));

// Crie um novo objeto sem a propriedade 'password'
const { password, ...userWithoutPassword } = userData;

    // Crie um objeto com os dados do novo post
    const newPost = {
      title,
      description,
      image,
      createdBy: userWithoutPassword, // Substitua pelo nome do usuário real
      
    };

    try {
      // Chame a função de callback para enviar o novo post para o servidor
      const response = await axios.post('http://localhost:5000/api/posts',newPost)
      console.log(newPost);
      // Limpe os campos do formulário
    setTitle('');
    setDescription('');
    setImage('');
    return console.log(response.data);
    } catch (error) {
      console.log('Erro ao criar o post:', error.response.data.message);
    }
    
    

    
  };


  // useEffect(() => {
  //   if (!verificationCompleted) {
  //   verifyEmail();
  //   }
  // },[verificationCompleted])
 
  // useEffect(() => {
  //   setIsLoggedIn(localStorage.getItem('user') !== null ? true : false)
  // },[])

  if (isLoggedIn === true && !isEmailVerified) {
    return (

      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-gray-800">
         
        <div className="max-w-md p-4 bg-white rounded-lg shadow-md text-center ">
          <h2 className="text-2xl font-extrabold mb-4 flex items-center justify-center"><TbMessageShare className='text-[40px] text-purple-800 mx-4'/>Seu email ainda não foi verificado.</h2>
          <p>Por favor, verifique seu email para acessar a seção aberta.</p>
        </div>
      </div>
    );
  }

  if(isLoggedIn === false && !isEmailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-gray-800">
        <div className="max-w-md p-4 bg-white rounded-lg shadow-md text-center ">
          <h2 className="text-2xl font-extrabold mb-4 flex items-center justify-center"><TbMessageShare className='text-[40px] text-purple-800 mx-4'/>Usuario Nao Logado </h2>
          
          <p>Voce nao esta Logado.</p><SyncLoader color="purple" className="mt-4"/>
        </div>
        
      </div>
    );
  }

  

  return (
    <div className="bg-slate-900 text-gray-800 grid grid-cols-5 grid-rows-5 gap-4 h-[100vh] p-4 ">
    
    <div className="col-span-4 row-span-5   rounded-lg text-center overflow-auto">
      <div className="text-2xl font-extrabold mb-4 flex flex-1 items-center justify-center">
        <TbMessageShare className='text-[40px] text-purple-800 mx-4'/><h2 className="text-white">Post: {params.post}</h2></div>
      {/* <p>aqui vai o conteudo aberto</p> */}
      <div className=' flex flex-col items-start'>

      
      {posts.filter((post) => post.id === params.post).map((post)=>{
        console.log(post)
        return (
          <div key={post._id} className='flex flex-row justify-between'>
          <div className="bg-gray-100 rounded-lg  shadow-md p-4 flex flex-col justify-between cursor-pointer w-[full] max-h-[710px] mb-4" onClick={() => router.push(`/openview/${post.title}`)}>
            <div className='flex flex-row justify-between'>
                <h2 className='text-6xl font-extrabold  text-left  '>{post.title}</h2>
            <div className='flex flex-col'> 
              <div className="flex justify-end items-center pt-0 relative top-4 right-4">
                <div>
                  <p className="font-bold text-xl">{post.createdBy.name}</p>
                
                </div>
                <img
                  src={post.createdBy.imageURL}
                  alt={post.createdBy.name}
                  className="w-10 h-10 rounded-full mx-2"
                />
                
              </div>
              <span className="text-gray-800 text-end text-sm font-extralight  mx-4 mt-4">{new Date(post.updatedAt).toLocaleString()}</span>
              </div>
            </div>
            <img
                src={post.image}
                alt={" "}
                className="rounded object-cover  w-[100%] h-[100%] bottom-20 opacity-40 z-10"
              />
              <span className="text-gray-800 text-start text-[30px] mx-4 bottom-10 z-10">{post.description}</span>
              {post.comments !== undefined && post.comments.map((comment) => {
                return (
                  <div>
                    <p className="text-gray-800 text-start text-[20px] mx-4 bottom-10 z-10">{comment.content}</p>
                  </div>
                )
              })}
              <div className='flex flex-row justify-between'> 

              {post.comments!==undefined && post.comments.length > 0 && <span> comentatrios: {post.comments.length}</span>}
              {post.likes!==undefined && post.likes.length > 0 && <span>likes: {post.likes.length}</span>}
              

              </div>
            

          </div>

          <div className="flex flex-col gap-4 mx-4">
          {posts.filter((post) => post.id !== params.post).map((post)=>{
        return (
          <div key={post._id} className="bg-gray-100 rounded-lg hover:scale-105 hover:transition-all hover:duration-10 shadow-md  p-4 flex flex-col justify-center items-center cursor-pointer max-w-64 max-h-64" onClick={() => router.push(`/openview/${post.id}`)}>
            <div className="flex">
                

              
                
                
              </div>
              <h2 className='text-xl font-extrabold  text-left  '></h2>
            <img
                src={post.image}
                alt={" "}
                className="rounded object-cover opacity-40  w-64 h-64 hover:transition-all hover:duration-300 z-20"
              />
             
            
             <div>
                  <p className="font-bold">{post.createdBy.name} - {post.title}</p>
                  <span className="text-gray-800 text-end text-xs font-extralight  mx-4 mt-3">{new Date(post.updatedAt).toLocaleString()}</span>
                </div>
             
      
                {post.comments!==undefined && post.comments.length > 0 && <span> comentatrios: {post.comments.length}</span>}
                {post.likes!==undefined && post.likes.length > 0 && <span>likes: {post.likes.length}</span>}
      
      

            

            

          </div>
        )
      }).reverse()}
            </div>
            </div>
        )
      }).reverse()}

      



      </div>


<div className="bg-white rounded-lg shadow-md text-center p-4 overflow-auto ">
        {/* <h2 className="text-2xl font-extrabold mb-4">Novo Post</h2> */}
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="flex-1 flex-row gap-4 flex ">

            
            <img
              src={JSON.parse(localStorage.getItem('user')).imageURL}
              alt="Imagem"
              className="w-32 h-32 rounded-full object-cover"
            />
            {/* <h3 className="text-2xl font-extrabold  flex flex-1 items-center justify-start">{JSON.parse(localStorage.getItem('user')).name}</h3> */}
            
            <textarea
              placeholder='Comentário'
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full border rounded-sm focus:outline-none focus:ring focus:ring-purple-900 text-gray-900"
            ></textarea>
     
         
          
          
          </div>
          <button
            type="submit"
            className="w-60 h-[10vh] min-h-fit m-2 bg-purple-900 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-900 self-center"
          >
            Comentar
          </button>
        </form>
      
    </div>
    </div>
    

    
    <div className="row-span-5 col-start-5 bg-white rounded-lg shadow-md text-center h-full  overflow-auto">
    <h2 className="text-2xl font-extrabold mb-4 ">Usuários</h2>
    {/* <p>aqui é a lista de usuarios</p> */}
    {usersRegistred.sort(compareUsers).map((user) => (

<div key={user.email} className={`flex px-0 mb-4 mx-4 ${user.status === 'active' ? 'bg-white ' : 'bg-gray-300 opacity-40'} hover:bg-purple-300 rounded-lg overflow-hidden shadow-md ${user.status === 'active' ? 'cursor-pointer' : 'cursor-not-allowed'} `} onClick={user.status === 'active' ? () => router.push(`/openview/${user.email}`) : null} >
  <div className="w-2/3  text-end">
    <h2 className="text-xl font-bold mb-0">{user.name}</h2>
    <p className="text-gray-600 mb-0 text-sm">{user.email}</p>
    <p className={`text-xs font-semibold ${user.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
      {user.status === 'active' ? 'Logado' : 'Desconectado'}
    </p>
  </div>
  <img src={user.imageURL} alt={user.name} className={`w-[70px] h-[70px] mx-auto ${user.status === 'active' ? 'opacity-100 ' : 'opacity-30 grayscale-100'} `} />
</div>

    ))}

    </div>
  
  </div>
  );
}
