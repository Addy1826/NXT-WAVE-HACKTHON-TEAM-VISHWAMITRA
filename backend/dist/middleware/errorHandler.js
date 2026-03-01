"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const errorHandler = (err, req, res, next) => {
    logger_1.logger.error(err.stack);
    res.status(500).send('Something broke!');
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map