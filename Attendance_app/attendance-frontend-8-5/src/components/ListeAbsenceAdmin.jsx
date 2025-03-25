import React, { useEffect, useState } from 'react';
import {
  GetAbsences,
  GeRetards,
  PutValidateAttendance,
  PutPermissionAttendance
} from '../interceptors/api';
import DetailsRetard from './Models/DetailsRetard';
import DetailsAbsence from './Models/DetailsAbsence';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faRotateLeft, faEye, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoadingSpinner from "./LoadingSpinner";
import { Button, IconButton } from "@material-tailwind/react";
import Archive from './ArchiveAbsence';
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";

export default function ListeAbs() {
  const [selectAll, setSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState([]);
  const [ShowAbsencePopup, setShowAbsencePopup] = useState(false);
  const [ShowRetardPopup, setShowRetardPopup] = useState(false);
  const [ShowArchive, setShowArchive] = useState(false);
  const [attendances, setAttendances] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [nom,setNom] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items to show per page
  const year = localStorage.getItem('year');

  const fetchData = async () => {
    try {
      const [absences, retards] = await Promise.all([
        GetAbsences(year),
        GeRetards(year),
      ]);
      const absencesWithType = absences.map((absence) => ({
        ...absence,
        type: "absence",
      }));
      const retardsWithType = retards.map((retard) => ({
        ...retard,
        type: "retard",
      }));
  
      const combinedData = [...absencesWithType, ...retardsWithType];
      setAttendances(combinedData);
  
      setIsLoading(false);
    } catch (error) {
      console.log("Error:", error);
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    const alertMessage = localStorage.getItem('alertMessage');
    if (alertMessage) {
      toast.success(alertMessage);
      localStorage.removeItem('alertMessage');
    }
    fetchData();
  }, []);
  
  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }


  const handleDetails = (e, details, type) => {
    e.preventDefault();
    if (type === 'absence') {
      setShowAbsencePopup(true);
    }
    if (type === 'retard') {
      setShowRetardPopup(true);
    }
    setList(details);
  };

  let ModelCloseAbsence = () => setShowAbsencePopup(false);
  let ModelCloseRetard = () => setShowRetardPopup(false);

  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);

    const updatedAttendances = attendances.map((attendance) => ({
      ...attendance,
      selected: isChecked,
    }));
    setAttendances(updatedAttendances);
    if (isChecked) {
      const newSelectedIds = updatedAttendances.map((item) => ({
        id: item.id,
        type: item.type === 'retard' ? 'r' : 'a',
      }));
      setSelectedIds(newSelectedIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleCheckboxChange = (event, id, type) => {
    const isChecked = event.target.checked;

    setAttendances((prevAttendances) => {
      return prevAttendances.map((attendance) => {
        if (attendance.id === id && attendance.type === type) {
          return {
            ...attendance,
            selected: isChecked,
          };
        }
        return attendance;
      });
    });

    if (isChecked) {
      setSelectedIds((prevSelectedIds) => [
        ...prevSelectedIds,
        { id, type: type === 'retard' ? 'r' : 'a' },
      ]);
    } else {
      setSelectedIds((prevSelectedIds) =>
        prevSelectedIds.filter(
          (item) => item.id !== id || item.type !== (type === 'retard' ? 'r' : 'a')
        )
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedIds.length === 0) {
      return;
    }

    const selectedRows = selectedIds.map((item) => ({
      id: item.id,
      type: item.type === 'r' ? 'retard' : 'absence',
    }));

    PutValidateAttendance(selectedRows)
      .then((result) => {
        localStorage.setItem('alertMessage', result);
        window.location.reload();
      })
      .catch((error) => {
        toast.error('Erreur du serveur');
        console.log(error);
      });
  };

  const SendEditPermission = (itemId, itemType) => {
    const selectedRow = [{ id: itemId, type: itemType === 'absence' ? 'a' : 'r' }];

    PutPermissionAttendance(selectedRow)
      .then((result) => {
        localStorage.setItem('alertMessage', result);
        window.location.reload();
      })
      .catch((error) => {
        toast.error('Erreur du serveur');
        console.log(error);
      });
  };

  // Pagination
  const totalPages = Math.ceil(attendances.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, attendances.length);

  // ... Rest of the component

   const getItemProps = (index) => ({
    variant: currentPage === index ? "filled" : "text",
    color: currentPage === index ? "green" : "",
    onClick: () => setCurrentPage(index),
    className:" rounded-full w-8 h-8 flex items-end justify-center" // Adjust the width and height here

  });
  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  
  // Previous and Next functions
  const prev = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  const next = () => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages ));

  // Pagination buttons array
  const paginationButtons = Array.from({ length: totalPages }, (_, index) => index + 1);

  // Calculate Date
  const calculateTimeDifference = (date) => {
    const currentDate = new Date();
    const timestamp = new Date(date);
    const timeDifference = currentDate - timestamp;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days}j`;
    } else if (hours > 0) {
        return `${hours}h`;
    } else if (minutes > 0) {
        return `${minutes}m`;
    } else {
        return `${seconds}s`;
    }
  };
  
  const getTimeStyle = (date) => {
    const currentDate = new Date();
    const timestamp = new Date(date);
    const timeDifference = currentDate - timestamp;
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Calculate days
  
    // Define thresholds for different colors
    const oneDayThreshold = 1;
    const threeDayThreshold = 3;
  
    if (days < oneDayThreshold) {
      return { color: 'green' }; // Black for less than 1 day
    } else if (days <= threeDayThreshold) {
      return { color: '#f77676' }; // Light red for 1 to 3 days
    } else {
      return { color: '#f12222' }; // Dark red for over 3 days
    }
  };

  return (
    <div className="px-4 py-12 sm:px-auto lg:px-8 ">
      {attendances.length === 0 ? (
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
    ) : (
      <div className="relative overflow-x-auto shadow-md border-1 border-gray-200 rounded">
     {/* Pagination */}
     {attendances.length > 0 && ( // Add this condition
         <div className="h-12 m-2 grid grid-cols-5 content-center">
         <p className='text-xl self-center text-gray-500 font-bold uppercase'>liste présence</p>
         <Button
           variant="text"
           color="blue"
           className="flex items-center justify-end gap-2 rounded-full"
           onClick={prev}
           disabled={currentPage === 1}
         >
          <span aria-hidden="true">&laquo;</span>
         </Button>
         <div className="flex items-center justify-center">
           {paginationButtons.map((page) => (
             <IconButton
               key={page}
               {...getItemProps(page)}>
               {page}
             </IconButton>
           ))}
         </div>
         <Button
           variant="text"
           color="cyan"
           className="flex items-center gap-2 rounded-full"
           onClick={next}
           disabled={currentPage === totalPages }
         > 
          <span aria-hidden="true">&raquo;</span>
         </Button>
            <div class="relative mb-2 flex w-full flex-wrap items-stretch">
    <div class="relative  flex w-full flex-wrap justify-end items-stretch">
    {selectedIds.length > 0 ? (
        <button
          onClick={handleSubmit}
          className="w-1/2 rounded bg-primary-500 py-2 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
        >
          Valider
        </button>
      ) : null}
      </div>
  </div>            
  </div>
          )}
        <table className="w-full text-md text-left text-sm font-light ">
          <thead className="h-14 p-4 text-xs text-gray-900 uppercase border-b font-medium ">
            <tr className=' border-b border-neutral-100 border-b bg-green-500 text-white shadow-md text-neutral-800'>
              <th className="px-auto">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="focus:outline-none w-4 m-1 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-all-search" className=" m-2">
                    Valider touts
                  </label>
                </div>
              </th>
              <th className="px-auto ">Type</th>
              <th className="px-auto ">Formateur</th>
              <th className="px-auto ">Date</th>
              <th className="px-auto ">Horaire</th>
              <th className="px-auto ">Groupe</th>
              <th className="px-auto ">Filière</th>
              <th className="px-auto ">Salle</th>
              <th className="px-auto text-center">Permission</th>
              <th className="px-auto text-center">Details</th>
              <th className="px-auto text-center">Modifier / Ajouté </th>

            </tr>
          </thead>
          <tbody>
          {attendances.slice(startIndex, endIndex).map((item, index) => {
              const isAbsence = item.type === 'absence';
              const isSelected = selectedIds.some(
                (selectedId) => selectedId.id === item.id && selectedId.type === (isAbsence ? 'a' : 'r')
              );

              if (!item.valide) {
                return (
                  <tr
                    key={index}
                    className={classNames(
                      item.type ==='retard' ? 'hover:bg-sky-200' : 'hover:bg-green-200',
                      'border-b dark:border-neutral-500'
                      )}
                      >
                    <td className="px-auto ">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        value={item.id}
                        onChange={(event) =>
                          handleCheckboxChange(event, item.id, item.type)
                        }
                        className="focus:outline-none w-4 m-1 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                    </td>
                    <td className="px-auto capitalize">{item.type}</td>
                    <td className="px-auto ">{item.formateur}</td>
                    <td className="px-auto ">{item.date}</td>
                    <td className="px-auto ">{`${item.seance_debut} - ${item.seance_fin}`}</td>
                    <td className="px-auto ">{item.groupe}</td>
                    <td className="px-auto ">{item.filiere}</td>
                    <td className="px-auto ">{item.salle}</td>
                    <td className="px-auto text-center ">
                      {item.modifiable ? (
                        <button
                          onClick={() => SendEditPermission(item.id, item.type)} 
                          title="Cliquez pour Annuler l'autorisation de modification.">
                          <FontAwesomeIcon icon={faCheck} size="lg" style={{ color: '#6590D5' }} />
                        </button>

                      ) : (
                        <button
                        onClick={() => SendEditPermission(item.id, item.type)} 
                        title="Cliquez pour Donner l'autorisation de la modification.">
                          <FontAwesomeIcon icon={faRotateLeft} size="lg" style={{'color':'#6590D5'}} />
                        </button>
                      )}
                    </td>
                    <td className="px-auto text-center">
                      <button
                        className="m-2 focus:outline-none"
                        onClick={(event) =>
                          handleDetails(event, item.details_attendance, item.type)
                        } title="Afficher les détails">
                        <FontAwesomeIcon icon={faEye} size="lg" style={{'color':'#6590D5'}}/>
                      </button>
                      {item.type === 'absence' ? (
                        <DetailsAbsence
                          show={ShowAbsencePopup}
                          onHide={ModelCloseAbsence}
                          data={list}
                        ></DetailsAbsence>
                      ) : (
                        <DetailsRetard
                          show={ShowRetardPopup}
                          onHide={ModelCloseRetard}
                          data={list}
                        ></DetailsRetard>
                      )}
                    </td>
                    {item.modifier_a ? (
                      <td className="font-semibold text-center" style={getTimeStyle(item.modifier_a)}>
                        Modifer il y a: {calculateTimeDifference(item.modifier_a)}
                      </td>
                    ) : (
                      <td className="font-semibold text-center" style={getTimeStyle(item.ajoute_a)}>
                        Ajouter il y a: {calculateTimeDifference(item.ajoute_a)}
                      </td>
                    )}
                  </tr>
                );
              }
              return null;
            })}
          </tbody>
        </table>
      </div>
      )}
      <br />
    </div>
  );
}
