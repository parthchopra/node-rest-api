"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const session_controller_1 = require("./controller/session.controller");
const user_controller_1 = require("./controller/user.controller");
const validateResource_1 = __importDefault(require("./middleware/validateResource"));
const session_schema_1 = require("./schema/session.schema");
const user_schema_1 = require("./schema/user.schema");
function routes(app) {
    app.get("/healthcheck", (req, res) => res.sendStatus(200));
    app.post("/api/users", (0, validateResource_1.default)(user_schema_1.createUserSchema), user_controller_1.createUserHandler);
    app.post("/api/sessions", (0, validateResource_1.default)(session_schema_1.createSessionSchema), session_controller_1.createUserSessionHandler);
}
exports.default = routes;
//# sourceMappingURL=routes.js.map