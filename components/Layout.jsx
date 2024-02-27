import { global } from "styled-jsx/css";
import { useSession, signIn, signOut } from "next-auth/react"
import Nav from "@/components/Nav";
import { useState } from "react";
import Logo from "./Logo";
import IconForest from "./Icons/IconForest";
import IconYandex from "./Icons/IconYandex";
  
export default function Layout({children}) {
  const [showNav, setShowNav] = useState(false);
  const { data: session } = useSession();
  if(!session) {
    return (
      <div className='bg-gray-200 w-screen h-screen flex items-center'>
        <div className="text-center w-full flex justify-center items-center">

          <div className="bg-white rounded-xl p-5 m-8 justify-center items-center">

            <div className="rounded-full bg-gray-100 w-28 h-28 mx-auto mb-2 "> 
              < IconForest />
            </div>
            <div className="mb-10 text-lg font-bold "> 
              ПИЛОРАМА 
            </div>

            <button onClick={() => signIn('yandex')} className="bg-gray-100 p-2 px-4 rounded-lg flex mb-4 w-full">
              < IconYandex /> 
              <div className="">
                Авторизироваться
              </div> 
            </button>

            <a href="/" className="underline text-gray-500">
              Регистрация
            </a>
          </div>


        </div>
      </div> 
    )
  }


  return (

    <div className="bg-bgGray min-h-screen ">
      <div className="block md:hidden flex items-center p-4">
        <button onClick={() => setShowNav(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="flex grow justify-center mr-6">
          <Logo />
        </div>
      </div>
      <div className="flex">
          <Nav show={showNav} />
          <div className=" flex-grow p-4">
              {children}
          </div>
      </div>
    </div>


  )
}
