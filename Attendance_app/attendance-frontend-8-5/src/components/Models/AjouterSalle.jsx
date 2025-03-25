import React, { useState, useEffect } from "react";
import { Modal, Col, Row, Form, Button } from 'react-bootstrap';
import { PostSalles } from '../../interceptors/api';
import { toast } from 'react-toastify';

export default function AddSalleModal(props) {
  const year = localStorage.getItem('year');

  const handleSubmit = (e) => {
    e.preventDefault();
    PostSalles(e.target, year)
      .then((result) => {
        toast.success(result);
        window.location.reload();
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
            Ajouter Salle
          </Modal.Title>

        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="nom">
              <Form.Label>Titulier</Form.Label>
              <Form.Control type="text" name="nom" required placeholder="" />
            </Form.Group>
            <Form.Group controlId="type">
              <Form.Label>Département</Form.Label>
              <Form.Control type="text" name="type" required placeholder="" />
            </Form.Group>
            <Form.Group className="float-right my-2 ">
            <Button className='bg-blue-500 px-5' type="submit" >
                Ajouter
              </Button>
            </Form.Group>
          </Form>
          <Modal.Footer>
                <button  className="" onClick={props.onHide}>
                                    Fermer
                    </button>
                </Modal.Footer>
        </Modal.Body>
      </Modal>

  );
};
