import React from "react";
import { useState,useEffect } from 'react';
import { HomeView } from "../interceptors/api";
import LoadingSpinner from "./LoadingSpinner";

export default function Profile (){
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState([]);
  const [password, setPassword] = useState('');
  const [username,setUsername] =useState('')
  const year = localStorage.getItem('year');

  useEffect(() => {
      const GetData = async () => {
        try {
          const data = await HomeView();
          setUser(data);
          console.log('user',user)
          setIsLoading(false);
        } catch (error) {
          console.log('Error:', error);
          setIsLoading(false);
        }
      };
      GetData();
  }, []);

      if (isLoading) {
        return (
          <LoadingSpinner />
        );
      }
    return(
<div className="mx-5 px-5 py-12 sm:px-6 lg:px-8 ">
{/* {user.map(item => 
{ return( */}
        <form className="w-full max-w-xxl space-y-8 shadow-md px-5 p-8 border border-gray-500">
            <h1 className="text-xxl text-gray-600 md:text-xl">Information Personnel</h1>
            <h2 className=" text-xxl text-gray-600 md:text-xl ">Modifier Le Mot de pass</h2>
            <h3 className="text-xl text-gray-700 ">Voter Mot de pass doit étre sécuriser</h3>
            <div className="-space-y-px rounded-md ">
                  <input
                    id="email-address"
                    name="username"
                    type="text"
                    value={username}
                    placeholder="Nouveaux Mot de pass"
                    autoComplete="login"
                    required
                    className="relative block lg:w-1/2 w-5/6 rounded-t-md border-0 p-1.5 my-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:outline-none focus:shadow-xl focus:ring-gray-500 sm:text-sm sm:leading-6"
                    onChange={e => setUsername(e.target.value)}
                    />
                </div>
                <div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password} 
                    placeholder="Confirmer Mot de passe"
                    autoComplete="current-password"
                    required
                    className="relative block lg:w-1/2 w-5/6 rounded-b-md border-0 p-1.5 my-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:z-10 focus:ring-2 focus:ring-inset focus:outline-none focus:shadow-xl focus:ring-gray-500 sm:text-sm sm:leading-6 "
                    onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <input 
                type="submit" 
                value="valider"
                className="mt-2 px-5 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                />
                </form>
                {/* )
})} */}


        </div>


    );


}