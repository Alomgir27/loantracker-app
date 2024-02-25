const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({
    bank: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        required: false,
    },
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
    },
});

const loanSchema = new mongoose.Schema({
    loanId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    interestRate: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    emi: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    payments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payment",
        },
    ],
    bank: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bank",
    },
});

const paymentSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
    },
    loanId: {
        type: String,
        required: true,
    },
    via: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    paymentMode: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

const userBankSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    bank: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bank",
    },
    accountNumber: {
        type: String,
        required: true,
    },
    ifscCode: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    },
    loans: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Loan",
        },
    ],
    documents: {
        type: mongoose.Schema.Types.Mixed,
        required: false,
    },
});


const UserBank = mongoose.model("UserBank", userBankSchema);
const Loan = mongoose.model("Loan", loanSchema);
const Payment = mongoose.model("Payment", paymentSchema);
const Bank = mongoose.model("Bank", bankSchema);
const User = mongoose.model("User", userSchema);

module.exports = { Bank, User, Loan, Payment, UserBank };


