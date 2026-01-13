import React from 'react';
// import './App.css';
import Lister from './Lister';
import { useState, useEffect } from 'react';
import {GetFilieres ,GetGroupesByFiliereId, GetStagiairesByGroupeId} from '../interceptors/api';
import LoadingSpinner from "./LoadingSpinner";
import { HomeView } from '../interceptors/api';
import Stagiaire from "./Stagiaire";


function Filter(Edit) {
    const [showLister, setShowLister] = useState(false);
    const [filieres, setFilieres] = useState([]);
    const [stagiaires, setStagiaires] = useState([]);
    const [groupes, setGroupes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFiliere, setSelectedFiliere] = useState('');
    const [selectedGroupe, setSelectedGroupe] = useState('');
    const [home, setHome] = useState('');
    const year = localStorage.getItem('year');

    useEffect(() => {
        const fetchData = async () => {
          try {
            const data1 = await HomeView()
            setHome(data1)
            const data = await GetFilieres(year);
            setFilieres(data);
            setIsLoading(false);
          } catch (error) {
            console.log('Error:', error);
            setIsLoading(false);
          }
        };
        fetchData();
        setShowLister(stagiaires.length > 0);
      }, [stagiaires]);

      useEffect(() => {
        if (Edit && Object.keys(Edit).length > 0) {
          GetFiliereGroupes({
            target: {
              value: Edit.editData[0].filiere
            }
          });
          GetGroupeStagaires({
            target: {
              value: Edit.editData[0].groupe
            }
          });
        }
      }, [Edit]);

    function GetFiliereGroupes(event) {
      setSelectedFiliere(event.target.value);
      // Fetch groupes data for the selected filiere from the server
      if (event.target.value) {
        setIsLoading(true);
        GetGroupesByFiliereId(event.target.value)
          .then(data => {
            setGroupes(data);
            setIsLoading(false);
          })
          .catch(error => {
            console.log(error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        setGroupes([]);
      }
      // Clear the selected groupe and students when a new filiere is selected
      setSelectedGroupe('');
      setStagiaires([]);
    }
    
    function GetGroupeStagaires(event) {
      const newSelectedGroupe = event.target.value;
    
      // Check if the selected groupe value has changed
      if (newSelectedGroupe !== selectedGroupe) {
        setSelectedGroupe(newSelectedGroupe);
    
        // Fetch students data for the selected groupe from the server
        if (newSelectedGroupe) {
          setIsLoading(true);
          GetStagiairesByGroupeId(newSelectedGroupe)
            .then(data => {
              setStagiaires(data);
            })
            .catch(error => {
              console.log(error);
            })
            .finally(() => {
              setIsLoading(false);
            });
        } else {
          setStagiaires([]);
        }
      }
    }

  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <div className="container w-100 mt-3 mx-auto">
           <div className="grid grid-cols-2 gap-4 drop-shadow-md bg-white p-2 rounded-md w-100">
          <select id="filiere_select"
        className="col-span-1 sm:col-span-2 p-2 border text-gray-700 focus:outline-none focus:border-gray-200 hover:bg-gray-100 rounded"
        value={selectedFiliere}
        onChange={GetFiliereGroupes}
      >
        <option value="">Filière</option>
            {filieres.map((item,index)=>{
              return(
                <option key={index} value={item.id}>{item.nom}</option>
              )
            })}
          </select>
          <select id="underline_select" 
            className="p-2 col-span-1 sm:col-span-2 border text-gray-700 focus:outline-none focus:border-gray-200 hover:bg-gray-100 rounded"
            value={selectedGroupe}
            onChange={GetGroupeStagaires}
            disabled={!selectedFiliere}
          >
          <option defaultValue className='text-white-100'>Groupe</option>
            {groupes.map(item=>{
              return(
                <option value={item.id}>{item.nom}</option>
              )})}
          </select>
        </div>
        <div className='flex items-center justify-center mt-2'>
        {!showLister ? (
        <img src='empty.jpeg' alt='' />
      ) : (
        home.isadmin ? <Stagiaire filiere={selectedFiliere} groupe={selectedGroupe} stagiaires={stagiaires}/> 
        : <Lister edit={Edit} filiere={selectedFiliere} groupe={selectedGroupe} stagiaires={stagiaires} />
      )}

        </div>
      </div>
  );
}


export default Filter;