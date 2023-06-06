const mongoose = require('mongoose');
const employeeSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Employee_id: {
        type: String,
        required: true,
        unique: true
    },
    Gender: {
        type: String,
        require: true
    },
    DoB: {
        type: Date,
        required: true,
    },
    Designation: {
        type: String,
        required: true
    },
    Department:{
        type:String,
        required:true
    },

    Appointment_Date:{
        type:Date
    }
});
const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;