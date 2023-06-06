const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User=require("../model/userModel")
const Employee=require('../model/employeModel')
const { sendVerificationEmail, sendPasswordResetEmail } = require("./email");

exports.getLogin = async (req, res) => {
  const { message } = req.query;
  res.render("login",{message});
};


//secure password
const securePassword = async (password) => {
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      return passwordHash;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  };
  exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (user.isVerified) {
        if (!password) {
          return res.status(400).render("login", { message: "Please enter a password" });
        }
  
        const passwordMatch = await bcrypt.compare(password, user.password);
  
        if (passwordMatch) {
          req.session.userId = user.id;
          return res.redirect('/dashboard');
        } else {
          return res.status(400).render("login", { message: "Invalid email or password" });
        }
      } else {
        return res.status(400).render("login", { message: "Your email was not verified" });
      }
    } catch (error) {
      console.error(`Error logging in user: ${error}`);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
  

exports.getRegister = async (req, res) => {
  res.render("register");
};

//========================= Registeration ====================================//
exports.postRegister = async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
   
    const foundduser = await User.findOne({ email: email });
    const verificationToken = crypto.randomBytes(20).toString("hex");
    if (foundduser) {
      res.render("register", { message: "Email has already taken." });
    } else {
      const spassword = await securePassword(password);
      const user = new User({
        name: name,
        email: email,
        password: spassword,
        verificationToken,
      });
      await user.save();

      if (user) {
        await sendVerificationEmail(user, user.verificationToken);
        res.render("login", { message: "Please verify your email Now" });
      } else {
        res.render("register", { message: "Something wrong" });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

// routes/auth.js

exports.getVerifyToken = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      verificationToken: token,
    });

    if (user) {
      user.isVerified = true;
      user.verificationToken = undefined;
      await user.save();
      return res.redirect('/')
    }

    // If the token is invalid, display an error message
    return res.status(400).render("error", {
      message: "Invalid verification token",
    });
  } catch (error) {
    console.error(`Error verifying email: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getForgotPassword = async (req, res) => {
  res.render("forgot-password");
};

exports.postForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log(user);

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour from now
    await user.save();
    await sendPasswordResetEmail(user, resetToken);

    return res.render("forgot-password", {
      message: "Please refresh your mail to reset your password",
    });
  } catch (error) {
    console.error(`Error resetting password: ${error}`);
    return res
      .status(500)
      .render("forgot-password", {
        message: "Please enter the valid email",
      });
  }
};

exports.getResetToken = async (req, res) => {
  const { token } = req.params;

  try {
    // Find the user with the provided password reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    // If the token is valid, display a form for the user to enter a new password
    if (user) {
      return res.render("reset-password", { token });
    }

    // If the token is invalid, display an error message
    return res.send("Token Expired")
  } catch (error) {
    console.error(`Error resetting password: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.postResetToken = async (req, res) => {
  const { token } = req.params;
  const { password, confirmpassword } = req.body;
  console.log(token, { $gt: Date.now() });

  try {
    // Find the user with the provided password reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    console.log(password, confirmpassword);
    console.log(user);
    // If the token is valid and the passwords match, update the user's password and redirect to login page
    if (user && password === confirmpassword) {
      user.password = await securePassword(password);
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
      await user.save();
      return res.redirect('/?message=Password%20reset%20successful'); // Redirect to the login page with a success message

    }

    // If the token is invalid or the passwords don't match, display an error message
    return res
      .status(400)
      .render("reset-password", {
        token,
        message: "Invalid password or passwords do not match",
      });
  } catch (error) {
    console.error(`Error resetting password: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};


//=============================EmployeeManagement==================================//

exports.getDashboard = async (req, res) => {
  const { message } = req.query;
  console.log(message);

  let query = {};
  const { search, Employee_id, Department } = req.query;

  if (search) {
    query.Employee_id = { $regex: search, $options: "i" };
  }

  if (Department) {
    query.Department = { $regex: Department, $options: "i" };
  }

  try {
    const employees = await Employee.find(query);
    console.log(employees);

    res.render("dashboard", {
      user: employees.reverse(),
      message,
      query,
      search,
      Department,
    });
  } catch (error) {
    console.error(error);
    // Handle the error appropriately
  }
};


 exports.getAddEmployee=async(req,res)=>{
  const { message } = req.query;
    res.render('add-employee',{message})
 }
 

 exports.postEmployee = async (req, res) => {
    try {    const {Name,Employee_id, Gender, DoB, Department,Designation,Appointment_Date} = req.body;
    
          
      const foundduser = await Employee.findOne({ Employee_id: Employee_id });
      const verificationToken = crypto.randomBytes(20).toString("hex");
      if (foundduser) {
        res.redirect('/add-employee?message=Employe%20ID%20Taken')
      } else {
        const employee = new Employee({
            Name:Name,
            Employee_id:Employee_id,
            Gender:Gender,
             DoB:DoB,
             Department:Department,
          Designation:Designation,
          Appointment_Date:Appointment_Date
         
        });
        await employee.save();

        res.redirect('/add-employee?message=User%20added%20successfully')

      }
    } catch (error) {
      console.log(error.message);
    }
  };

  exports.getUpdateEmployee= async (req, res) => {
    try {
      const user = await Employee.findById(req.params.id);
      res.render("update-employee", {
        user: user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  };
  exports.postUpdateEmployee=async(req,res)=>{
    try {
const { Name,
    Employee_id,
    Gender,
    Department,
  DoB,
  Designation,
  Appointment_Date}=req.body;
        await Employee.findByIdAndUpdate(req.params.id, {
          Name,
          Employee_id,
          Gender,
          DoB,
          Department
          ,
          Designation,
          Appointment_Date
          });
          res.redirect('/dashboard?message=User%20updated%20successfully')
    } catch (error) {
        console.log(error);
        
    }

  }

  exports.postDeleteEmployee = async (req, res) => {
    try {
      await Employee.findByIdAndRemove(req.params.id);
      res.redirect("/dashboard?message=User%20deleted%20successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  };

  exports.searchEmployees = async (req, res) => {
    const query = req.query.q; // The search query
  
    try {
      // Find employees matching the search query
      const results = await Employee.find({
        $or: [
          { Name: { $regex: query, $options: 'i' } },
          { Employee_id: { $regex: query, $options: 'i' } },
          { Designation: { $regex: query, $options: 'i' } }
        ]
      });
  
      res.render('searchResult', { results, query });
    } catch (error) {
      console.error(`Error searching employees: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  
exports.logout=async(req,res)=>{
  req.session.destroy((err) => {
    if (err) {
      console.error(`Error destroying session: ${err}`);
    }
    res.redirect('/');
  });

}
 