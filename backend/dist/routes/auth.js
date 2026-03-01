"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
// Traditional auth
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
// Anonymous session management
router.post('/anonymous', authController_1.createAnonymousSession);
router.get('/session-status/:sessionId', authController_1.getSessionStatus);
exports.default = router;
//# sourceMappingURL=auth.js.map