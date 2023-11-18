import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const RemarkModal = ({ customerName }) => {
  const [show, setShow] = useState(false);
  const [remark, setRemark] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/get/${id}`)
      .then((resp) => {
        const data = resp.data[0];
        setRemark(data.remark);
      })
      .catch((err) => toast.error(err.response.data));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!remark) {
      toast.error("Please provide a value in the input field");
    } else {
      axios
        .put(`http://localhost:5000/api/update/${id}`, {
          remark,
        })
        .then(() => {
          setRemark(remark); // Update remark state
          toast.success("Remarks Updated Successfully");
          handleClose();
        })
        .catch((err) => toast.error(err.response.data));
    }
  };

  return (
    <>
      <button href="#" className='btn remark' onClick={handleShow}>
        <i className="fa fa-sticky-note"></i>
      </button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Remarks for {customerName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="Update remarks..."
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
            <Button variant="primary" type="submit">
              Save
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RemarkModal;
