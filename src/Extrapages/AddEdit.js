import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./AddEdit.css";
import axios from "axios";
import { toast } from "react-toastify";

const formStyle = {
  display: "flex",
  flexDirection: "column",
  width: "300px",
  margin: "0 auto",
};

const inputStyle = {
  marginBottom: "10px",
  padding: "8px",
  fontSize: "16px",
};

const buttonStyle = {
  backgroundColor: "#007BFF",
  color: "white",
  padding: "10px",
  fontSize: "18px",
  cursor: "pointer",
};
const buttonStyle1 = {
  backgroundColor: "black",
  color: "white",
  padding: "10px",
  fontSize: "18px",
  width: "300px",
  cursor: "pointer",
};

const initialState = {
  name: "",
  contact: "",
  doctor: "",
  appointmentDate: "",
  appointmentTime: "",
};

const AddEdit = () => {
  const [state, setState] = useState(initialState);

  const { name, contact, doctor, appointmentDate, appointmentTime } = state;

  const doctorList = ["Dr. Smith", "Dr. Johnson", "Dr. Lee", "Dr. Patel"];

  const [timeSlots, setTimeSlots] = useState([]); // State to hold time slots

  const navigate = useNavigate();

  const { id } = useParams();

  const generateTimeSlots = () => {
    const startTime = new Date("2023-01-01T09:00:00"); // Replace with your start time
    const endTime = new Date("2023-01-01T17:00:00"); // Replace with your end time
    const timeInterval = 30; // Time interval in minutes

    const slots = [];
    let currentTime = new Date(startTime);

    while (currentTime <= endTime) {
      slots.push(
        currentTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      currentTime = new Date(currentTime.getTime() + timeInterval * 60000);
    }

    setTimeSlots(slots);
  };

  useEffect(() => {
    generateTimeSlots();
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/get/${id}`)
      .then((resp) => {
        const data = resp.data[0];
        setState({
          ...data,
          // Convert the date string to a format compatible with the input type="date"
          appointmentDate: data.appointmentDate.split("T")[0],
          appointmentTime: data.appointmentTime,
        });
       
      })
      .catch((err) => toast.error(err.response.data));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !contact || !doctor || !appointmentDate || !appointmentTime) {
      toast.error("Please provide value into input field");
    } else {
      if (!id) {
        axios
          .post("http://localhost:5000/api/post", {
            // Updated to /api/post
            name,
            contact,
            doctor,
            appointmentDate,
            appointmentTime,
          })
          .then(() => {
            setState({ name: "", email: "", contact: "" });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Appointment added Successfully");
      } else {
        axios
          .put(`http://localhost:5000/api/update/${id}`, {
            // Updated to /api/update
            name,
            contact,
            doctor,
            appointmentDate,
            appointmentTime,
          })
          .then(() => {
            setState({
              name: "",
              contact: "",
              doctor: "",
              appointmentDate: "",
              appointmentTime: "",
            });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Appointment Updated Successfully");
      }

      setTimeout(() => {
        navigate("/admin"); // Use navigate as a function
      }, 500);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  return (
    <div>
      <div className="container11">
      <h2 className="text-center">Edit Appointment</h2>
      <form onSubmit={handleSubmit}>
        
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Your Name"
          value={state.name || ""}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="contact">Contact:</label>
        <input
          type="number"
          id="contact"
          name="contact"
          placeholder="Your Number"
          value={state.contact || ""}
          onChange={handleInputChange}
          required
        />

        {/* <label htmlFor="doctor">Doctor:</label>
        <input type="text" id="doctor" name="doctor" value={formData.doctor} onChange={handleChange} required /><br /><br /> */}
        
        <label htmlFor="doctor">Doctor:</label><select
          id="doctor"
          name="doctor"
          value={state.doctor}
          onChange={handleInputChange}
          required
        >
          <option value="">Select a doctor</option>
          {doctorList.map((doctor, index) => (
            <option key={index} value={doctor}>
              {doctor}
            </option>
          ))}
        </select>

        {/* <label htmlFor="appointmentDate">Appointment Date:</label>
        <input type="date" id="appointmentDate" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} required /><br /><br /> */}
        <label htmlFor="appointmentDate">Appointment Date:</label>
        <input
          type="date"
          id="appointmentDate"
          name="appointmentDate"
          value={state.appointmentDate}
          onChange={handleInputChange}
          required
          min={new Date().toISOString().split("T")[0]} // Set min attribute to current date
        />

        <label htmlFor="appointmentTime">appointmentTime:</label>
        <select
          id="appointmentTime"
          name="appointmentTime"
          value={state.appointmentTime}
          onChange={handleInputChange}
          required
        >
          <option value="">Select a time</option>
          {timeSlots.map((slot, index) => (
            <option key={index} value={slot}>
              {slot}
            </option>
          ))}
        </select>

        <button type="submit">Book Appointment</button>
        <Link to={"/admin"}>
          <input type="button" className="btn btn-dark" value="Go Back"></input>
        </Link>
      </form>
      </div>
    </div>
  );
};

export default AddEdit;
