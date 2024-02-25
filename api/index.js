const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const moment = require("moment");
const fs = require("fs");
const bcrypt = require("bcrypt");


const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const MONGODB_URI = "mongodb+srv://test:test@cluster0.zfndztj.mongodb.net/loantracker?retryWrites=true&w=majority";

//mongodb+srv://sujan:sujan@cluster0.zv7uvht.mongodb.net/

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });

app.listen(port, () => {
  console.log("Server is running on port 8000");
});

const Employee = require("./models/employee");
const Attendance = require("./models/attendance");
const { Bank, User, Loan, Payment, UserBank } = require('./models/index');





app.get('/banks', async (req, res) => {
  try {
    const banks = await Bank.find();
    res.status(200).json(banks);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve the banks" });
  }
});

const randamSixDigitNumberGenerator = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const loanIdGenerator = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const prefix = 'LN';
  const idLength = 8;

  const generateRandomChar = () => {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters.charAt(randomIndex);
  };

  const generateRandomDigit = () => Math.floor(Math.random() * 10);

  let loanId = prefix;
  
  // Append characters and digits to the loan ID
  for (let i = 0; i < idLength; i++) {
    if (i % 2 === 0) {
      loanId += generateRandomChar();
    } else {
      loanId += generateRandomDigit();
    }
  }

  return loanId;
};

const transactionIdGenerator = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const prefix = 'TR';
  const idLength = 8;

  const generateRandomChar = () => {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters.charAt(randomIndex);
  };

  const generateRandomDigit = () => Math.floor(Math.random() * 10);

  let transactionId = prefix;
  
  // Append characters and digits to the transaction ID
  for (let i = 0; i < idLength; i++) {
    if (i % 2 === 0) {
      transactionId += generateRandomChar();
    } else {
      transactionId += generateRandomDigit();
    }
  }

  return transactionId;
};


const accountNumberGenerator = () => {
  const characters = '0123456789';
  const prefix = 'AC';
  const idLength = 12;
  
  const generateRandomDigit = () => Math.floor(Math.random() * 10);

  let accountNumber = prefix;

  // Append characters and digits to the account number
  for (let i = 0; i < idLength; i++) {
    accountNumber += generateRandomDigit();
  }

  return accountNumber;
}

const ifscCodeGenerator = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const prefix = 'IFSC';
  const idLength = 11;

  const generateRandomChar = () => {
    const randomIndex = Math.floor(Math.random() * characters.length);  
    return characters.charAt(randomIndex);
  };

  let ifscCode = prefix;

  // Append characters and digits to the IFSC code
  for (let i = 0; i < idLength; i++) {
    ifscCode += generateRandomChar();
  }

  return ifscCode;
}





