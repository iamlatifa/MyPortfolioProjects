import React from "react";
import { useState,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrashCan,faEdit,faLoader} from '@fortawesome/free-solid-svg-icons';
import { GetGroupes ,DeleteGroupe} from '../interceptors/api';
import AddGroupetModal from '../components/Models/AjouterGroupe';
import UpdateGroupetModal from '../components/Models/ModifierGroupe';
import { toast } from 'react-toastify';
import LoadingSpinner from "./LoadingSpinner";
import { Button, IconButton } from "@material-tailwind/react";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";

export default function Groupe(){
    const [isLoading, setIsLoading] = useState(true);
    const [groupes, setGroupes] = useState([]);

    const [addModalShow, setAddModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [editStudent, setEditStudent] = useState([]);
    const [isUpdated, setIsUpdated] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Number of items to show per page

    useEffect(() => {
        const year = localStorage.getItem('year');

          const fetchData = async () => {
            try {
              const data = await GetGroupes(year);
              setGroupes(data);
              setIsLoading(false);
            } catch (error) {
              console.log('Error:', error);
              setIsLoading(false);
            }
          };
          fetchData();
      }, []);
    if (isLoading) {
      return (
        <LoadingSpinner />
      );
    }
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
  if(window.confirm('Êtes-vous sûr ?')){
      e.preventDefault();
      DeleteGroupe(id)
      .then((result)=>{
          toast.success(result);
          const updatedGroupes = groupes.filter((groupe) => groupe.id !== id);
          setGroupes(updatedGroupes);
      },
      (error)=>{
          toast.error("la suppression est échoué");
      })
  }
};

  let AddModelClose=()=>setAddModalShow(false);
  let EditModelClose=()=>setEditModalShow(false);

// Pagination
const totalPages = Math.ceil(groupes.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = Math.min(startIndex + itemsPerPage, groupes.length);

// ... Rest of the component

const getItemProps = (index) => ({
  variant: currentPage === index ? "filled" : "text",
  color: currentPage === index ? "green" : "blue",
  onClick: () => setCurrentPage(index),
  className: "rounded-full w-8 h-8 flex items-end justify-center",
  children: index === 0 ? "Page 1" : index, // Show "Page 1" for the first button (index 0)
});


// Previous and Next functions
const prev = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
const next = () => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages ));

// Pagination buttons array
const paginationButtons = Array.from({ length: totalPages }, (_, index) => index + 1);

    return(
      <>
      {groupes.length === 0 ? (
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
      <div className="relative overflow-x-auto shadow-md rounded m-2 ">
      <div className="relative overflow-x-auto border-1 border-gray-200 rounded-t">
{/* Pagination */}
{groupes.length > itemsPerPage && (
            <div className="h-10 m-2 grid grid-cols-5 content-center">
              <p className="self-center font-semibold text-gray-500">
                Total  {groupes.length }</p>
              <Button
                variant="text"
                color="cayan"
                className="col-start-2 items-center justify-end gap-2 rounded-full"
                onClick={prev}
                disabled={currentPage === 1}>
                <span aria-hidden="true">
                  <i class="fa-solid fa-arrow-left"></i>
                </span>
              </Button>
              <div className="flex col-start-3 items-center justify-center">
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
                className="col-start-4 items-center gap-2 rounded-full"
                onClick={next}
                disabled={currentPage === totalPages}
              >
                <span aria-hidden="true" >
                  <i className="fa-solid fa-arrow-right"></i>  </span>
              </Button>
              <div className="relative m-1 flex w-full flex-wrap justify-end items-stretch">
              <button onClick={handleAdd}
          className="w-1/2 rounded bg-primary-500 py-2 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
          style={{'color':'#6590D5'}}                      >
                      Ajouter Groupe
                    </button>
                    <AddGroupetModal show={addModalShow} setUpdated={setIsUpdated}
                onHide={AddModelClose}>
</AddGroupetModal>
                  </div>
            </div>
          )}
        </div>
        <table className="w-full text-md text-left text-gray-600 table-auto ">
          <thead className="text-xs text-white uppercase bg-green-500 shadow-md ">
            <tr >
                <th  className="px-6 py-1 ">
                   Id
                </th>
                <th  className="px-auto py-1">
                    Titulier
                </th>
                
                <th  className="px-auto py-1 text-start">
                    filiere
                </th>
                <th  className="px-auto py-1 text-center">
                Actions
                </th>
            </tr>
        </thead>
        <tbody>
        {groupes.slice(startIndex, endIndex).map((item, index) => {
            return(
              <tr className="bg-white border-b hover:bg-gray-200 dark:hover:bg-gray-600">
              <td className="px-6 py-1 ">
                    {item.id}
                </td>
                <td className="px-auto py-1">
                    {item.nom}
                </td>
                <td className="px-auto py-1">
                    {item.filiere}
                </td>
                <td className="px-auto  text-red-600 text-center" style={{'color':'#6590D5'}}>
                    <button className="focus:outline-none mx-5" onClick={event => handleDelete(event,item.id)}>
                    <FontAwesomeIcon icon={faTrashCan} size="lg"/> 
                    </button>
                
                <button className="focus:outline-none" onClick={e=>handleUpdate(e,item.id)}>
                <FontAwesomeIcon icon={faEdit} size="lg"/>
                </button>
                </td>
            </tr>
            )
        })}
            <UpdateGroupetModal show={editModalShow} id={editStudent} setUpdated={setIsUpdated}
                  onHide={EditModelClose}></UpdateGroupetModal> 
            
        </tbody>
    </table>
</div>)}
</>
);

}