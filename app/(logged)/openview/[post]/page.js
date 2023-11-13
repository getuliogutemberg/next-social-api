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
import {TfiComments} from 'react-icons/tfi';
import {AiFillHeart} from 'react-icons/ai';
  import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

  useEffect(() => {
    posts.filter((post) => post.id === params.post).map((post) => {
      setPost(post);
    }
    )
  }, [posts]);

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

  const [post, setPost] = useState({
    title: '',
    description: '',
    image: '',
    permission: '',
    level: 0
  });

  return (
    <div className="bg-slate-900 text-gray-800 grid grid-cols-5 grid-rows-5 gap-4 h-[100vh] p-4 ">
    
    <div className="col-span-4 row-span-5   rounded-lg text-center overflow-auto max-h-[100vh]">
      
      <div className="text-2xl  mb-4 flex flex-1 items-center justify-start">
        <TbMessageShare className='text-[40px] text-purple-800 mx-4'/><h2 className="text-white">   {post.level ? <span className='text-red-400'>Privado</span> : <span className='text-white'>Público</span>}</h2></div>
      {/* <p>aqui vai o conteudo aberto</p> */}
      <div className=' flex flex-col items-start '>

      
      {posts.filter((post) => post.id === params.post).map((post)=>{
        // console.log(post)
        
        return (
          <div key={post._id} className={`flex flex-row justify-between h-[77.6vh] gap-4 w-[100%] ${posts.filter((post) => post.id !== params.post) === undefined ? 'mx-[10%]' : ' '}`}>
          <div className="bg-gray-100 rounded-lg  shadow-md p-4 flex flex-col justify-between  w-[100%] max-h-[710px] mb-4" >
            <div className='flex flex-row justify-between'>
                <h2 className='text-3xl font-extrabold  text-left  capitalize'>{post.title}</h2>
            
            </div>
            <img
                src={post.image}
                alt={" "}
                className="rounded object-contain  w-[100%] h-[60%]  "
              />
              <span className="text-gray-800 text-start text-md font-light">{post.description}</span>
              {post.comments !== undefined && post.comments.map((comment) => {
                return (
                  <div>
                    <p className="text-gray-800 text-start text-[20px] mx-4 bottom-10 z-10">{comment.content}</p>
                  </div>
                )
              })}
              <span className="text-gray-800 text-center text-sm font-extralight">{format(post.created_at.toDate(), "EEEE, d 'de' MMMM - HH:mm (zzzz)", {
                locale: ptBR, // Você também precisa importar a localização desejada, como 'pt-BR'
              })}</span>
              <div className='flex flex-col'> 
              <div className="flex justify-end items-center gap-4 ">
                <div>
                  <p className="font-extralight text-md">{post.createdBy.name}</p>
                
                </div>
                <img
                  src={post.createdBy.imageURL}
                  alt={post.createdBy.name}
                  className="w-10 h-10 rounded-full  scale-[-1] rotate-180
                  "
                />
                
              </div>
              
              </div>
              <div className='flex flex-row justify-right gap-4'> 
              
              <span> comentatrios: {post.comments.length}</span>
             
              <span>likes: {post.likes.length}</span>
              {post.comments.map(()=>{
                return (
                  <div>
                    <p className="text-gray-800 text-start text-[20px] mx-4 bottom-10 z-10">{comment.content}</p>
                  </div>
                )
              })}

              </div>
            

          </div>

          {posts.filter((post) => post.id !== params.post) && <div className="flex flex-col gap-4   overflow-auto overflow-x-hidden rounded min-w-[300px] mb-4">
          {posts.filter((post) => post.id !== params.post).map((post)=>{
        return (
          <div key={post._id} className="bg-gray-100 rounded-lg hover:scale-105 hover:transition-all hover:duration-10 shadow-md  flex flex-col justify-center items-center cursor-pointer w-[300px] min-h-[300px]" onClick={() => router.push(`/openview/${post.id}`)}>
          
             
            <img
                src={post.image}
                alt={" "}
                className="rounded object-cover  w-[300px] h-[270px]  p-4   hover:transition-all hover:duration-300 "
              />
             
        
             
      <div className='flex flex-row gap-4'> 
             <p className="text-purple-800 text-bold hover:scale-150 flex gap-4"><TfiComments  className='scale-150' /><p className='text-slate-900 text-xl'>{post.comments.length}</p></p>
            <p  className="text-red-400 text-bold hover:scale-150 flex gap-4"><AiFillHeart  className='scale-150'/><p className='text-slate-900 text-xl'>{post.likes.length}</p></p>
            </div>
    
      

            

            

          </div>
        )
      }).reverse()}
            </div>}
            </div>
        )
      }).reverse()}

      



      </div>


      <div className="bg-white rounded-lg shadow-md text-center  overflow-auto  ">
        {/* <h2 className="text-2xl font-extrabold mb-4">Novo Post</h2> */}
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="flex-1 flex-row gap-4 flex ">

            
            <img
              src={JSON.parse(localStorage.getItem('user')).imageURL}
              alt="Imagem"
              className="w-32 h-32  object-cover scale-[-1] rotate-180"
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
