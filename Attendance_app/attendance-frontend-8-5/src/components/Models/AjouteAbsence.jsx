import React from 'react';
import {Modal,Form, Button} from 'react-bootstrap';
// import {FormControl, FormGroup, FormLabel} from 'react-bootstrap';
import { PostAbsence } from '../../interceptors/api-';
import { toast } from 'react-toastify';


const AddabsenceModal = (props) => {
    console.log('props:',props)
    const handleSubmit = (e) => {
        e.preventDefault();
        PostAbsence(e.target)
        .then((result)=>{
            toast.success(result);
            props.setUpdated(true);
        },
        (error)=>{
            toast.error("Échec de l'ajout, veuillez réviser les informations que vous avez saisie");
        })
    }

    return(
        <div className="container">

            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                      
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="FirstName">
                                    <Form.Label>Type</Form.Label>
                                    <Form.Control type="text" name="FirstName" required placeholder="" />
                            </Form.Group>
                            <Form.Group controlId="LastName">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control type="text" name="LastName" required placeholder="" />
                            </Form.Group>
                            <Form.Group>
                                <p></p>
                                <Button variant="primary" type="submit">
                                    Ajouter
                                </Button>
                            </Form.Group>
                            </Form>
                </Modal.Body>
                
            </Modal>
        </div>
    );
};

export default AddabsenceModal;