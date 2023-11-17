"use client";
import { format } from 'date-fns';
import Link from 'next/link';
import {TfiComments} from 'react-icons/tfi';
import {AiFillHeart,AiOutlineHeart} from 'react-icons/ai';
import { ptBR } from 'date-fns/locale';
import {IoArrowBack} from 'react-icons/io5';
import {HiLockClosed} from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TbMessageShare } from 'react-icons/tb';
import { getDoc, query, querySnapshot,collection, getDocs,onSnapshot ,addDoc ,updateDoc,doc} from 'firebase/firestore';
import {db} from '../firebase';


const PostDetail = (props) => {

  const router = useRouter();

    const [posts, setPosts] = useState([]);
    const [comment, setComment] = useState('');
    const [postOpened, setPostOpened] = useState({
        title: '',
        description: '',
        image: '',
        permission: '',
        level: 0
      });

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
      const compararDatas = (a, b) => {
        const dataA = a.date.seconds * 1000 + a.date.nanoseconds / 1000000; // Convertendo para milissegundos
        const dataB = b.date.seconds * 1000 + b.date.nanoseconds / 1000000; // Convertendo para milissegundos
      
        if (dataA > dataB) {
          return -1; // Retorna -1 se a data de A for maior (mais atual)
        } else if (dataA < dataB) {
          return 1; // Retorna 1 se a data de B for maior (mais antigo)
        } else {
          return 0; // Retorna 0 se as datas forem iguais
        }
      };
      
      const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Verifique se todos os campos obrigatórios estão preenchidos
        if (!comment) {
          setErroComment({
            status: true,
            message: 'Por favor, preencha todos os campos obrigatórios.',
          })
          setTimeout(() => {
            setErroComment({
              status: false,
              message: '',
            })
          },3000);
          return;
        }
    
        try{
    
        
        await updateDoc(doc(db, "posts", props.params.post),
        {
         comments: [
           ...postOpened.comments,
           {
             comment: comment,
             user: JSON.parse(localStorage.getItem('user')),
             image: JSON.parse(localStorage.getItem('user')).imageURL,
             date: new Date(),
             likes: [{
    
             }] ,
             responses: [{
    
             }],
           }
           
         ],
         
         
         
        }
        );
        setComment('');
      } catch(error){
        console.log(error)
      }
      ;
    
        
      };

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
        posts.filter((post) => post.id === props.params.post).map((post) => {
          setPostOpened(post);
          props.setLevel(post.level);
        }
        )
      }, [posts]);
    


      

  return (
    <div className="col-span-10 row-span-6   rounded-lg text-center overflow-auto max-h-[100vh]">
      
      <div className="text-2xl  mb-4 flex flex-1 items-center justify-start">
        <Link href={postOpened.level ? '/secretview' : '/openview'} className="text-white"><IoArrowBack className="text-white"/></Link> <TbMessageShare className='text-[40px] text-purple-800 mx-4'/><h2 className="text-white">   {postOpened.level ? <span className='text-red-400'>Privado</span> : <span className='text-white'>Público</span>}</h2></div>
      {/* <p>aqui vai o conteudo aberto</p> */}

      <div className=' flex flex-col items-start '>

      
      {posts.filter((post) => post.id === props.params.post).map((post)=>{
        // console.log(post)
        
        return (
          <div key={post._id} className={`flex max-[900px]:flex-col flex-row justify-between h-[77.6vh] gap-4 w-[100%] ${posts.filter((post) => post.id !== props.params.post) === undefined ? 'mx-[10%]' : ' '}`}>
          <div className="bg-gray-100 rounded-lg  shadow-md p-4 flex flex-col justify-between  w-[100%]  mb-4 overflow-auto overflow-x-hidden " >
            <div className='flex flex-row justify-between'>
                <h2 className='text-3xl font-extrabold  text-left  capitalize'>{post.title}</h2>
                <div className='flex flex-row gap-4'> 
             <a href={"#comments"}><p className="text-purple-800 text-bold hover:scale-150 flex gap-4"><TfiComments  className='scale-150' /><p className='text-slate-900 text-xl'>{post.comments.length}</p></p></a>
            <p onClick={() => JSON.parse(localStorage.getItem('user')).id !== post.createdBy.id && handleLike(post)} className=" cursor-pointer text-red-400 text-bold hover:scale-150 flex gap-4">{post.likes.filter((like)=>like.id === JSON.parse(localStorage.getItem('user')).id).length > 0 ? <AiFillHeart className='scale-150'/> : post.likes.length !== 0 ? <AiFillHeart  className='scale-150'/> : <AiOutlineHeart  className='scale-150'/>}<p className='text-slate-900 text-xl'>{post.likes.length}</p></p>
            {postOpened.level === 1 && <p className="cursor-pointer text-yellow-400 text-bold hover:scale-150 flex gap-4"><HiLockClosed className='scale-150' /><p className='text-slate-900 text-xl'>Secreto</p></p> }
            </div>
            
            </div>
            <img
                src={post.image}
                alt={" "}
                className="rounded object-contain  w-full min-h-fit bg-red-400"
              />
              <span className="text-gray-800 text-start text-md font-light ">{post.description}</span>
              
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
              {/* <div className='flex flex-row justify-right gap-4'> 
              
              <span> comentatrios: {post.comments.length}</span>
             
              <span>likes: {post.likes.length}</span>
              
              
              </div> */}
              <div className="flex flex-col gap-4 rounded w-full mt-4" id='comments'>
              {post.comments.length > 0 && post.comments.sort(compararDatas).map((comment) => {
                console.log(post)
                return (
                  <div key={comment._id} className={`flex flex-row items-start gap-4  ${post.createdBy.id === comment.user.id ? 'justify-end' : 'justify-start'}`}>
                    {post.createdBy.id === comment.user.id  ? 
                    (
                      <div className="flex flex-col justify-center items-end gap-2">
                    <div className="flex flex-row justify-center items-center gap-2 ">
                      <div className='flex flex-row  '>
                    <p className="text-gray-800  text-start text-sm  bg-white rounded-lg rounded-tr-none p-2 italic capitalize">{comment.comment}</p>
                      <div className="border-[7px] border-r-transparent border-b-transparent border-white w-[7px] h-[7px]" />
                    </div>
                    <p className="font-extralight text-md">{comment.user.name}</p>
                        <img src={comment.image} alt="" className="w-10 h-10 rounded-full" />
                   
                    </div>
                    <span className="text-gray-800  text-xs font-extralight">{format(comment.date.toDate(), "HH:mm - d 'de' MMMM ", {
                      locale: ptBR, // Você também precisa importar a localização desejada, como 'pt-BR'
                    })}</span>
                    </div>) : (
                    <div className="flex flex-col justify-center items-start gap-2">
                    <div className="flex flex-row justify-center items-center gap-2">
                    <img src={comment.image} alt="" className="w-10 h-10 rounded-full" />
                    <p className="font-extralight text-md">{comment.user.name}</p>
                    <p className="text-gray-800 text-start text-sm  bg-white rounded p-2 italic capitalize ">{comment.comment}</p>
                   
                    </div>
                    <span className="text-gray-800   text-xs font-extralight">{format(comment.date.toDate(), "HH:mm - d 'de' MMMM ", {
                        locale: ptBR, // Você também precisa importar a localização desejada, como 'pt-BR'
                      })}</span>
                    </div>)}
                  
                  </div>
                )
              })}</div>

          </div>

          {posts.filter((post) => post.id !== props.params.post  ) && <div className="flex flex-col gap-4   overflow-auto overflow-x-hidden rounded min-w-[300px] mb-4 max-[900px]:hidden ">
          {posts.filter((post) => {
            return post.id !== props.params.post
          }).map((post)=>{
             if (postOpened.level !== post.level) {
              return null;
            }
        return (
          <div key={post.id} className="bg-gray-100 rounded-lg hover:scale-105 hover:transition-all hover:duration-10 shadow-md  flex flex-col justify-center items-center cursor-pointer w-[300px] min-h-[300px]" onClick={() => router.push(`/postview/${post.id}`)}>
          
             
            <img
                src={post.image}
                alt={" "}
                className="rounded object-cover  w-[300px] h-[270px]  p-4   hover:transition-all hover:duration-300 "
              />
             
        
             
      <div className='flex flex-row gap-4'> 
      <p className="text-purple-800 text-bold hover:scale-150 flex gap-4"><TfiComments  className='scale-150' /><p className='text-slate-900 text-xl'>{post.comments.length}</p></p>
            <p  className="text-red-400 text-bold hover:scale-150 flex gap-4 cursor-pointer">{post.likes.filter((like)=>like.id === JSON.parse(localStorage.getItem('user')).id).length > 0 ? <AiFillHeart className='scale-150'/> : post.likes.length !== 0 ? <AiFillHeart  className='scale-150'/> : <AiOutlineHeart  className='scale-150'/>}<p className='text-slate-900 text-xl'>{post.likes.length}</p></p>
            {post.level === 1 && <p className="cursor-pointer text-yellow-400 text-bold hover:scale-150 flex gap-4"><HiLockClosed className='scale-150' /></p> }

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
              className="w-[90px] h-[90px]  object-cover scale-[-1] rotate-180 m-4 max-[900px]:hidden"
            />
            {/* <h3 className="text-2xl font-extrabold  flex flex-1 items-center justify-start">{JSON.parse(localStorage.getItem('user')).name}</h3> */}
            
            <textarea
              placeholder='Escreva um comentario...'
              type="text"
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              
              className="w-full m-4 resize-none rounded-sm focus:outline-none focus:ring focus:ring-purple-900 text-gray-900"
            ></textarea>
     
         
          
          
          </div>
          <button
            type="submit"
            className="w-60 h-[10vh] max-[900px]:w-fit min-h-fit m-2 p-4 bg-purple-900 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-900 self-center"
          >
            Comentar
          </button>
        </form>
      
    </div>

    </div>
  )
}

export default PostDetail