import React from "react";
import { useState, useEffect } from 'react';
import { GetFilieres, PostGroupes } from '../../interceptors/api';
import {Modal, Col, Row, Form, Button,} from 'react-bootstrap';
import { toast } from 'react-toastify';


const AddGroupetModal = (props) => {
  const year = localStorage.getItem('year');
  const [filieres, setFilieres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetFilieres(year);
        setFilieres(data);
        setIsLoading(false);
      } catch (error) {
        console.log('Error:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [])
  const handleSubmit = (e) => {
    e.preventDefault();
    PostGroupes(e.target, year)
      .then((result) => {
        toast.success(result);
        props.setUpdated(true);
      },
        (error) => {
          toast.error("Server erreur");

        })
  }

  return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered >

        <Modal.Header >
          <Modal.Title id="contained-modal-title-vcenter">
            Ajouter Groupe
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="nom">
              <Form.Label>Nom de groupe</Form.Label>
              <Form.Control type="text" name="nom" required placeholder="" />
            </Form.Group>
            <Form.Group controlId="filiere">
              <Form.Label>Nom de la filière</Form.Label>
                <Form.Select name="filiere">
                  <option defaultValue>Selectionner filière</option>
                  {filieres.map(item => {
                    return (
                      <option value={item.id}>{item.nom}</option>)
                  })}
                </Form.Select>
            </Form.Group>
              <Form.Group className="float-right my-2">
              <Button className='bg-blue-500 px-5' type="submit" >
                  Ajouter
                </Button>
              </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
                <button  className="" onClick={props.onHide}>
                                    Fermer
                    </button>
                </Modal.Footer>
      </Modal>
);
};
export default AddGroupetModal;
