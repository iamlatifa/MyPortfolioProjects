import React, { useState, useEffect } from "react";
import {  GetFiliereById, GetAnnee, PutFilieres } from '../../interceptors/api';
import { Modal, Form, Button, } from 'react-bootstrap';
import { toast } from 'react-toastify';


export default function UpdateFiliereModal(props) {
    const [editfiliere, setEditfiliere] = useState(null);
    const [nom, setNom] = useState('');
    const [code, setCode] = useState('');
    const [years, setYears] = useState([]);
    const oldyear = localStorage.getItem('year');
    const [annee, setAnnee] = useState(oldyear);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await GetFiliereById(props.id);
          const data2 = await GetAnnee();
          setYears(data2)
          setEditfiliere(data[0]);
          setNom(data[0].nom || '');
          setCode(data[0].codefiliere || '');
        } catch (error) {
          console.log('Error:', error);
        }
      };
      if (props.show) {
        fetchData();
      }
    }, [props.id]);
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      PutFilieres(props.id, {
        nom,
        code,
        annee,
      })
        .then((result) => {
          toast.success(result);
          props.setUpdated(true);
          props.onHide();
          setAnnee(oldyear)
        })
        .catch((error) => {
          toast.error("Server error");
        });
    };
    return (

            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        Modifier Filière
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body >
                {editfiliere && (
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="nom">
                            <Form.Label>Nom de la filière</Form.Label>
                            <Form.Control  value={nom} type="text" onChange={(e) => setNom(e.target.value)} required />
                        </Form.Group>
                        <Form.Group controlId="code">
                            <Form.Label>filière abréviation</Form.Label>
                            <Form.Control value={code} type="text" onChange={(e) => setCode(e.target.value)} required />
                        </Form.Group>
                        <Form.Group controlId="annee">
                        <Form.Label> Annee Scolaire</Form.Label>
                        <Form.Control as="select" value={annee} onChange={(e) => setAnnee(e.target.value)} required>
                            {years.map((item) => (
                                <option key={item.id} value={item.id}>{item.annee}</option>
                            ))}
                        </Form.Control>
                        </Form.Group>
                        <Modal.Footer>
                        <Button className='bg-blue-500 px-5' type="submit" >
                          Modifier
                        </Button>
                        </Modal.Footer>
                    </Form>
                )}
                </Modal.Body>
                <Modal.Footer>
                <button  className="" onClick={props.onHide}>
                                    Fermer
                    </button>
                </Modal.Footer>
 
            </Modal>
            );
};
