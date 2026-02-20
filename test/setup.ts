import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from test/.env
config({ path: resolve(__dirname, ".env") });

// Global test setup
console.log("🔧 Test environment loaded");
console.log(
  `📍 Graphlit Org: ${process.env.GRAPHLIT_ORGANIZATION_ID?.slice(0, 8)}...`,
);
console.log(
  `🌍 Graphlit Env: ${process.env.GRAPHLIT_ENVIRONMENT_ID?.slice(0, 8)}...`,
);
console.log(
  `🔑 OpenAI API: ${process.env.OPENAI_API_KEY ? "Available" : "Not set"}`,
);
console.log(
  `🔑 Anthropic API: ${process.env.ANTHROPIC_API_KEY ? "Available" : "Not set"}`,
);