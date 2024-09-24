import { Router } from 'express';
import * as authController from '../Controllers/authController'; 
import * as inventoryController from '../Controllers/inventoryController'; 
// import { verifyToken } from '../Middlewares/userAuth'; 
import express from 'express';

import { jwtMiddleware } from '../Middlewares/jwtMiddleware';

const router: Router = express.Router();


router.post('/signup', authController.signUp);
router.post('/verify', authController.verify);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/authenticate',jwtMiddleware, authController.auth);


router.post('/add-item',jwtMiddleware, inventoryController.addItem);
router.get('/fetchAll-products',jwtMiddleware, inventoryController.fetchAllProducts);
router.post('/edit-item',jwtMiddleware, inventoryController.editItem);
router.post('/delete-item',jwtMiddleware, inventoryController.deleteItem);









export default router; 