const sendOtp = (phone, otp) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require('twilio')(accountSid, authToken);

  client.messages
    .create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+88${phone}`,
    })
    .then((message) => console.log(message.sid));
}



app.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    //  const otp = randamSixDigitNumberGenerator();
    //send otp to the user
    // sendOtp(phone, otp);
    
    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.log("Error creating user", error);
    res.status(500).json({ message: "Failed to create user" });
  }
});

app.post('/apply-loan', async (req, res) => {
  try {
    const { amount, duration, emi, interestRate, bank, userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // check if the bank exists
    const bankExists = await Bank.findById(bank);
    if (!bankExists) {
      return res.status(404).json({ message: "Bank not found" });
    }
    //check if the user has an account with the bank
    const userBank = await UserBank.findOne({ user: userId, bank });
    if (!userBank) {
      return res.status(404).json({ message: "User does not have an account with the bank" });
    }

    const newLoan = new Loan({
      loanId: loanIdGenerator(),
      amount,
      duration,
      emi,
      interestRate,
      bank,
      user: userId,
    });

    await newLoan.save();
    userBank.loans.push(newLoan)
    await userBank.save();
    res.status(201).json(newLoan);
  } catch (error) {
    console.log("Error applying for loan", error);
    res.status(500).json({ message: "Failed to apply for loan" });
  }
});
    

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Error logging in", error);
    res.status(500).json({ message: "Failed to login" });
  }
});

app.get('/loans', async (req, res) => {
  try {
    const { userId } = req.query;
    const loans = await Loan.find({ user: userId }).populate('bank').populate('payments');
    res.status(200).json(loans);

  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve the loans" });
  }
});



app.post('/loansPayment', async (req, res) => {
  try {
    const { paymentMode, phone, via, loanId, amount, userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const loan = await Loan.findOne({ loanId });
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    const newPayment = new Payment({
      transactionId: transactionIdGenerator(),
      paymentMode,
      phone,
      via,
      loanId,
      amount,
      user: userId,
    });

    await newPayment.save();
    loan.payments.push(newPayment);
    await loan.save();
    res.status(201).json(newPayment);
  } catch (error) {
    console.log("Error making payment", error);
    res.status(500).json({ message: "Failed to make payment" });
  }
});

app.get('/loansPayments', async (req, res) => {
  try {
    const { loanId } = req.query;
    const payments = await Payment.find({ loanId });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve the payments" });
  }
});

app.get('/loan/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const loan = await Loan.findById(id).populate('bank').populate('payments')
    return res.status(200).json(loan);
  } catch (error) {
    console.log("Error making payment", error);
    res.status(500).json({ message: "Failed to make payment" });
  }
})


app.post('/userBank', async (req, res) => {
  try {
    const { userId, bank, balance } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const bankExists = await Bank.findById(bank);
    if (!bankExists) {
      return res.status(404).json({ message: "Bank not found" });
    }

    const accountNumber = accountNumberGenerator();
    const ifscCode = ifscCodeGenerator();

    const newUserBank = new UserBank({
      user: userId,
      bank,
      accountNumber,
      ifscCode,
      balance,
    });

    await newUserBank.save();
    res.status(201).json(newUserBank);
  } catch (error) {
    console.log("Error creating user bank", error);
    res.status(500).json({ message: "Failed to create user bank" });
  }
});

app.get('/userBanks', async (req, res) => {
  try {
    const { userId } = req.query;
    const userBanks = await UserBank.find({ user: userId }).populate('bank');
    res.status(200).json(userBanks);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve the user banks" });
  }
});




//endpoint to register a employee
app.post("/addEmployee", async (req, res) => {
  try {
    const {
      employeeName,
      employeeId,
      designation,
      phoneNumber,
      dateOfBirth,
      joiningDate,
      activeEmployee,
      salary,
      address,
    } = req.body;

    //create a new Employee
    const newEmployee = new Employee({
      employeeName,
      employeeId,
      designation,
      phoneNumber,
      dateOfBirth,
      joiningDate,
      activeEmployee,
      salary,
      address,
    });

    await newEmployee.save();

    res
      .status(201)
      .json({ message: "Employee saved successfully", employee: newEmployee });
  } catch (error) {
    console.log("Error creating employee", error);
    res.status(500).json({ message: "Failed to add an employee" });
  }
});

//endpoint to fetch all the employees
app.get("/employees", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve the employees" });
  }
});

app.post("/attendance", async (req, res) => {
  try {
    const { employeeId, employeeName, date, status } = req.body;

    const existingAttendance = await Attendance.findOne({ employeeId, date });

    if (existingAttendance) {
      existingAttendance.status = status;
      await existingAttendance.save();
      res.status(200).json(existingAttendance);
    } else {
      const newAttendance = new Attendance({
        employeeId,
        employeeName,
        date,
        status,
      });
      await newAttendance.save();
      res.status(200).json(newAttendance);
    }
  } catch (error) {
    res.status(500).json({ message: "Error submitting attendance" });
  }
});

app.get("/attendance", async (req, res) => {
  try {
    const { date } = req.query;

    // Find attendance records for the specified date
    const attendanceData = await Attendance.find({ date: date });

    res.status(200).json(attendanceData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance data" });
  }
});

app.get("/attendance-report-all-employees", async (req, res) => {
    try {
      const { month, year } = req.query;
  
      console.log("Query parameters:", month, year);
      // Calculate the start and end dates for the selected month and year
      const startDate = moment(`${year}-${month}-01`, "YYYY-MM-DD")
        .startOf("month")
        .toDate();
      const endDate = moment(startDate).endOf("month").toDate();
  
      // Aggregate attendance data for all employees and date range
      const report = await Attendance.aggregate([
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: [
                    { $month: { $dateFromString: { dateString: "$date" } } },
                    parseInt(req.query.month),
                  ],
                },
                {
                  $eq: [
                    { $year: { $dateFromString: { dateString: "$date" } } },
                    parseInt(req.query.year),
                  ],
                },
              ],
            },
          },
        },
  
        {
          $group: {
            _id: "$employeeId",
            present: {
              $sum: {
                $cond: { if: { $eq: ["$status", "present"] }, then: 1, else: 0 },
              },
            },
            absent: {
              $sum: {
                $cond: { if: { $eq: ["$status", "absent"] }, then: 1, else: 0 },
              },
            },
            halfday: {
              $sum: {
                $cond: { if: { $eq: ["$status", "halfday"] }, then: 1, else: 0 },
              },
            },
            holiday: {
              $sum: {
                $cond: { if: { $eq: ["$status", "holiday"] }, then: 1, else: 0 },
              },
            },
          },
        },
        {
          $lookup: {
            from: "employees", // Name of the employee collection
            localField: "_id",
            foreignField: "employeeId",
            as: "employeeDetails",
          },
        },
        {
          $unwind: "$employeeDetails", // Unwind the employeeDetails array
        },
        {
          $project: {
            _id: 1,
            present: 1,
            absent: 1,
            halfday: 1,
            name: "$employeeDetails.employeeName",
            designation:"$employeeDetails.designation",
            salary: "$employeeDetails.salary",
            employeeId: "$employeeDetails.employeeId",
          },
        },
      ]);
  
      res.status(200).json({ report });
    } catch (error) {
      console.error("Error generating attendance report:", error);
      res.status(500).json({ message: "Error generating the report" });
    }
  });
  

