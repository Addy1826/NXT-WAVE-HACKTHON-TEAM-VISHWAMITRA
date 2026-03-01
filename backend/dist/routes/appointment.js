"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const appointmentController_1 = require("../controllers/appointmentController");
const router = express_1.default.Router();
// Therapist specific
router.get('/therapist', (0, auth_1.authorizeRoles)('THERAPIST'), appointmentController_1.getTherapistAppointments);
router.patch('/:id/status', (0, auth_1.authorizeRoles)('THERAPIST'), appointmentController_1.updateAppointmentStatus);
// Patient specific
router.post('/', (0, auth_1.authorizeRoles)('PATIENT'), appointmentController_1.createAppointment);
router.get('/my-appointments', (0, auth_1.authorizeRoles)('PATIENT'), appointmentController_1.getPatientAppointments);
exports.default = router;
//# sourceMappingURL=appointment.js.map