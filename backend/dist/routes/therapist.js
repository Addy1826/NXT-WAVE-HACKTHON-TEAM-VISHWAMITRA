"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const therapistController_1 = require("../controllers/therapistController");
const router = express_1.default.Router();
router.get('/', therapistController_1.getTherapists);
router.post('/request', (0, auth_1.authorizeRoles)('PATIENT'), therapistController_1.requestTherapist);
// Dashboard & Management
router.get('/dashboard/stats', (0, auth_1.authorizeRoles)('THERAPIST'), therapistController_1.getDashboardStats);
router.get('/my-patients', (0, auth_1.authorizeRoles)('THERAPIST'), therapistController_1.getPatients);
router.get('/profile', (0, auth_1.authorizeRoles)('THERAPIST'), therapistController_1.getTherapistProfile);
router.post('/profile', (0, auth_1.authorizeRoles)('THERAPIST'), therapistController_1.updateProfile);
exports.default = router;
//# sourceMappingURL=therapist.js.map