"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("./user.validation");
const multer_1 = __importDefault(require("../../middlewares/multer"));
const router = express_1.default.Router();
router.get('/', user_controller_1.UserController.getAllUsers);
router.post('/login', user_controller_1.UserController.login);
router.post('/create-user', multer_1.default.single('image'), 
//   validateRequest(UserValidation.create),
user_controller_1.UserController.createUser);
router.get('/logout', user_controller_1.UserController.logOut);
router.get('/refresh-token', user_controller_1.UserController.refreshAccessToken);
router.get('/:id', user_controller_1.UserController.getUserById);
router.patch('/:id', (0, validateRequest_1.default)(user_validation_1.UserValidation.update), user_controller_1.UserController.updateUser);
router.delete('/:id', user_controller_1.UserController.deleteUser);
router.get('/active-account/:token', user_controller_1.UserController.activeAccount);
exports.UserRoutes = router;
