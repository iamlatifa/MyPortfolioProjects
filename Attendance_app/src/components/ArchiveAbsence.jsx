import React, { useState, useEffect } from 'react';
import { SearchAttendance, PutDeactivateStagiaire } from '../interceptors/api';
// import LoadingSpinner from "./LoadingSpinner";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DetailsRetard from './Models/DetailsRetardAr';
import DetailsAbsence from './Models/DetailsAbsenceAr';
import {faX, faCheck, faEye } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import LoadingSpinner from "./LoadingSpinner";

import {
  Card,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";


export default function Archive() {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const year = localStorage.getItem('year');
  const [ShowAbsencePopup, setShowAbsencePopup] = useState(false);
  const [ShowRetardPopup, setShowRetardPopup] = useState(false);
  const [list, setList] = useState([]);

  const fetchData = async () => {
    console.log('data refreshed')

    try {
      const data = await SearchAttendance(query, year);
      setIsLoading(true);
      setResults(data);
      setIsLoading(false);
    } catch (error) {
      console.log('Error:', error);
      setIsLoading(false);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setIsLoading(true);
    fetchData();
  };

  const handleDetails = (e, details, type) => {
    e.preventDefault();
    if (type === 'absence') {
      console.log(type)
      setShowAbsencePopup(true);
    }
    if (type === 'retard') {
      setShowRetardPopup(true);
    }
    setList(details);
  };

  let ModelCloseAbsence = () => setShowAbsencePopup(false);
  let ModelCloseRetard = () => setShowRetardPopup(false);

  const handleDeactivateStagiaire = async (id) => {
    try {
      const result = await PutDeactivateStagiaire(id);
        toast.success(result)
        handleSearch({ preventDefault: () => {} });
      }catch(error) {
        toast.error('Erreur du serveur');
        console.log(error);
      };
  };


  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <div className="px-4 py-12 sm:px-auto lg:px-8 ">
<div>
      {year ? (
        <div className="mb-3">
          <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <input
              type="search"
              className="relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="button-addon1"
              onChange={(e) => setQuery(e.target.value)}
            />
            {query.length >= 3 && (
              <button
                onClick={handleSearch}
                className="relative z-[2] flex items-center rounded-r bg-primary px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
                type="button"
                id="button-addon1"
                data-te-ripple-init
                data-te-ripple-color="light"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className='flex justify-center item-center'>
        <Card className=" w-full max-w-[20rem] text-center p-8 bg-red-400 border-1 border-red-600 rounded shadow-lg">
      <CardBody>
        <Typography variant="h5" color="white" className="mb-2">
        merci de choisir l'année
        </Typography>
        <Typography color="white">
          Aucune donnée trouvé ! veuillez choisie une année
        </Typography>
      </CardBody>
      <CardFooter className="pt-0">
      </CardFooter>
      </Card>  
      </div>   
      
      )}
    </div>

      {results.length > 0 && (
        <div className="relative overflow-x-auto shadow-md border-1 border-gray-200 rounded">
          <div className="relative overflow-x-auto shadow-md">
            <table className="w-full text-md text-sm font-light ">
              <thead className="text-xs text-white uppercase bg-green-500 shadow-md ">
                <tr >
                  <th className="px-2 py-2">Matricule</th>
                  <th className="px-auto py-1">Nom</th>
                  <th className="px-auto py-1">Prénom</th>
                  <th className="px-auto py-1">Cin</th>
                  <th className="px-auto py-1">Groupe</th>
                  <th className="px-auto py-1">Tel</th>
                  <th className="px-auto py-1">Total heures</th>
                  <th className="px-auto py-1">Détails absences</th>
                  <th className="px-auto py-1">Détails retards</th>
                  <th className="px-auto py-1">Actions</th>


                </tr>
              </thead>
              <tbody>
                {results.map((item) => (
                 <tr key={item.id} className={`${item.actif ? 'hover:bg-gray-200 dark:hover:bg-gray-600' : 'bg-yellow-300'}`}>
                    <td className="px-2 ">{item.matricule}</td>
                    <td className="px-auto py-1">{item.nom}</td>
                    <td className="px-auto py-1">{item.prenom}</td>
                    <td className="px-auto py-1">{item.cin}</td>
                    <td className="px-auto py-1">{item.groupe}</td>
                    <td className="px-auto py-1">{item.tel}</td>
                    <td className="px-auto py-1">
                      {item.total_hours ? item.total_hours + " Heures" : "0"}
                    </td>
                    <td className="px-2">
                      {item.total_hours !== 0 ? (
                        <>
                          <button
                            className="focus:outline-none"
                            onClick={(event) => handleDetails(event, item.absences, "absence")}
                          >
                            <FontAwesomeIcon icon={faEye} size="lg" style={{ color: '#6590D5' }} />
                          </button>
                          <DetailsAbsence
                            show={ShowAbsencePopup}
                            onHide={ModelCloseAbsence}
                            data={list}
                            stagiaireId={item.id}
                            refresh={handleSearch}
                            RePopup={handleDetails}

                          />
                        </>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td className="px-2 py-1">
                    {item.retards.length > 0 ? (
                        <>
                          <button
                            className="focus:outline-none"
                            onClick={(event) => handleDetails(event, item.retards, "retard")}
                          >
                            <FontAwesomeIcon icon={faEye} size="lg" style={{ color: '#6590D5' }} />
                          </button>
                          <DetailsRetard
                            show={ShowRetardPopup}
                            onHide={ModelCloseRetard}
                            data={list}
                            stagiaireId={item.id}
                          />
                        </>
                      ) : (
                      <span>-</span>
                      )}
                    </td>
                        <td className="px-auto py-2 text-gray-900">
                        {item.actif ? (
                        <button
                        className='bg-green-500 hover:bg-green-400 text-white font-bold py-1 px-3 focus:ring-2 focus:ring-green-300 border-b-2 border-green-700 hover:border-green-500 rounded'
                          onClick={() => handleDeactivateStagiaire(item.id)} 
                          title="Cliquez pour Désactiver ce Stagiaire">
                          <FontAwesomeIcon icon={faCheck} size="lg" style={{ color: '#FFFFFF' }} />
                        </button>
                      ) : (
                        <button
                        className='bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-3 focus:ring-2 focus:ring-red-300 border-b-2 border-red-700 hover:border-red-500 rounded'
                        onClick={() => handleDeactivateStagiaire(item.id)} 
                        title="Cliquez pour Réactiver ce Stagiaire">
                          <FontAwesomeIcon icon={faX} size="lg" style={{'color':'#FFFFFF'}} />
                        </button>
                      )}
                        </td>
                  </tr>
                  
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
