
const bcrypt = require('bcrypt');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Session } = require('express-session');
const session = require('express-session');



const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "8985823867Ram@",
  database: "crud_contact",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());





// app.get("/api/getAppointments", (req, res) => {
//   const { doctor } = req.query;
 
//   if (!doctor) {
//     return res.status(400).json({ error: "Doctor is required" });
//   }
 
//   console.log("Selected Doctor:", doctor); // Add this line for logging
 
//   const sqlGetAppointments = "SELECT * FROM appointments WHERE doctor = ?";
//   db.query(sqlGetAppointments, doctor, (error, result) => {
//     if (error) {
//       console.log(error);
//       res.status(500).json({ error: "Internal Server Error" });
//     } else {
//       res.status(200).json(result);
//     }
//   });
// });

app.post('/api/post', (req, res) => {
  const { name, contact, doctor, appointmentDate, appointmentTime, remark } = req.body;
 
  // Check if the slot is already booked for the selected date and time
  db.query(
    'SELECT * FROM appointments WHERE doctor= ? AND appointmentDate = ? AND appointmentTime = ?',
    [doctor, appointmentDate, appointmentTime],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to check existing bookings' });
      } else {
        if (results.length > 0) {
          res.status(409).json({ message: 'Slot is already booked or full' });
        } else {
          const sqlInsert =
            'INSERT INTO appointments (name, contact, doctor, appointmentDate, appointmentTime, remark) VALUES (?, ?, ?, ?, ?, ?)';
 
          db.query(
            sqlInsert,
            [name, contact, doctor, appointmentDate, appointmentTime, remark],
            (insertError, insertResult) => {
              if (insertError) {
                console.error(insertError);
                res.status(500).json({ message: 'Failed to book appointment' });
              } else {
                res.status(201).json({ message: 'Appointment booked successfully' });
              }
            }
          );
        }
      }
    }
  );
});

app.put("/api/update/:id", (req, res) => {
  const { id } = req.params;
  const { remark } = req.body;

  // Update the data in the MySQL database
  const sqlUpdate = 'UPDATE appointments SET remark = ? WHERE id = ?';

  db.query(sqlUpdate, [remark, id], (err, result) => {
    if (err) {
      console.error('Error updating remarks:', err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Remarks updated successfully:', result);
      res.status(200).send('Remarks updated successfully');
    }
  });
});



// app.post('/register', (req, res) => {
//   const { name, email, password } = req.body;

//   // Hash the password before storing it in the database
//   bcrypt.hash(password, 10, (err, hash) => {
//     if (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Error hashing the password' });
//       return;
//     }

//     const sql = 'INSERT INTO login (name, email, password) VALUES (?, ?, ?)';
//     db.query(sql, [name, email, hash], (err, result) => {
//       if (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Error registering the user' });
//         return;
//       }
//       res.status(201).json({ message: 'User registered successfully' });
//     });
//   });
// });

// Create a login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM login WHERE email = ?', email, (err, results) => {
    if (err) {
      res.status(500).send('Error logging in.');
    } else {
      if (results.length > 0) {
        // req.session.username = result[0].username;
      
        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (isMatch) {
            res.status(200).send('Login successful!');
          } else {
            res.status(401).send('Incorrect email or password.');
          }
        });
      } else {
        res.status(401).send('Incorrect email or password.');
      }
    }
  });
});

  




app.get("/api/get", (req, res) => {
  const sqlGet = "SELECT * FROM appointments";
  db.query(sqlGet, (error, result) => {
    res.send(result);
  });
});

// app.post("/api/post", (req, res) => {
//   const { name, contact, doctor, appointmentDate, appointmentTime, isBooked } = req.body;
//   const sqlInsert =
//     "INSERT INTO appointments (name, contact, doctor, appointmentDate, appointmentTime, isBooked) VALUES(?, ?, ?, ?, ?, ?)";
//   db.query(sqlInsert, [name, contact, doctor, appointmentDate, appointmentTime, isBooked ], (error, result) => {
//     if (error) {
//       console.log(error);
//     }
//   });
// });
app.delete("/api/delete/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM appointments WHERE id=?";
  db.query(sqlRemove, id, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
});
app.get("/api/get/:id", (req, res) => {
  const { id } = req.params;
  const sqlGet = "SELECT * FROM appointments WHERE id = ?";
  db.query(sqlGet, id, (error, result) => {
    if (error) {
      console.log(error);
    }
    res.send(result);
  });
});
app.put("/api/update/:id", (req, res) => {
  const { id } = req.params;
  const { name, contact, doctor, appointmentDate,appointmentTime } = req.body;
  const sqlUpdate =
    "UPDATE appointments SET name = ?, contact = ?, doctor = ?, appointmentDate = ?, appointmentTime = ? WHERE id = ? ";
  db.query(sqlUpdate, [name, contact, doctor, appointmentDate, appointmentTime, id], (error, result) => {
    if (error) {
      console.log(error);
    }
    res.send(result);
  });
});

app.get("/", (req, res) => {
  // const sqlInsert =
  //   "INSERT INTO appointments (name, contact, doctor, appointmentDate, appointmentTime) VALUES('vinay', '8987607876','dr.rahim', '2023-09-27', '15:00' )";
  // db.query(sqlInsert, (error, result) => {
  //   console.log("error", error);
  //   console.log("result", result);
  //   res.send("Hello Express");
  // });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
