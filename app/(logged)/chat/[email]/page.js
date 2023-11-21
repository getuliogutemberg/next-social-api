"use client"
import React,{useState, useEffect} from 'react'
import { collection, addDoc, query, orderBy, onSnapshot, getDocs, doc, getDoc,where, limit, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';


const Pvp = ({params}) => {


  
  const email  = params.email ? decodeURIComponent(params.email) :''
  
  const [mensagens, setMensagens] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [usuarioAtual, setUsuarioAtual] = useState({});
  const [usuarioDestino, setUsuarioDestino] = useState({});
  
  const userId = JSON.parse(localStorage.getItem("user_id"));
  const verificarEConfigurarChat = async () => {
    if (usuarioAtual.email !== undefined && usuarioDestino.email !== undefined ) {
      // Construa o nome do chat com os objetos de usuário
      const chatName = `${encodeURIComponent(usuarioAtual.name)}_${encodeURIComponent(usuarioDestino.name)}`;
  
      try {
        // Consulta para encontrar o chat com o nome desejado
        const q = query(collection(db, 'chats'), where('nome', '==', chatName));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {

          // Se houver resultados, obtenha o primeiro documento (assumindo que há apenas um)
            
          setMensagens(querySnapshot.docs[0].data().messages)
          console.log(querySnapshot.docs[0].data().messages);

          setMensagem('');
        } 
      } catch (error) {
        console.log('Erro ao procurar ou criar o chat:', error);
      }
    } else {
      console.log('nenhum chat encontrado');
    }
  };

  useEffect(() => {
    verificarEConfigurarChat();
  },[usuarioAtual, usuarioDestino, mensagem]);
  
  useEffect(() => {
    // const carregarMensagens = async () => {
    //   if (usuarioAtual.name !== undefined && usuarioDestino.name !== undefined && mensagem.trim() !== '') {
    //     const chatRef = collection(db, 'chats', `${encodeURIComponent(usuarioAtual.name)}_${encodeURIComponent(usuarioDestino.name)}`);
    //     const q = query(chatRef, orderBy('timestamp'));

    //     const unsubscribe = onSnapshot(q, (snapshot) => {
    //       const mensagensDoChat = [];
    //       snapshot.forEach((doc) => {
    //         mensagensDoChat.push(doc.data().mensagem);
    //       });
    //       setMensagens(mensagensDoChat);
    //     });

    //     return () => unsubscribe();
    //   }
    // };

    const obterInformacoesUsuarios = async () => {
      if (userId && email) {
        // Obter informações do usuário atual
        const usuarioAtualDoc = doc(db, 'users', userId);
        const usuarioAtualSnapshot = await getDoc(usuarioAtualDoc);
        setUsuarioAtual(usuarioAtualSnapshot.data());
        console.log('usuario atual', usuarioAtualSnapshot.data());

        const usersQuery = query(collection(db, "users"), where("email", "==", email), limit(1));

    // Obtém a coleção de documentos
    const querySnapshot = await getDocs(usersQuery);
    const userDestino = querySnapshot.docs[0];
       
        setUsuarioDestino(userDestino.data());
        console.log('usuario destino', userDestino.data());
      }
    };

    

    obterInformacoesUsuarios();
   
  }, [usuarioAtual.name, usuarioDestino.name]);

  const enviarMensagem = async () => {
    if (usuarioAtual.email !== undefined && usuarioDestino.email !== undefined) {
      // Construa o nome do chat com os objetos de usuário
      const chatName = `${encodeURIComponent(usuarioAtual.name)}_${encodeURIComponent(usuarioDestino.name)}`;
  
      try {
        // Consulta para encontrar o chat com o nome desejado
        const q = query(collection(db, 'chats'), where('nome', '==', chatName));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          // Se houver resultados, obtenha o primeiro documento (assumindo que há apenas um)
          const chatId = querySnapshot.docs[0].id;
  
          await updateDoc(doc(db, 'chats', chatId), {
            messages: [
              ...querySnapshot.docs[0].data().messages,
              {
                user: encodeURIComponent(usuarioAtual.name),
                mensagem: mensagem,
                timestamp: new Date(),
              },
            ],
            lastMessage: mensagem,
            timestamp: new Date(),
            type: 'pvp',
            users: [
              `${encodeURIComponent(usuarioAtual.name)}`,
              `${encodeURIComponent(usuarioDestino.name)}`,
            ],
          });
  
          // Atualize o estado com os dados mais recentes do Firestore
          const updatedChat = await getDoc(doc(db, 'chats', chatId));
          setMensagens(updatedChat.data().messages);
  
          setMensagem('');
        } else {
          // Crie um novo chat na coleção
          const novoChatRef = await addDoc(collection(db, 'chats'), {
            nome: chatName,
            // Adicione outros campos relevantes para o novo chat, se necessário
          });
  
          const novoChatId = novoChatRef.id;
          await updateDoc(doc(db, 'chats', novoChatId), {
            chatId: novoChatId,
            messages: [
              {
                user: encodeURIComponent(usuarioAtual.name),
                mensagem: mensagem,
                timestamp: new Date(),
              },
            ],
            lastMessage: mensagem,
            timestamp: new Date(),
            type: 'pvp',
            users: [
              `${encodeURIComponent(usuarioAtual.name)}`,
              `${encodeURIComponent(usuarioDestino.name)}`,
            ],
          });
  
          // Atualize o estado com os dados mais recentes do Firestore
          const updatedChat = await getDoc(doc(db, 'chats', novoChatId));
          setMensagens(updatedChat.data().messages);
  
          setMensagem('');
        }
      } catch (error) {
        console.log('Erro ao procurar ou criar o chat:', error);
      }
    }
  };

  return (
    <div>
      <h1>Chat entre {usuarioAtual.name} e {usuarioDestino.name}</h1>

      {/* Renderize as mensagens do chat */}
      <div>
        {mensagens!== undefined && mensagens.map((mensagem) => (
          <div key={mensagem}>{mensagem.user}:{mensagem.mensagem}</div>
        ))}
      </div>

      {/* Componente de entrada de mensagem */}
      <div>
        <input
          type="text"
          className='text-black'
          placeholder="Digite sua mensagem..."
          onChange={(e) => setMensagem(e.target.value)}
        />
        <button onClick={() => enviarMensagem(mensagem)}>Enviar</button>
      </div>
    </div>
  );
}

export default Pvp