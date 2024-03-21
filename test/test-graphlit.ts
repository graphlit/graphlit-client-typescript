// Import the Graphlit class from your package
import Graphlit from '../src/index';

// Assuming your environment variables are set,
// Initialize the Graphlit client
const client = new Graphlit(process.env.ENVIRONMENT_ID, process.env.ORGANIZATION_ID, process.env.SECRET_KEY);

// Define your GraphQL query (mutation in this case) and variables
const query = `
mutation CreateFeed($feed: FeedInput!) {
  createFeed(feed: $feed) {
    id
    name
    state
    type
  }
}`;

const variables = {
  feed: {
    type: "WEB",
    web: {
      uri: "https://openai.com/blog"
    },
    name: "OpenAI Blog"
  }
};

// Use an async function to send the request, as the `request` method returns a Promise
async function createFeed() {
  try {
    const response = await client.request(query, variables);
    console.log("Response:", response);
  } catch (error) {
    console.error("Error creating feed:", error);
  }
}

// Call the function
createFeed();
