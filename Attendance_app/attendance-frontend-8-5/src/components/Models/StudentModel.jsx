import React, { useEffect, useState } from 'react';
import { Modal} from 'react-bootstrap';
import { Table } from 'react-bootstrap';

export default function StudentModal(props) {

    const year = localStorage.getItem('year');

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     GetStudents(props.student.studentId, e.target)
    //     .then((result)=>{
    //         alert(result);
    //         props.setUpdated(true);
    //     },
    //     (error)=>{
    //         alert("Failed to Update Student");
    //     })
    // };


    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             // const data = await GetSalles();
    //             // setSalles(data);
    //             if (props.data) {
    //                 setStagiaires(props.data);
    //                 console.log(stagiaires)
    //                 //   const RetarOrAbs = stagiaires.filter((stagiaire) => {
    //                 //     return stagiaire.id === props.data.id && stagiaire.type === props.data.type;                    })
    //                 // console.log(RetarOrAbs);
    //             } else {
    //                 const data2 = await GetStagiaires(year);
    //                 setStagiaires(data2);
    //             }
    //             setIsLoading(false);
    //         } catch (error) {
    //             console.log('Error:', error);
    //             setIsLoading(false);
    //         }
    //     };
    //     fetchData();
    // }, []);

    return (
        <div className="container">
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        stagiaire absent
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table className='bg-ista-green text-white ' >
                        <thead >
                            <tr>
                                <th class="px-auto py-2">
                                    nom et prénom
                                </th>
                                <th class="px-auto py-2">
                                    état 
                                </th>
                                <th class="px-auto py-2">
                                    time retards
                                </th>
                                <th class="px-auto py-2">
                                    observation
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.data.map((item,index) => {
                                return (
                                    <tr key={index} className="bg-white border-b  hover:bg-gray-50 ">
                                        <td className="px-6 py-4 text-gray-900" >
                                            {console.log('item')}
                                        </td>
                                        <td className="px-auto py-2 text-gray-900" >
                                            {item.nom}
                                        </td>
                                        <td className="px-auto py-2 text-gray-900" >
                                        </td>
                                        <td className="px-auto py-2 text-gray-900" >
                                        </td>
                                    </tr>)
                            })}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
            <Modal.Footer>
                <button  className="" onClick={props.onHide}>
                                    Fermer
                    </button>
                </Modal.Footer>
        </div>
    );
};


