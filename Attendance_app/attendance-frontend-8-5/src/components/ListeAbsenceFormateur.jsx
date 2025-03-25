import React from "react";
import { useEffect, useState } from "react";
import {
  GetAbsences,
  GeRetards,
  GetAbsenceById,
} from "../interceptors/api";
import {
  faEdit,
  faCheck,
  faBusinessTime,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DetailsRetard from "./Models/DetailsRetard";
import DetailsAbsence from "./Models/DetailsAbsence";
import Filter from './filter';

export default function ListeAbs() {
  const [isLoading, setIsLoading] = useState(true);
  const [attendances, setAttendances] = useState([]);
  const [retard, setRetard] = useState([]);
  const [absences, setAbsences] = useState([]);
  const [retards, setRetards] = useState([]);
  const [ShowAbsencePopup, setShowAbsencePopup] = useState(false);
  const [ShowRetardPopup, setShowRetardPopup] = useState(false);
  const [list, setList] = useState([]);
  const year = localStorage.getItem("year");
  const [editData, setEditData] = useState(null); // State to hold the data for editing
  const fetchData = async () => {
    try {
      const [absences, retards] = await Promise.all([
        GetAbsences(year), // error year not found in formateur
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
      setAbsences(absencesWithType);
      setRetards(retardsWithType);
      const combinedData = [...absencesWithType, ...retardsWithType];
      setAttendances(combinedData);

      setIsLoading(false);
    } catch (error) {
      console.log("Error:", error);
      setIsLoading(false);
    }
  };

  const handleDetails = (e, details, type) => {
    e.preventDefault();
    if (type == "absence") {
      setShowAbsencePopup(true);
    }
    if (type == "retard") {
      setShowRetardPopup(true);
    }
    setList(details);
  };
  let ModelCloseAbsence = () => setShowAbsencePopup(false);
  let ModelCloseRetard = () => setShowRetardPopup(false);

  const handleUpdate = async (id) => {
    try {
      const data = await GetAbsenceById(id);
      setEditData(data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="text-center">
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <div className="flex my-1 justify-center p-10 rounded-md ">
      {editData ? <Filter editData={editData} />
      :
      <div className="grid grid-cols-2 gap-4">
        <div className="col-start-1 col-end-2 mx-2 p-4 shadow-md bg-gray-100 rounded drop-shadow-xl ">
          <h1 className="text-xl mt-2 font-bold mb-4 text-gray-500 text-center">
            Absences
          </h1>
          <div className=" flex flex-wrap justify-start flex-grow-1 ">
            {absences.map((item, index) => {
              const today = new Date();
              const itemDate = new Date(item.date);
              const timeDiff = today.getTime() - itemDate.getTime();
              const daysDiff = timeDiff / (1000 * 3800 * 24);
              if (!item.valide && daysDiff < 20) {
                return (
                  <div
                    key={index}
                    className=" bg-neutral-100 rounded-md m-2 drop-shadow-xl grid grid-cols-2 gap-1 flex-grow-1"
                    >
                    <div className="bg-ista-green p-2 rounded-l-md text-gray-100	">
                      <h6>{item.date}</h6>
                      <h6>Total {item.details_attendance.length}</h6>
                      <hr className="mb-2"/>
                      <div className="flex flex-row-reverse align items-center">
                        <div>
                          <button
                            className={classNames(
                              item.modifiable ? 'border-r border-t border-b border-teal-300 rounded-r-md p-1' : 'rounded-md py-1 px-2',
                              'focus:outline-none bg-teal-400 hover:bg-teal-300'
                            )}
                            onClick={(event) =>
                              handleDetails(
                                event,
                                item.details_attendance,
                                "absence"
                              )
                            }
                          >
                            <FontAwesomeIcon 
                            icon={faEye} 
                            className="mx-1 "
                            size="lg" />
                          </button>
                          <DetailsAbsence
                            show={ShowAbsencePopup}
                            onHide={ModelCloseAbsence}
                            data={list}
                          ></DetailsAbsence>
                        </div>
                        <p className="">
                          {item.modifiable && (
                            <button
                            className="focus:outline-none border-1 border-teal-300 bg-teal-400 hover:bg-teal-300 rounded-l-md px-1 py-1.5"
                            onClick={() => handleUpdate(item.id)}>
                              <FontAwesomeIcon
                                className="mx-1 float-right "
                                icon={faEdit}
                                size="lg"
                              />
                            </button>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className=" grid grid-cols-1 gap-0 px-4 text-sm">
                      <p className=" text-gray-500 ">
                        {item.groupe}
                      </p>
                      <p className=" text-gray-500 ">
                        {item.module ? item.module : "-"}
                      </p>
                      <p className=" text-gray-500 ">
                        {item.seance_debut} - {item.seance_fin}
                      </p>
                      <p className=" text-gray-500 ">{item.salle}</p>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
        <div className="col-start-2 col-end-3 mx-2 p-4 shadow-md b bg-gray-100 drop-shadow-xl rounded ">
          <h1 className="text-xl mt-2 font-bold mb-4 text-gray-500 text-center">
            Retards
          </h1>
          <div className="flex flex-wrap justify-start flex-grow-1">
            {retards.map((item, index) => {
              const today = new Date();
              const itemDate = new Date(item.date);
              const timeDiff = today.getTime() - itemDate.getTime();
              const daysDiff = timeDiff / (1000 * 3800 * 24);
  
              if (!item.valide && daysDiff < 20) {
                return (
                  <div
                  key={index}
                  className=" bg-neutral-100 rounded-md m-2 drop-shadow-xl grid grid-cols-2 gap-1 flex-grow-1 "
                >
                  <div className="bg-sky-500 p-2 rounded-l-md text-gray-100	">
                        <h6>{item.date}</h6>
                        <h6>Total {item.details_attendance.length}</h6>
                        <hr className="mb-2" />
                        <div className="flex flex-row-reverse align items-center">
                          <div>
                            <button
                              className={classNames(
                                item.modifiable ? 'border-r border-t border-b border-sky-300 rounded-r-md px-1 py-1.5' : 'rounded-md py-1.5 px-2',
                                'focus:outline-none bg-sky-400 hover:bg-sky-300'
                              )} onClick={(event) =>
                                handleDetails(
                                  event,
                                  item.details_attendance,
                                  "retard"
                                )
                              }
                            >
                              <FontAwesomeIcon 
                              icon={faEye}
                               size="lg" 
                               className="float-right mx-1"
                               />
                            </button>
                            <DetailsRetard
                              show={ShowRetardPopup}
                              onHide={ModelCloseRetard}
                              data={list}
                            ></DetailsRetard>
                          </div>
                          <div >
                            {item.modifiable && (
                              <button
                                className="focus:outline-none border-1 border-sky-300 bg-sky-400 hover:bg-sky-300 rounded-l-md px-1 py-1.5"
                                onClick={() => handleUpdate(item.id)}>
                                <FontAwesomeIcon
                                  className="float-right mx-1"
                                  icon={faEdit}
                                  size="lg"
                                />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className=" grid grid-cols-1 gap-0 px-4 text-sm ">
                        <p className=" text-gray-500 ">
                          {item.groupe}
                        </p>
                        <p className=" text-gray-500 ">
                          
                          {item.module ? item.module : "-"}
                        </p>
                        <p className=" text-gray-500  ">
                          {item.seance_debut} - {item.seance_fin}
                        </p>
                        <p className=" text-gray-500 ">{item.salle}</p>
                      </div>
                    </div>
                );
              }
              return null;
            })}
          </div>
          </div>
      </div>}
    </div>
  );
}