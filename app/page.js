import Link from 'next/link';
import { FiLogIn } from 'react-icons/fi';
import { TfiComments } from 'react-icons/tfi'

export default function Home() {



  return (
   


      <div className="flex-1 items-center justify-between flex flex-row max-[1200px]:flex-col gap-10 h-screen bg-slate-900 min-h-screen ">
        <div className="flex-1/2 flex flex-row items-center justify-center bg-white rounded-md p-4 h-screen max-[1200px]:h-[300px] my-auto w-[50%] max-[1200px]:w-full">
        <div>
        <h1 className="text-6xl font-extrabold text-slate-800"><p className="text-purple-800">Capyba</p>quígrafo</h1>
        
        <p className="mt-4 text-lg text-gray-600 text-center">Seja bem-vindo</p>
        </div>
        <TfiComments className='text-[100px] text-purple-800 m-4 drop-shadow-lg'/>
        
        </div>
        <div className="flex justify-center items-center w-[50%] ">
        <Link href="/login"  className={` flex items-center justify-center gap-2 text-2xl  text-gray-300 hover:text-purple-800`}>
                <FiLogIn className='text-[40px]  my-4 flex items-center justify-center' /><h3 className='text-white font-extrabold text-xl'>Login</h3>
        </Link>
        </div>
        {/* <img
          src="https://www.pngall.com/wp-content/uploads/13/Capybara-PNG-Image.png"
          alt=" "
          className='w-[500px] h-[500px] absolute bottom-0 ml-[35%] scale-x-[-1] max-[1200px]:w-[200px] max-[1200px]:h-[200px] max-[1200px]:ml-[35%] max-[1200px]:scale-x-[1] max-[1200px]:right-0 '
        /> */}
      </div>

        
      
   
  );
}
