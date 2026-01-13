import React, { useState ,useEffect} from "react";
import {Modal, Col, Row, Form, Button} from 'react-bootstrap';
import {PostFilieres} from '../../interceptors/api'
import { toast } from 'react-toastify';

export default function AddFiliereModal (props) {
  const year = localStorage.getItem('year');
  const handleSubmit = (e) => {
    e.preventDefault();
    PostFilieres(e.target, year)
    .then((result)=>{
        toast.success(result);
        props.setUpdated(true);
    },
    (error)=>{
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
                        Ajouter Filiére
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="show-grid">    
                
        <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="FirstName">
                                    <Form.Label>Nom de la filiere</Form.Label>
                                    <Form.Control type="text" name="nom" required placeholder="" />
                            </Form.Group>
                            <Form.Group controlId="LastName">
                                    <Form.Label>Code de la filiere</Form.Label>
                                    <Form.Control type="text" name="code" required placeholder="" />
                            </Form.Group>
                            <Form.Group className="float-right my-2">
                <Button variant="success" type="submit" className="px-5">
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
            </Modal> );
};
