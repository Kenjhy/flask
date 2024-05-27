import React from 'react';
import { Form } from 'react-bootstrap';

export const FormFields = ({ formData, handleInputChange, handleImageChange, states, ratings }) => {
    const fields = [
        { label: 'Image:', name: 'image_base64', type: 'file', changeHandler: handleImageChange },
        { label: 'Company Name:', name: 'company_name', type: 'text', required: true },
        { label: 'Contact Name:', name: 'contact_name', type: 'text' },
        { label: 'Phone:', name: 'phone', type: 'text' },
        { label: 'Skills:', name: 'skills', type: 'text' },
        { label: 'Date of Contact:', name: 'date_of_contact', type: 'date' },
        { label: 'Date Start Works:', name: 'date_start_works', type: 'date' },
        { label: 'Working Time:', name: 'working_time', type: 'number' },
        { label: 'Meeting:', name: 'meeting', type: 'datetime-local' },
        { label: 'Average Price:', name: 'average_price', type: 'text' },
        { label: 'Final Price:', name: 'final_price', type: 'text' },
        { label: 'Workplace:', name: 'workplace', type: 'text' },
        { label: 'Methods of Payment:', name: 'methods_of_payment', type: 'text' },
        { label: 'Work Method:', name: 'work_method', type: 'text' },
        { label: 'Link:', name: 'link', type: 'url' },
        { label: 'Details:', name: 'details', type: 'textarea' }
    ];

    return (
        <>
            {fields.map(field => (
                <Form.Group key={field.name} className="custom-form-group">
                    <Form.Label>{field.label}</Form.Label>
                    <Form.Control
                        type={field.type}
                        name={field.name}
                        required={field.required || false}
                        onChange={field.changeHandler || handleInputChange}
                        value={field.type === 'file' ? undefined : formData[field.name]} // Ensure value is not set for file input
                        as={field.type === 'textarea' ? 'textarea' : 'input'}
                        rows={field.type === 'textarea' ? 3 : undefined}
                    />
                </Form.Group>
            ))}
            <Form.Group className="custom-form-group">
                <Form.Label>Quote</Form.Label>
                <Form.Control as="select" name="quote" value={formData.quote} onChange={handleInputChange}>
                    <option value="">Select an option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </Form.Control>
            </Form.Group>
            <Form.Group className="custom-form-group">
                <Form.Label>Online View</Form.Label>
                <Form.Control as="select" name="online_view" value={formData.online_view} onChange={handleInputChange}>
                    <option value="">Select an option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </Form.Control>
            </Form.Group>
            <Form.Group className="custom-form-group">
                <Form.Label>On Site View</Form.Label>
                <Form.Control as="select" name="on_site_view" value={formData.on_site_view} onChange={handleInputChange}>
                    <option value="">Select an option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </Form.Control>
            </Form.Group>
            <Form.Group className="custom-form-group">
                <Form.Label>State</Form.Label>
                <Form.Control as="select" name="state_id" value={formData.state_id} onChange={handleInputChange}>
                    <option value="">Select a State</option>
                    {states.map(state => (
                        <option key={state.id} value={state.id}>{state.name}</option>
                    ))}
                </Form.Control>
            </Form.Group>
            <Form.Group className="custom-form-group">
                <Form.Label>Rating</Form.Label>
                <Form.Control as="select" name="rating_id" value={formData.rating_id} onChange={handleInputChange}>
                    <option value="">Select a Rating</option>
                    {ratings.map(rating => (
                        <option key={rating.id} value={rating.id}>{rating.classification}</option>
                    ))}
                </Form.Control>
            </Form.Group>
        </>
    );
};
