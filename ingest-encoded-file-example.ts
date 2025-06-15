import { Graphlit, Types } from "graphlit-client";
import * as fs from "fs";
import * as path from "path";

// Initialize the Graphlit client
const client = new Graphlit(
  process.env.GRAPHLIT_ORGANIZATION_ID,
  process.env.GRAPHLIT_ENVIRONMENT_ID,
  process.env.GRAPHLIT_JWT_SECRET
);

async function ingestEncodedFileExample() {
  try {
    // Example 1: Ingest a text file
    const textContent = "This is sample text content for testing.";
    const textData = Buffer.from(textContent).toString("base64");

    console.log("Ingesting text file...");
    const textResult = await client.ingestEncodedFile(
      "sample-text.txt", // name
      textData, // base64 encoded data
      "text/plain", // mimeType
      undefined, // fileCreationDate
      undefined, // fileModifiedDate
      undefined, // id
      true // isSynchronous - wait for processing
    );
    console.log("✅ Text file ingested:", textResult.ingestEncodedFile?.id);

    // Example 2: Ingest a local file
    const localFilePath = "./example-document.pdf";
    if (fs.existsSync(localFilePath)) {
      const fileBuffer = fs.readFileSync(localFilePath);
      const fileData = fileBuffer.toString("base64");

      console.log("\nIngesting PDF file...");
      const pdfResult = await client.ingestEncodedFile(
        path.basename(localFilePath), // name
        fileData, // base64 encoded data
        "application/pdf", // mimeType
        undefined, // fileCreationDate
        undefined, // fileModifiedDate
        undefined, // id
        true // isSynchronous
      );
      console.log("✅ PDF file ingested:", pdfResult.ingestEncodedFile?.id);
    }

    // Example 3: Ingest with metadata and collections
    const htmlContent = `
      <html>
        <body>
          <h1>Sample Document</h1>
          <p>This is a sample HTML document with important information.</p>
        </body>
      </html>
    `;
    const htmlData = Buffer.from(htmlContent).toString("base64");

    // First, create a collection
    const collection = await client.createCollection({
      name: "Important Documents"
    });

    console.log("\nIngesting HTML with metadata...");
    const htmlResult = await client.ingestEncodedFile(
      "important-document.html", // name
      htmlData, // base64 encoded data
      "text/html", // mimeType
      new Date("2024-01-01").toISOString(), // fileCreationDate
      new Date().toISOString(), // fileModifiedDate
      undefined, // id
      true, // isSynchronous
      undefined, // workflow
      [{ id: collection.createCollection?.id }] // collections
    );
    console.log("✅ HTML file ingested:", htmlResult.ingestEncodedFile?.id);

    // Example 4: Ingest with workflow processing
    // First, create a workflow for automatic summarization
    const summarySpec = await client.createSpecification({
      name: "Summarizer",
      type: Types.SpecificationTypes.Summarization,
      serviceType: Types.ModelServiceTypes.OpenAi,
      openAI: {
        model: Types.OpenAiModels.Gpt4O_128K
      }
    });

    const workflow = await client.createWorkflow({
      name: "Auto-Summarize",
      preparation: {
        summarizations: [{
          type: Types.SummarizationTypes.Summary,
          specification: { id: summarySpec.createSpecification?.id }
        }]
      }
    });

    const jsonContent = JSON.stringify({
      title: "Quarterly Report",
      revenue: 1000000,
      expenses: 750000,
      profit: 250000,
      details: "This quarter showed strong growth in all sectors..."
    }, null, 2);
    const jsonData = Buffer.from(jsonContent).toString("base64");

    console.log("\nIngesting JSON with workflow...");
    const jsonResult = await client.ingestEncodedFile(
      "quarterly-report.json", // name
      jsonData, // base64 encoded data
      "application/json", // mimeType
      undefined, // fileCreationDate
      undefined, // fileModifiedDate
      undefined, // id
      true, // isSynchronous
      { id: workflow.createWorkflow?.id } // workflow
    );
    console.log("✅ JSON file ingested with workflow:", jsonResult.ingestEncodedFile?.id);

    // Example 5: Ingest an image file
    const svgContent = `
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
      </svg>
    `;
    const svgData = Buffer.from(svgContent).toString("base64");

    console.log("\nIngesting SVG image...");
    const svgResult = await client.ingestEncodedFile(
      "red-circle.svg", // name
      svgData, // base64 encoded data
      "image/svg+xml", // mimeType
      undefined, // fileCreationDate
      undefined, // fileModifiedDate
      undefined, // id
      false // isSynchronous - don't wait for processing
    );
    console.log("✅ SVG image ingested (async):", svgResult.ingestEncodedFile?.id);

    // Check if async content is ready
    if (svgResult.ingestEncodedFile?.id) {
      let isReady = false;
      let attempts = 0;
      while (!isReady && attempts < 10) {
        const status = await client.isContentDone(svgResult.ingestEncodedFile.id);
        isReady = status.isContentDone?.result || false;
        
        if (!isReady) {
          console.log("⏳ Still processing SVG...");
          await new Promise(resolve => setTimeout(resolve, 2000));
          attempts++;
        } else {
          console.log("✅ SVG processing complete!");
        }
      }
    }

    // Clean up (optional)
    console.log("\nCleaning up...");
    if (collection.createCollection?.id) {
      await client.deleteCollection(collection.createCollection.id);
    }
    if (summarySpec.createSpecification?.id) {
      await client.deleteSpecification(summarySpec.createSpecification.id);
    }
    if (workflow.createWorkflow?.id) {
      await client.deleteWorkflow(workflow.createWorkflow.id);
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the example
if (import.meta.url === `file://${process.argv[1]}`) {
  ingestEncodedFileExample();
}