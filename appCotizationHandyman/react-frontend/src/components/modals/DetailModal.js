import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DetailModal = ({ show, handleClose, companyData }) => {
    if (!companyData) return null;

    const formatDetails = (details) => {
        return { __html: details.replace(/\n/g, '<br />') };
    };

    return (
        <Modal show={show} onHide={handleClose} className="custom-modal">
            <Modal.Header closeButton>
                <Modal.Title>Company Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <strong>Company Name:</strong> {companyData.company_name}
                </div>
                <div>
                    <strong>Contact Name:</strong> {companyData.contact_name}
                </div>
                <div>
                    <strong>Phone:</strong> {companyData.phone}
                </div>
                <div>
                    <strong>Skills:</strong> {companyData.skills}
                </div>
                <div>
                    <strong>Creation date:</strong> {companyData.creation_date}
                </div>
                <div>
                    <strong>Date of Contact:</strong> {companyData.date_of_contact}
                </div>
                <div>
                    <strong>Date Start Works:</strong> {companyData.date_start_works}
                </div>
                <div>
                    <strong>Working Time:</strong> {companyData.working_time}
                </div>
                <div>
                    <strong>Meeting:</strong> {companyData.meeting}
                </div>
                <div>
                    <strong>Average Price:</strong> {companyData.average_price}
                </div>
                <div>
                    <strong>Final Price:</strong> {companyData.final_price}
                </div>
                <div>
                    <strong>Workplace:</strong> {companyData.workplace}
                </div>
                <div>
                    <strong>Methods of Payment:</strong> {companyData.methods_of_payment}
                </div>
                <div>
                    <strong>Work Method:</strong> {companyData.work_method}
                </div>
                <div>
                    <strong>Quote:</strong> {companyData.quote}
                </div>
                <div>
                    <strong>Year of Experience:</strong> {companyData.years_of_experience}
                </div>
                <div>
                    <strong>State:</strong> {companyData.state ? companyData.state.name : 'N/A'}
                </div>
                <div>
                    <strong>Online View:</strong> {companyData.online_view}
                </div>
                <div>
                    <strong>On-Site View:</strong> {companyData.on_site_view}
                </div>
                <div>
                    <strong>Rating:</strong> {companyData.rating ? companyData.rating.classification : 'N/A'}
                </div>
                <div>
                    <strong>Link:</strong> <a href={companyData.link} target="_blank" rel="noopener noreferrer">Company Link</a>
                </div>
                <div>
                <strong>Details:</strong> <div dangerouslySetInnerHTML={formatDetails(companyData.details)} />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DetailModal;
