
import React from 'react'
import { TbMessageShare } from 'react-icons/tb';
import {TfiComments} from 'react-icons/tfi';
import {AiFillHeart,AiOutlineHeart} from 'react-icons/ai';
import { updateDoc,doc,query,collection, onSnapshot,getDoc, where, limit} from 'firebase/firestore';
import {db} from '../firebase';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import {HiLockClosed} from 'react-icons/hi';
import { BiExpand, BiGame } from 'react-icons/bi';
const Timeline = (props) => {
    const [user ,setUser] = useState({
      
    })
    const getUser = async () =>{
      const user = await getDoc(doc(db, "users", JSON.parse(localStorage.getItem('user_id'))));
      console.log(user.data());
      
      setUser(user.data());
    }
    useEffect(() => {
      getUser()
    },[])
    const [posts, setPosts] = useState([]);
    const router = useRouter();

    const handleLike = async (post) => {
        if(post.likes.filter(like => like.id === JSON.parse(localStorage.getItem('user_id'))).length > 0) {
          const likesAfter = post.likes.filter(like => like.id !== JSON.parse(localStorage.getItem('user_id')));
          
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
             id: JSON.parse(localStorage.getItem('user_id')),
             date: new Date(),
           },
           
         ],
        })
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
        toggleIframe();
      }, [])

      function toggleFullscreen(e) {
        if (!document.fullscreenElement) {
          e.requestFullscreen().catch(err => {
            console.error(`Erro ao tentar entrar em modo de tela cheia: ${err.message}`);
          });
        } else {
          document.exitFullscreen();
        }
      }
      
      const iframe = document.getElementById('fullscreenIframe');

      const setFullscreen = () => {
        toggleFullscreen(iframe)
      }

      function toggleIframe() {
        const minigame = document.getElementById('miniGame');
        minigame.style.display = (minigame.style.display === 'none' || minigame.style.display === '') ? 'flex' : 'none';
        const expandbutton = document.getElementById('expandbutton');
        expandbutton.style.visibility = (minigame.style.display === 'none' || minigame.style.display === '') ? 'hidden' : 'visible';
      }

  return (
    <div className="col-span-10 row-span-5 col-start-1 row-start-1 rounded-lg text-center overflow-auto">
      <div className="text-2xl  mb-4 flex flex-1 items-center justify-between">
        <TbMessageShare className='text-[40px] text-purple-800 mx-4'/><h2 className="text-white">{props.level ? `Área restrita` : 'Lobby'}</h2><div><button id='expandbutton'  onClick={setFullscreen} className="bg-purple-800 text-white p-2 rounded-lg"><BiExpand className='text-[40px] text-white mx-4'/></button>
        {user && user.level === 1 && <button onClick={toggleIframe} className="bg-purple-800 text-white p-2 rounded-lg"><BiGame className='text-[40px]  mx-4'/></button>}
          </div></div>
      {/* <p>aqui vai o conteudo aberto</p> */}
      
      <div className=' flex flex-col gap-4 items-center'>


      <div id='miniGame'  className="flex flex-row gap-4 items-center min-w-full"> 
      <div   className='bg-white w-full h-[550px] rounded-lg'>

      </div>
      <iframe  id="fullscreenIframe" src="https://www.webliero.com/?v=20&c=Vm9u3vi0MLI" className="min-w-[960px] h-[550px] rounded-lg  scale-120 origin-top top-0"></iframe>

      </div>
     
      
      {posts.length > 0 && posts.sort((a, b) => {
  const timeA = a.created_at.seconds * 1000 + a.created_at.nanoseconds / 1e6;
  const timeB = b.created_at.seconds * 1000 + b.created_at.nanoseconds / 1e6;

  // Ajuste a ordem da subtração se desejar ordenar de outra forma
  return timeB - timeA;
}).map((post)=>{
       
        // if (post.level > props.level) {
        if (post.level !== props.level) { 

          return null;
        }
        
        return (
          <div key={post.id} className="bg-gray-100 rounded-lg hover:scale-105 hover:transition-all hover:duration-10 shadow-md p-4 flex flex-col justify-between cursor-pointer mx-4 w-[95%] max-h-[600px]">
                {post.created_at !== null && <span className="text-gray-800 text-center text-sm font-extralight  mx-4 mt-0">{format(post.created_at.toDate(), "EEEE, d 'de' MMMM - HH:mm (zzzz)", {
                locale: ptBR, // Você também precisa importar a localização desejada, como 'pt-BR'
              })}</span>}
            <div  onClick={() => router.push(`/postview/${post.id}`)} className='flex flex-row justify-between '>
            <div className='flex flex-col  max-[900px]:w-full  '> 
              <div className="flex justify-center items-center ml-4 max-[900px]:justify-between">
              <img
                    src={post.createdBy.imageURL}
                    alt={post.createdBy.name}
                    className="w-16 h-16 rounded-full"
                  />
                    
                  
                <div className='flex flex-col ml-4 max-[900px]:w-full max-[900px]:items-center'>
                <h2 className='text-3xl font-extrabold  text-left capitalize max-[900px]:text-xl'>{post.title}</h2>
                  <p className=" text-sm text-left">{post.createdBy.name}</p>
                
                </div>
                
              </div>
              
              </div>
                {/* <h2 className='text-3xl font-extrabold  text-left capitalize '>{post.title}</h2> */}
          
            </div>
            <div  onClick={() => router.push(`/postview/${post.id}`)} className='max-[900px]:h-full flex flex-row gap-4 overflow-x-hidden max-[900px]:flex-col my-4'>
            <img
                src={post.image}
                alt={" "}
                className="rounded object-cover  min-w-[40%] w-[40%] min-h-[100%] max-[900px]:h-full max-[900px]:w-full "
              />
            <span className="text-gray-800 text-start text-md font-extralight  h-[50%] break-all max-[900px]:w-full overflow-x-hidden overflow-y-auto">{post.description}</span>
            </div>
            <div className='flex flex-row justify-end gap-4 mx-4 max-[900px]:justify-center'> 

            <p  onClick={() => router.push(`/postview/${post.id}`)} className="text-purple-800 text-bold hover:scale-150 flex gap-4"><TfiComments  className='scale-150' /><p className='text-slate-900 text-xl'>{post.comments.length}</p></p>
            <p onClick={() => localStorage.getItem('user_id') !== post.createdBy.id && handleLike(post)} className=" cursor-pointer text-red-400 text-bold hover:scale-150 flex gap-4">{post.likes.filter((like)=>like.id === localStorage.getItem('user_id')).length > 0 ? <AiFillHeart className='scale-150'/> : post.likes.length !== 0 ? <AiFillHeart  className='scale-150'/> : <AiOutlineHeart  className='scale-150'/>}<p className='text-slate-900 text-xl'>{post.likes.length}</p></p>
            {post.level === 1 && <p className="cursor-pointer text-yellow-400 text-bold hover:scale-150 flex gap-4"><HiLockClosed className='scale-150' /><p className='text-slate-900 text-xl'>Secreto</p></p> }
            </div>
            

          </div>
        )
      })}

      </div>
    </div>
  )
}

export default Timeline