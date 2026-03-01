"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/razorpay/order', auth_1.authMiddleware, (0, auth_1.authorizeRoles)('PATIENT'), paymentController_1.createOrder);
router.post('/razorpay/verify', auth_1.authMiddleware, (0, auth_1.authorizeRoles)('PATIENT'), paymentController_1.verifyPayment);
exports.default = router;
//# sourceMappingURL=payment.js.map