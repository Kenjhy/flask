import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { updateCompany, getStates, getRatings } from '../../services/api';
import { FormFields } from '../FormFields';
import { formatCurrency } from '../../utils/currencyFormatter';
import { handleInputChange, handleImageChange } from '../../utils/formHelpers';

const EditCompanyModal = ({ show, handleClose, companyData, refreshCompanies, updateCompanies }) => {
    const [formData, setFormData] = useState({ ...companyData });
    const [states, setStates] = useState([]);
    const [ratings, setRatings] = useState([]);

    useEffect(() => {
        if (show) {
            getStates().then(response => {
                setStates(response.data);
                // Make sure that formData is updated only if companyData has changed.
                if (companyData) {
                    const updatedCompanyData = {
                        ...companyData,
                        meeting: companyData.meeting ? new Date(companyData.meeting + 'Z').toISOString().slice(0, 16) : '', // Ensure that the date is converted to UTC and formatted for datetime-local input,  datetime-local
                        state_id: companyData.state_id || ''  // Make sure to set state_id, might be undefined
                    };
                    setFormData(updatedCompanyData);
                }
            });
            getRatings().then(response => {
                setRatings(response.data);
                if (companyData) {
                    setFormData(formData => ({
                        ...formData,
                        rating_id: companyData.rating_id || ''
                    }));
                }
            });
        }
    }, [show, companyData]);


    const handleSubmit = async (event) => {
        event.preventDefault();
        updateCompany(companyData.id, {
            ...formData,
            average_price: typeof formData.average_price === 'string' ? formData.average_price.replace(/[^0-9]/g, '') : formData.average_price,
            final_price: typeof formData.final_price === 'string' ? formData.final_price.replace(/[^0-9]/g, '') : formData.final_price,
            image_base64: formData.image_base64 // Ensure image_base64 is sent
        })
        .then(response => {
            if (response.status === 200 || response.status === 201) { 
                updateCompanies({...companyData, ...formData}); // Call updateCompanies with the updated data
                refreshCompanies();  // Optional, if you want to make sure that you data is synchronized
                handleClose();
            }
        }).catch(error => console.error('Error updating company:', error));
        
    };

    return (
        <Modal show={show} onHide={handleClose} className="custom-modal">
            <Modal.Header closeButton>
                <Modal.Title>Edit Company</Modal.Title>
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
                        Update Company
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditCompanyModal;
