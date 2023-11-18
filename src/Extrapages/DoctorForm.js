import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import UserDataDisplay from "./UserDataDisplay";
import "./DoctorForm.css";

const Appointment = () => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    doctor: "",
    appointmentDate: "",
    appointmentTime: "", // New state to store selected time slot
    remark: "",
  });
  const componentPDF = useRef();
  const [submittedData, setSubmittedData] = useState(null);
  

  const componentRef = useRef();
  const doctorList = ["Dr. Smith", "Dr. Johnson", "Dr. Lee", "Dr. Patel"];

  const [timeSlots, setTimeSlots] = useState([]); // State to hold time slots

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      const textOnly = value.replace(/[^A-Za-z\s]/gi, "");
      setFormData((prevData) => ({
        ...prevData,
        [name]: textOnly,
      }));
      return;
    }

    if (name === "contact") {
      // Allow only digits and limit to 10 characters
      const onlyDigits = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prevData) => ({
        ...prevData,
        [name]: onlyDigits,
      }));
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/post",
        formData
      );
      console.log(response.data);
      alert("Appointment booked successfully");
      // Handle success or show a confirmation message
      setSubmittedData(formData);

      setFormData({
        name: "",
        contact: "",
        doctor: "",
        appointmentDate: "",
        appointmentTime: "",
        remark: "",
      });
    } catch (error) {
      console.error("Error:", error.response.data);
      alert("Failed to book appointment. " + error.response.data.message);
      // Display error message if slot is already booked or other error occurs
    }
  };

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: "Appointment Details",
    onAfterPrint: () => alert("Data saved in PDF"),
    
  });
  return (
    <div>
      {submittedData && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div ref={componentRef} style={{ marginTop: "100px" }}>
            <UserDataDisplay user={submittedData} />
          </div>
          <button onClick={generatePDF} style={{ alignSelf: "center" }}>
            Print
          </button>
        </div>
      )}
      <div class="container11">
        <h1>Book an Appointment</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="contact">Contact:</label>
          <input
            type="number"
            id="contact"
            name="contact"
            placeholder="Your Number"
            value={formData.contact}
            onChange={handleChange}
            required
          />

          {/* <label htmlFor="doctor">Doctor:</label>
        <input type="text" id="doctor" name="doctor" value={formData.doctor} onChange={handleChange} required /><br /><br /> */}
          <label htmlFor="doctor">Doctor:</label>
          <select
            type="text"
            id="doctor"
            name="doctor"
            value={formData.doctor}
            onChange={handleChange}
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
            value={formData.appointmentDate}
            onChange={handleChange}
            required
            min={new Date().toISOString().split("T")[0]} // Set min attribute to current date
          />

          <label htmlFor="appointmentTime">AppointmentTime:</label>
          <select
            type="time"
            id="appointmentTime"
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleChange}
            required
          >
            <option value="">select slot time</option>
            {timeSlots.map((slot, index) => (
              <option key={index} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          <label htmlFor="remark">Cause:</label>
          <input
            type="text"
            id="remark"
            name="remark"
            placeholder="Your Cause"
            value={formData.remark}
            onChange={handleChange}
            required
            maxLength="300"
          />

          <button type="submit">Book Appointment</button>
          <Link to={"/"}>
            <input
              type="button"
              className="btn btn-dark"
              value="Go Back"
            ></input>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Appointment;
