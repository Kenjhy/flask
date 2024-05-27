import React, { useState, useEffect  } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addCompany, getStates, getRatings  } from '../../services/api';
import { FormFields } from '../FormFields';
import { formatCurrency } from '../../utils/currencyFormatter';
import { handleInputChange, handleImageChange } from '../../utils/formHelpers';

const AddCompanyModal = ({ show, handleClose, refreshCompanies }) => {
    const [formData, setFormData] = useState({
        image_base64: '',
        company_name: '',
        contact_name: '',
        phone: '',
        skills: '',
        date_of_contact: '',
        date_start_works: '',
        working_time: '',
        meeting: '',
        average_price: '',
        final_price: '',
        workplace: '',
        methods_of_payment: '',
        work_method: '',
        quote: '',
        state_id: '',
        online_view: '',
        on_site_view: '',
        rating_id: '',
        link: '',
        details: ''
    });

    const [states, setStates] = useState([]);
    const [ratings, setRatings] = useState([]);

    useEffect(() => {
        if (show) {
            getStates().then(response => {
                setStates(response.data);
                setFormData(formData => ({ ...formData, state_id: '' }));  // Set state_id to empty for default non-selection
            });
            getRatings().then(response => {
                setRatings(response.data);
                setFormData(formData => ({ ...formData, rating_id: '' }));
            });
        }
    }, [show]);  // Dependency on show to reload states when modal opens
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await addCompany({
                ...formData,
                average_price: formData.average_price.replace(/[^0-9]/g, ''),
                final_price: formData.final_price.replace(/[^0-9]/g, ''),
                image_base64: formData.image_base64 // Send as base64
            });
            if (response.status === 200 || response.status === 201) {
                refreshCompanies();
                handleClose();
            }
            
        } catch (error) {
            console.error('Error adding company:', error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} className="custom-modal">
            <Modal.Header closeButton>
                <Modal.Title>Add New Company</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <FormFields
                        formData={formData}
                        handleInputChange={(e) => handleInputChange(e, setFormData, formatCurrency)}
                        handleImageChange={(e) => handleImageChange(e, setFormData)}
                        states={states}
                        ratings={ratings}
                    />
                    <Button variant="primary" type="submit">
                        Add Company
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddCompanyModal;