"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing necessary modules
var axios_1 = require("axios");
var jwt = require("jsonwebtoken");
var dotenv = require("dotenv");
// Initialize dotenv to use environment variables
dotenv.config();
// Define the Graphlit class
var Graphlit = /** @class */ (function () {
    function Graphlit(environment_id, organization_id, secret_key) {
        this.issuer = process.env.ISSUER || "graphlit";
        this.audience = process.env.AUDIENCE || "https://portal.graphlit.io";
        this.role = process.env.ROLE || "Owner";
        this.environment_id = environment_id || process.env.ENVIRONMENT_ID;
        this.organization_id = organization_id || process.env.ORGANIZATION_ID;
        this.secret_key = secret_key || process.env.SECRET_KEY;
        this.base_url = "https://data-scus.graphlit.io/api/v1";
        // Set token expiration to one hour from now
        var expiration = Math.floor(Date.now() / 1000) + (60 * 60); // One hour from now
        var payload = {
            "https://graphlit.io/jwt/claims": {
                "x-graphlit-environment-id": this.environment_id,
                "x-graphlit-organization-id": this.organization_id,
                "x-graphlit-role": this.role,
            },
            exp: expiration,
            iss: this.issuer,
            aud: this.audience,
        };
        if (!this.secret_key) {
            throw new Error("Secret key is required.");
        }
        this.token = jwt.sign(payload, this.secret_key, { algorithm: 'HS256' });
    }
    Graphlit.prototype.request = function (query, variables) {
        if (variables === void 0) { variables = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var headers, payload, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        headers = {
                            Authorization: "Bearer ".concat(this.token),
                            "Content-Type": "application/json"
                        };
                        payload = {
                            query: query,
                            variables: variables,
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.post("".concat(this.base_url, "/graphql"), payload, { headers: headers })];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 3:
                        error_1 = _a.sent();
                        console.error(error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Graphlit;
}());
// Export the Graphlit class so it can be imported by other modules
exports.default = Graphlit;
