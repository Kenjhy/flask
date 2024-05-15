import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { addCompany } from '../../services/api';
// import '../../styles/ModalStyles.css'; // Adjust path based on new location


const AddCompanyModal = ({ show, handleClose, refreshCompanies }) => {
    const [formData, setFormData] = useState({
        image: '',
        company_name: '',
        contact_name: '',
        phone: '',
        skills: '',
        date_of_contact: '',
        date_start_works: '',
        working_time: '',
        meeting: '',
        hour_meet: '',
        average_price: '',
        final_price: '',
        workplace: '',
        methods_of_payment: '',
        work_method: '',
        quote: '',
        state: '',
        online_view: '',
        on_site_view: '',
        calification: '',
        link: '',
        details: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prevState => ({
                ...prevState,
                image: reader.result
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await addCompany({
                ...formData,
                image_base64: formData.image // Send as base64
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
                    {[
                        { label: 'Image:', name: 'image', type: 'file', changeHandler: handleImageChange },
                        { label: 'Company Name:', name: 'company_name', type: 'text', required: true },
                        { label: 'Contact Name:', name: 'contact_name', type: 'text' },
                        { label: 'Phone:', name: 'phone', type: 'text' },
                        { label: 'Skills:', name: 'skills', type: 'text' },
                        { label: 'Date of Contact:', name: 'date_of_contact', type: 'date' },
                        { label: 'Date Start Works:', name: 'date_start_works', type: 'date' },
                        { label: 'Working Time:', name: 'working_time', type: 'number' },
                        { label: 'Meeting:', name: 'meeting', type: 'date' },
                        { label: 'Hour Met:', name: 'hour_meet', type: 'text' },
                        { label: 'Average Price:', name: 'average_price', type: 'number' },
                        { label: 'Final Price:', name: 'final_price', type: 'number' },
                        { label: 'Workplace:', name: 'workplace', type: 'text' },
                        { label: 'Methods of Payment:', name: 'methods_of_payment', type: 'text' },
                        { label: 'Work Method:', name: 'work_method', type: 'text' },
                        { label: 'Quote:', name: 'quote', type: 'text' },
                        { label: 'State:', name: 'state', type: 'text' },
                        { label: 'Online View:', name: 'online_view', type: 'text' },
                        { label: 'On Site View:', name: 'on_site_view', type: 'text' },
                        { label: 'Calification:', name: 'calification', type: 'number' },
                        { label: 'Link:', name: 'link', type: 'url' },
                        { label: 'Details:', name: 'details', type: 'textarea' }                 
                    ].map(field => (
                        <div className="custom-form-group" key={field.name}>
                            <Form.Label>{field.label}</Form.Label>
                            <Form.Control
                                type={field.type}
                                name={field.name}
                                required={field.required || false}
                                onChange={field.changeHandler || handleInputChange}
                                as={field.type === 'textarea' ? 'textarea' : 'input'}
                                rows={field.type === 'textarea' ? 3 : undefined}
                            />
                        </div>
                    ))}
                    <Button variant="primary" type="submit">
                        Add Company
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddCompanyModal;
