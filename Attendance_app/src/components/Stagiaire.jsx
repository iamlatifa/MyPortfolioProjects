import React from "react";
import { useState, useEffect } from 'react';
import { GetStagiaires, DeleteStagiaire, PutDeactivateStagiaire, GetStagiairesByGroupeId } from '../interceptors/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faEdit, faLoader } from '@fortawesome/free-solid-svg-icons';
import UpdateStudentModal from './Models/ModifierEtudiantsForm';
import AddStudentModal from "./Models/AjouterEt";
import { toast } from 'react-toastify';
import LoadingSpinner from "./LoadingSpinner";
import { Button, IconButton } from "@material-tailwind/react";
import { faRotateLeft, faEraser, faCheck } from '@fortawesome/free-solid-svg-icons';
import {
    Card,
    CardBody,
    CardFooter,
    Typography,
  } from "@material-tailwind/react";

export default function Stagiaire(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [stagiaires, setStagiaires] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [addModalShow, setAddModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [editStudent, setEditStudent] = useState([]);
    const itemsPerPage = 10; // Number of items to show per page



    useEffect(() => {
        const alertMessage = localStorage.getItem('alertMessage');
        if (alertMessage) {
          toast.success(alertMessage);
          localStorage.removeItem('alertMessage');
        }
        const GetData = async () => {
          try {
            if (props.stagiaires) {
              setStagiaires(props.stagiaires);
            }
            // } else {
            //   const data = await GetStagiaires(year);
            //   setStagiaires(data);
            // }
            setIsLoading(false);
          } catch (error) {
            console.log('Error:', error);
            setIsLoading(false);
          }
        };
        GetData();
      }, [props.stagiaires]);
    
    const refreshData = () => {
        console.log('one request')
            setIsLoading(true);
            GetStagiairesByGroupeId(props.groupe)
              .then(data => {
                setStagiaires(data);
              })
              .catch(error => {
                console.log(error);
              })
              .finally(() => {
                setIsLoading(false);
              });
      };

    const handleUpdate = (e, stu) => {
        e.preventDefault();
        setEditModalShow(true);
        setEditStudent(stu);
    };
    const handleAdd = (e) => {
        e.preventDefault();
        setAddModalShow(true);
    };

    const handleDelete = (e, id) => {
        if (window.confirm('Êtes-vous sûr ?')) {
            e.preventDefault();
            DeleteStagiaire(id)
                .then((result) => {
                    toast.success(result);
                    refreshData();
                },
                    (error) => {
                        toast.error("la suppression est échoué");
                    })
        }
    };

    
    const DeactivateStagiaire = async (id) => {
        try {
          const result = await PutDeactivateStagiaire(id);
          toast.success(result);
          setIsLoading(true);
          GetStagiairesByGroupeId(props.groupe)
            .then(data => {
              setStagiaires(data);
            })
            .catch(error => {
              console.log(error);
            })
            .finally(() => {
              setIsLoading(false);
            });
        } catch (error) {
          toast.error('Erreur du serveur');
          console.log(error);
        }
      };

  
    let AddModelClose = () => setAddModalShow(false);
    let EditModelClose = () => setEditModalShow(false);

    // Pagination
    const totalPages = Math.ceil(stagiaires.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, stagiaires.length);

    const getItemProps = (index) => ({
        variant: currentPage === index ? "filled" : "text",
        color: currentPage === index ? "green" : "",
        onClick: () => setCurrentPage(index),
        className: "rounded-full w-8 h-8 flex items-end justify-center", // Adjust the width and height here
        displayPage: index + 1, // Add 1 to the index to display the page number starting from 1
    });


    // Previous and Next functions
    const prev = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    const next = () => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));

    // Pagination buttons array
    const paginationButtons = Array.from({ length: totalPages }, (_, index) => index);


    if (isLoading) {
        return (
            <LoadingSpinner />
        );
    }
    return (
                    <>
                    {stagiaires.length === 0 ? (
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
        <div className="px-4 py-12 sm:px-auto lg:px-8 ">
            <div className="relative overflow-x-auto overflow-y-auto shadow-md border-1 border-gray-200 rounded">
                {/* Pagination */}
                {stagiaires.length > itemsPerPage && (
                    <div className="h-12 m-2 grid grid-cols-9 content-center">
              <p className="self-center font-semibold text-gray-500">
              Total  {stagiaires.length }</p>
                        <Button
                            variant="text"
                            color="cayan"
                            className="flex items-center justify-end gap-2 rounded-full"
                            onClick={prev}
                            disabled={currentPage <= 0} // Disable if currentPage is less than or equal to 0
                        >
                            <span aria-hidden="true">&laquo;</span>
                        </Button>
                        <div className="flex col-span-5 items-center justify-center">
                            {paginationButtons.map((index) => (
                                <IconButton {...getItemProps(index)} key={index}>
                                    {getItemProps(index).displayPage}
                                </IconButton>
                            ))}
                        </div>
                        <Button
                            variant="text"
                            color="cyan"
                            className="flex items-center gap-2 rounded-full"
                            onClick={next}
                            disabled={currentPage >= totalPages - 1} // Disable if currentPage is greater than or equal to totalPages - 1
                        >
                            <span aria-hidden="true" >
                                &raquo;
                            </span>
                        </Button>
                        <div class="relative m-1 flex w-full flex-wrap justify-end items-stretch">
                            <button onClick={handleAdd}
          className="w-full rounded bg-primary-500 py-2 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
          >Ajouter stagiaiare
                            </button>
                            <AddStudentModal refresh={refreshData} show={addModalShow}  onHide={AddModelClose} ></AddStudentModal>
                        </div>
                    </div>
                )}
                <table className="w-full text-md text-sm font-light ">
                <thead className="text-xs text-white uppercase bg-green-500 shadow-md ">
                        <tr >
                            <th class="px-6">
                                Matricule
                            </th>
                            <th class="px-auto ">
                                Nom
                            </th>
                            <th class="px-auto ">
                                Prénom
                            </th>
                            <th class="px-auto ">
                                CIM
                            </th>
                            <th class="px-auto ">
                                Telephone
                            </th>
                            <th class="px-4 ">
                                Email
                            </th>
                            <th class="px- ">
                                Groupe
                            </th>
                            <th class="px-4 ">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {stagiaires.slice(startIndex, endIndex).map((item, index) => {
                            return (
                                <tr key={index} className={`${item.actif ? 'hover:bg-gray-200 dark:hover:bg-gray-600' : 'bg-yellow-300'}`}>
                                    <td class="px-auto ">
                                        <span>
                                            <img class="h-8 w-auto rounded-full inline-block m-1" src="studentold.png" alt="" />
                                        </span>
                                        {item.matricule}
                                    </td>
                                    <td class="px-auto ">
                                        {item.nom}
                                    </td>
                                    <td class="px-auto ">
                                        {item.prenom}
                                    </td>
                                    <td class="px-auto ">
                                        {item.cin}
                                    </td>
                                    <td class="px-auto ">
                                        {item.tel}
                                    </td>
                                    <td class="px-4 ">
                                        {item.email}
                                    </td>
                                    <td class="px-4 ">
                                        {item.groupe}
                                    </td>
                                    <td class="px-4" style={{ 'color': '#6590D5' }}>
                                    {item.actif ? (
                                    <button
                                    onClick={() => DeactivateStagiaire(item.id)} title="Cliquez pour D">
                                    <FontAwesomeIcon icon={faEraser} />                                    
                                    </button>
                                ) : (
                                    <button
                                    onClick={() => DeactivateStagiaire(item.id, item.type)} title="Cliquez pour Donner l'autorisation de la modification.">
                                    <FontAwesomeIcon icon={faRotateLeft} size="lg" style={{'color':'#6590D5'}} />
                                    </button>
                                )}
                                        <button className="focus:outline-none mx-2" onClick={event => handleDelete(event, item.id)}>
                                            <FontAwesomeIcon icon={faTrashCan} size="lg" />
                                        </button>

                                        <button className="focus:outline-none mx-2" onClick={event => handleUpdate(event, item.id)}>
                                            <FontAwesomeIcon icon={faEdit} size="lg" />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                        <UpdateStudentModal show={editModalShow} id={editStudent} 
                         refresh={refreshData}  onHide={EditModelClose}></UpdateStudentModal>
                    </tbody>
                </table>
            </div>
        </div>)}
        </>
    );

}