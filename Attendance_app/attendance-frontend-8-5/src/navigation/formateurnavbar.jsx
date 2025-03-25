import { Fragment } from 'react'
import { Disclosure} from '@headlessui/react'
import { useState, useEffect } from 'react';
import { HomeView ,GetAnnee} from "../interceptors/api";

import ProfileMenu from  "./Pbutton";
import Anne from '../components/Anne';

export default function Navbar(){
    const [isAuth, setIsAuth] = useState(false);
    const [user, setUser] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState('');
    
    useEffect(() => {
      const selectedYearId = localStorage.getItem('year');
      if (selectedYearId) {
        setSelectedYear(selectedYearId);
      }
        const GetData = async () => {
          try {
            const data = await HomeView();
            setUser(data);
            const data2 = await GetAnnee();
            setIsLoading(false);
          } catch (error) {
            console.log('Error:', error);
            setIsLoading(false);
          }
        };
        GetData();
    }, []);

  useEffect(() => {
    if (localStorage.getItem('access_token') !== null) {
      setIsAuth(true);
    }
  }, [isAuth]);

//Admin navigation
const Anavigation = [

  { name: "Liste Présence", href: '/ListeAbsence', current: false },
  { name: 'Formateurs', href: '/formateurs', current: false },
  { name: 'Stagiaires', href: '/AdminSearch', current: false },
  { name: 'Filières', href: '/filieres', current: false },
  { name: 'Groupes', href: '/groupes', current: false },
  { name: 'Salles', href: '/salles', current: false },
  { name: 'Recherche', href: '/DetailsAbsences', current: false },


]

//formateur navigation
const fnavigation = [
  { name: "Liste des absences", href: '/ListeAbsence', current: false },
  { name: 'Saisie une absence', href: '/saisieAbsence', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
return (
  isAuth &&
  <>
    <Disclosure as="nav" className="border-b-4 rounded-md m-2 drop-shadow-xl bg-white">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex items-center justify-center items-stretch justify-start">
                <div className="flex flex-shrink-0 ">
                <a href='/home'>
                  <img
                    className="block h-10 w-auto"
                    src="itsoulutions.ico"
                    alt="IT Soulutions"
                    style={{opacity: 0.8 }}
                    
                  /> 
                  </a>
                </div>
                <div className=" msm:ml-6 msm:block">
                <div className="flex space-x-4">
                  {user.isadmin? (
                    Anavigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current ? ' text-sky-600' : 'text-gray-900 hover:text-teal-600 rounded-md hover:no-underline drop-shadow-md',
                          'px-3 py-2 text-sm font-medium no-underline'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>)
                    )):
                   (fnavigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current ? ' text-sky-600' : 'text-gray-900 hover:text-teal-600 rounded-md hover:no-underline drop-shadow-md',
                          'px-3 py-2 text-sm font-medium no-underline'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>)
                      ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 msm:static msm:inset-auto msm:ml-6 msm:pr-0">
              {/* Profile dropdown */}
              {isAuth && <ProfileMenu user={user} />}
              </div>
            </div>
          </div>
          <Disclosure.Panel className="hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
{user.isadmin?(Anavigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-green-900 text-white' : 'text-gray-700 hover:text-teal-600 hover:no-underline',
                    'block rounded-md px-3 py-2 text-base font-medium no-underline'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                  >
                  {item.name}
                </Disclosure.Button>
              ))):(
                fnavigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-700 hover:text-teal-600 hover:no-underline',
                    'block rounded-md px-3 py-2 text-base font-medium no-underline'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                  >
                  {item.name}
                </Disclosure.Button>)))
                }
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
    <Anne/>
   
    </>
  )
}
// }