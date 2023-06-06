const express = require('express');
const { postRegister, getRegister, postLogin, getLogin, getVerifyToken, postForgotPassword, getForgotPassword, postResetToken, getResetToken, getDashboard, getAddEmployee, postEmployee, getUpdateDeptUser, getUpdateEmployee, postUpdateEmployee, postDeleteDeptUser, postDeleteEmployee, searchEmployees, logout } = require('../controller/auth');
const hasSession = require('../middleware/session');

const router = express.Router();


router.post('/register',  postRegister);
router.get('/register',  getRegister)
router.get('/',getLogin)
router.post('/', postLogin)
router.get('/',  getLogin)
router.get('/verify-email/:token', getVerifyToken)
router.post('/forgot-password', postForgotPassword)
router.get('/forgot-password', getForgotPassword)
router.post('/reset-password/:token', postResetToken)
router.get('/reset-password/:token', getResetToken)


//=================================Employee Management====================================///
router.get('/dashboard',hasSession, getDashboard)
router.get('/add-employee',hasSession, getAddEmployee)
router.post('/add-employee',hasSession, postEmployee)
router.get('/employe/:id',hasSession,getUpdateEmployee)
router.post('/employe/:id',hasSession, postUpdateEmployee)
router.post('/employee-delete/:id',hasSession,postDeleteEmployee)
router.get('/search',hasSession,searchEmployees)
router.get('/logout',hasSession,logout)

module.exports = router;