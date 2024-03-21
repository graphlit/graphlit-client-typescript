// Importing necessary modules
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

// Initialize dotenv to use environment variables
dotenv.config();

// Define the Graphlit class
class Graphlit {
    private issuer: string;
    private audience: string;
    private role: string;
    private environment_id: string | undefined;
    private organization_id: string | undefined;
    private secret_key: string | undefined;
    private base_url: string;
    private token: string;

    constructor(environment_id?: string, organization_id?: string, secret_key?: string) {
        this.issuer = process.env.ISSUER || "graphlit";
        this.audience = process.env.AUDIENCE || "https://portal.graphlit.io";
        this.role = process.env.ROLE || "Owner";

        this.environment_id = environment_id || process.env.ENVIRONMENT_ID;
        this.organization_id = organization_id || process.env.ORGANIZATION_ID;
        this.secret_key = secret_key || process.env.SECRET_KEY;

        this.base_url = "https://data-scus.graphlit.io/api/v1";

        // Set token expiration to one hour from now
        const expiration = Math.floor(Date.now() / 1000) + (60 * 60); // One hour from now

        const payload = {
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

    async request(query: string, variables: object = {}) {
        const headers = {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json"
        };

        const payload = {
            query,
            variables,
        };

        try {
            const response = await axios.post(`${this.base_url}/graphql`, payload, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

// Export the Graphlit class so it can be imported by other modules
export default Graphlit;
