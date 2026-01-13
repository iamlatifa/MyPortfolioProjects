import React from 'react';
import { Modal } from 'react-bootstrap';
import { Table } from 'react-bootstrap';



export default function DetailsRetard(props) {

    return (
        <div className="container">
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        Details Retard
                    </Modal.Title>

                </Modal.Header>
                <Modal.Body>
                <Table className='bg-sky-300 text-white'>
                <thead>
                    <tr>
                    <th className="px-auto py-2">
                        Nom de Formateur
                    </th>
                    <th className="px-auto py-2">
                        Date
                    </th>
                    <th className="px-auto py-2">
                        Séance
                    </th>
                    <th className="px-auto py-2">
                        Temp en retard
                    </th>
                    <th className="px-auto py-2">
                        Observation
                    </th>
                    </tr>
                </thead>
                <tbody>
                    {props.data.map((item, index) => (
                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-2 text-gray-900">
                         {item.formateur}
                        </td>
                        <td className="px-6 py-2 text-gray-900">
                        {item.date}
                        </td>
                        <td className="px-6 py-2 text-gray-900">
                        {item.seance_debut}-{item.seance_fin}
                        </td>
                        <td className="px-auto py-2 text-gray-900">
                        {item.retard_temps+' min'}
                        </td>
                        <td className="px-auto py-2 text-gray-900">
                        {item.observation ? item.observation : "-"}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </Table>

                </Modal.Body>
                <Modal.Footer>
                <button  className="hover:text-red" onClick={props.onHide}>
                                    Fermer
                    </button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};


