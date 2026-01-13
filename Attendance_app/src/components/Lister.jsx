import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './App.css';
import { GetStagiaires, GetSalles, HomeView, PostAbsence, PostRetard, PutAbsence } from '../interceptors/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from "./LoadingSpinner";
import { Button, IconButton } from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBan} from '@fortawesome/free-solid-svg-icons';

export default function Lister(props) {
  const [debut, setDebut] = useState("");
  const [module, setModule] = useState("");
  const [date, setDate] = useState("");
  const [fin, setFin] = useState("");
  const [stagiaires, setStagiaires] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [salles, setSalles] = useState([]);
  const [salle, setSalle] = useState("");
  const [absence, setAbsence] = useState([]);
  const [retard, setRetard] = useState([]);
  const [observation, setObservation] = useState([]);
  const [formateur, setFormateur] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const year = localStorage.getItem('year');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7;
  const navigate = useNavigate();
  const [checkedAbsenceCheckboxes, setCheckedAbsenceCheckboxes] = useState(1);
  const [checkedRetardCheckboxes, setCheckedRetardCheckboxes] = useState(1);
  const [selectOptionVisibility, setSelectOptionVisibility] = useState(1);
  const [absenceEditMode, setAbsenceEditMode] = useState(false);
  const [retardEditMode, setRetardEditMode] = useState(false);
  const [disableAbsenceCheckboxes, setDisableAbsenceCheckboxes] = useState({});
  const [disableRetardCheckboxes, setDisableRetardCheckboxes] = useState({});
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetSalles(year);
        setSalles(data);
        const data3 = await HomeView();
        setFormateur(data3.userid);
        if (props.stagiaires) {
          setStagiaires(props.stagiaires)
        } else {
          const data2 = await GetStagiaires(year);
          setStagiaires(data2);
        }
        setIsLoading(false);
      } catch (error) {
        console.log('Error:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAbsenceCheckboxChange = (e, item) => {
    const { checked } = e.target;
    const newDisableRetardCheckboxes = { ...disableRetardCheckboxes };
  
    // Disable the corresponding 'retard' checkbox with the same ID
    newDisableRetardCheckboxes[item.id] = checked;
    setDisableRetardCheckboxes(newDisableRetardCheckboxes);
  
    if (checked) {
      // Add the item to the absence list if it's not already there
      setAbsence((prevAbsence) => {
        if (!prevAbsence.includes(item.id)) {
          return [...prevAbsence, item.id];
        }
        return prevAbsence;
      });
    } else {
      // Remove the item from the absence list
      setAbsence((prevAbsence) => prevAbsence.filter((id) => id !== item.id));
    }
  
    // Update the checked state
    setCheckedAbsenceCheckboxes((prevChecked) => ({
      ...prevChecked,
      [item.id]: checked,
    }));
  };
  
  const handleRetardCheckboxChange = (e, item) => {
    const { checked } = e.target;
    const newDisableAbsenceCheckboxes = { ...disableAbsenceCheckboxes };
  
    // Disable the corresponding 'absence' checkbox with the same ID
    newDisableAbsenceCheckboxes[item.id] = checked;
    setDisableAbsenceCheckboxes(newDisableAbsenceCheckboxes);
  
    // Handle the appearance of the select option here
    if (checked) {
      // Show the select option by updating the state
      setShowSelectOptionForItem(item.id, true);
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, item]);
    } else {
      // Hide the select option by updating the state
      setShowSelectOptionForItem(item.id, false);
    }
  
    // Update the checkbox state
    setCheckedRetardCheckboxes((prevChecked) => ({
      ...prevChecked,
      [item.id]: checked,
    }));
  };

  

  
  const handleObservationChange = (e, itemId) => {
    setObservation((prevObservation) => ({
      ...prevObservation,
      [itemId]: e.target.value,
    }));
    console.log('obs',observation)

  };
  

  const setShowSelectOptionForItem = (itemId, show) => {
    setSelectOptionVisibility((prevVisibility) => ({
      ...prevVisibility,
      [itemId]: show,
    }));
  };
  

  // EDIT useeffect
  useEffect(() => {
    if (props && props.edit && props.edit.editData && props.edit.editData[0] && props.edit.editData[0].details_attendance) {
      props.edit.editData[0].details_attendance.forEach((attendanceDetails) => {
        if (attendanceDetails.absence) {
          setAbsenceEditMode(true);
          return; // If you only want to check if any absence is present and exit the loop.
        }
        if (attendanceDetails.retard) {
          setRetardEditMode(true);
          return; // If you only want to check if any absence is present and exit the loop.
        }
      });
    }

    if (props.edit && Object.keys(props.edit).length > 0) {
      const editData = props.edit.editData[0];
      setSalle(editData.salle)
      setModule(editData.module)
      setDate(editData.date)
      setDebut(editData.seance_debut)
      setFin(editData.seance_fin)
      if (Array.isArray(editData.details_attendance)) {
        const ids = editData.details_attendance.map((attendance) => {
        const { stagiaire, observation } = attendance;
          // Call handleObservationChange with the extracted values
          handleObservationChange(
            {
              target: {
                value: observation
              },
            },
            stagiaire.id
          );
          if (attendance.stagiaire && attendance.stagiaire.id) {
            return attendance.stagiaire.id;
          }
          return null;
        });
        ids.forEach((id) => {
          const item = { id }; // Create an item object with the id
          handleAbsenceCheckboxChange(
            {
              target: {
                value: id,
                checked: true,
              },
            },
            item
          );
        });
      }
    }
  }, [props.edit]);

  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }



  // const duplicateIds = absence.filter((id) => retard.hasOwnProperty(id));
  // if (duplicateIds.length > 0) {
  //   alert("Vous ne pouvez pas saisir un stagiaire absent et en retard en meme temp.");// + duplicateIds.join(", "));
  // }

  const handleSelectChange = (e, item) => {
    const { value } = e.target;
    setRetard((prevRetard) => ({
      ...prevRetard,
      [item.id]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
      if (absence.length > 0) {
        const absenceArray = [];
        const dataObject = {
          date: date,
          groupe: props.groupe,
          filiere: props.filiere,
          salle: salle,
          debut: debut,
          fin: fin,
          module: module,
          absences: absence,
          observation: observation,
          formateur: formateur,

        };
        console.log('obs',observation)
        absenceArray.push(dataObject);
        if (props.edit && Object.keys(props.edit).length > 0) {
          PutAbsence(props.edit.editData[0].id, absenceArray)
            .then((result) => {
              toast.success(result);
              navigate("/ListeAbsence");
            })
            .catch((error) => {
              toast.error("erreur du serveur");
            });
          }else{
              PostAbsence(absenceArray)
              .then((result) => {
                toast.success(result);
                navigate("/ListeAbsence");
              })
              .catch((error) => {
                toast.error("erreur du serveur");
              });
            }
      }
      if (Object.values(retard).length > 0) {
        const retardArray = [];
        const dataObject = {
          date: date,
          groupe: props.groupe,
          filiere: props.filiere,
          salle: salle,
          debut: debut,
          fin: fin,
          module: module,
          retards: retard,
          observation: observation,
          formateur: formateur,
        };
        retardArray.push(dataObject);

        PostRetard(retardArray)
          .then((result) => {
            toast.success(result);
            navigate("/ListeAbsence");
          })
          .catch((error) => {
            toast.error("erreur du serveur");
          });
      }
  };

  // Pagination
  const totalPages = Math.ceil(stagiaires.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, stagiaires.length);


  const getItemProps = (index) => ({
    variant: currentPage === index ? "filled" : "text",
    color: currentPage === index ? "Light-Blue" : "blue",
    onClick: () => setCurrentPage(index ),
    className: " rounded-full w-8 h-8 flex items-end justify-center" // Adjust the width and height here

  });

  // Previous and Next functions
  const prev = () => setCurrentPage((prevPage) => Math.max(prevPage - 1));
  const next = () => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));

  // Pagination buttons array
  const paginationButtons = Array.from({ length: totalPages }, (_, index) => index );


  return (
    <div className="container w-100 mx-auto drop-shadow-xl  bg-white rounded p-2">
      <div className="relative overflow-x-auto ">
        <form onSubmit={handleSubmit}>
          <div className="container w-100 ">
            <div className="grid gap-6 mb-6 grid-cols-4 ">
              <input required type="date"
                className="rounded-md border-0 p-1.5 col-span-1 lg:col-span-5 text-gray-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:outline-none focus:shadow-xl focus:ring-gray-500 sm:text-sm sm:leading-6"
                value={date}
                onChange={(e) => setDate(e.target.value)} />

              <select id="underline_select" required
                className="rounded-md border-0 p-1.5 col-span-1 lg:col-span-5 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:outline-none focus:shadow-xl focus:ring-gray-500 sm:text-sm sm:leading-6"
                value={salle}
                onChange={(e) => setSalle(e.target.value)} >
                <option value="">Salle</option>
                {salles.map((item,index) => {
                  return (
                    <option key={index} value={item.id}>{item.nom}</option>

                  )
                })}
              </select>
              <select
                id="horaire"
                className="rounded-md border-0 p-1.5 col-span-1 lg:col-span-5 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:outline-none focus:shadow-xl focus:ring-gray-500 sm:text-sm sm:leading-6" 
                value={debut+'-'+fin}
                required
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  const startValue = selectedValue.split('-')[0];
                  const endValue = selectedValue.split('-')[1];
                  setDebut(startValue);
                  setFin(endValue);
                }}
              >
                <option value="">Choisir horaire</option>
                <option value="08:30-10:30">08:30 - 10:30</option>
                <option value="10:30-13:30">10:30 - 13:30</option>
                <option value="08:30-13:30">08:30 - 13:30</option>
                <option value="13:30-16:30">13:30 - 16:30</option>
                <option value="16:30-18:30">16:30 - 18:30</option>
                <option value="13:30-18:30">13:30 - 18:30</option>
              </select>
              <input type="text" placeholder="module"
                className="rounded-md border-0 p-1.5 col-span-1 lg:col-span-5 text-gray-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-900 focus:ring-2 focus:ring-inset focus:outline-none focus:shadow-xl focus:ring-gray-500 sm:text-sm sm:leading-6"
                value={module}
                onChange={(e) => setModule(e.target.value)} />
            </div>
          </div>
          <div className="relative overflow-x-auto shadow-md rounded m-2 ">
            <div className="relative overflow-x-auto border-1 border-gray-200 rounded-t">
              {stagiaires.length > itemsPerPage && (
                <div className="h-10 m-2 grid grid-cols-5 content-center">
                  <p className="self-center font-semibold">
                    Total  {stagiaires.length }</p>
                  <Button
                    variant="text"
                    className="col-start-2 items-center justify-end gap-2 rounded-full"
                    onClick={prev}
                    disabled={currentPage === 0}
                    >
                    <span aria-hidden="true">
                      <i className="fa-solid fa-arrow-left"></i>
                    </span>
                  </Button>
  
                  <div className="flex col-start-3 items-center justify-center">
                    {paginationButtons.map((page) => (
                      <IconButton
                        key={page}
                        {...getItemProps(page )}>
                        {page +1}
                      </IconButton>
                    ))}
                  </div>
                  <Button
                    variant="text"
                    className="col-start-4 items-center gap-2 rounded-full"
                    onClick={next}
                    disabled={currentPage === totalPages -1}
                  >
                    <span aria-hidden="true" >
                      <i className="fa-solid fa-arrow-right"></i>  </span>
                  </Button>
                  <div className="relative m-1 flex w-full flex-wrap justify-end items-stretch">
                    <button
          className="w-1/2 rounded bg-primary py-3 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
          type="submit"
                      id="button-addon1"
                      data-te-ripple-init
                      data-te-ripple-color="light"
                      style={{ "backgroundColor": "rgb(56 189 248)" }}
                    >
                      Valider
                    </button>
                  </div>
                </div>
              )}
            </div>
            <table className="w-full text-md text-left text-gray-600 table-auto ">
              <thead className="text-xs text-white uppercase bg-sky-300 shadow-md ">
                <tr >
                  <th scope="col" className="px-6 py-2">
                    Stagiaire
                  </th>
                  <th scope="col" className="px-6 py-2">
                    Absent
                  </th>
                  <th scope="col" className="px-6 py-2">
                    Retard
                  </th>
                  <th scope="col" className="px-6 py-2">

                  </th>
                  <th scope="col" className="px-6 py-2">
                    Observation
                  </th>

                </tr>
              </thead>
              <tbody>

                {stagiaires.slice(startIndex, endIndex).map((item, index) => {
                  return (
                    <tr key={index} className={`${item.actif ? 'hover:bg-gray-100' : 'bg-yellow-300'} border-0`}>
                      <td name={item.id}>
                        <span className="mx-2"><img className="h-8 w-auto rounded-full inline-block m-1" src="studentold.png" alt="" /></span>
                        {item.nom} {item.prenom}
                      </td>
                      {item.actif ? (
                          <>
                      <td className="w-4 pl-4">
                        <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 m-1 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                          name="absence"
                          value={item.id}
                          checked={checkedAbsenceCheckboxes[item.id] || false}
                          onChange={(e) => handleAbsenceCheckboxChange(e, item)}
                            disabled={disableAbsenceCheckboxes[item.id] || retardEditMode}
                        />
                        </div>
                      </td>
                      <td className="w-4 pl-4">
                        <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="retard"
                          className="w-4 m-1 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                          checked={checkedRetardCheckboxes[item.id] || false}
                          onChange={(e) => handleRetardCheckboxChange(e, item)}
                          disabled={disableRetardCheckboxes[item.id] || absenceEditMode}
                        />
                        </div>
                      </td>
                      <td>
                      {selectOptionVisibility[item.id] && (
                        <select
                          value={retard[item.id] || ''}
                          onChange={(e) => handleSelectChange(e, item)}
                          className="mx-2 p-2 px-2 border text-gray-900 focus:outline-blue-200 focus:border-blue-600 rounded text-sm"
                          required
                        >
                          <option value="">Temps de retard</option>
                          <option value="10">10 min</option>
                          <option value="20">20 min</option>
                          <option value="30">30 min</option>
                        </select>
                      )}
                      </td>
                      <td>
                      <textarea
                        className={`mt-2 text-xs mx-2 p-2 px-3 sm:px-0 border text-gray-700 focus:outline-none focus:outline-blue-200 focus:border-blue-600 hover:bg-gray-200 rounded ${
                          !checkedAbsenceCheckboxes[item.id] && !checkedRetardCheckboxes[item.id] ? 'disabled-textarea' : ''
                        }`}
                        value={observation[item.id] || ''}
                        onChange={(e) => handleObservationChange(e, item.id)}
                        cols="20"
                        rows="1"
                        // Disable the textarea if the checkbox is not checked
                        disabled={!checkedAbsenceCheckboxes[item.id] && !checkedRetardCheckboxes[item.id]}
                        ></textarea>
                      </td>
                      </>
                      ) : (
                        <>
                      <td className="w-4 pl-4">
                        <FontAwesomeIcon icon={faBan} style={{ color: "#ff0000" }} />
                      </td>
                      <td className="w-4 pl-4">
                        <FontAwesomeIcon icon={faBan} style={{ color: "#ff0000" }} />
                      </td>
                      Stagiaire inactif
                      </>
                      )}
                    </tr>);
                })}
              </tbody>
            </table>
          </div>
        </form>
      </div>
    </div>

  )
}