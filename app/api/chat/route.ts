// import { createAzure } from '@ai-sdk/azure';
// import { convertToCoreMessages, streamText, CoreTool } from 'ai';
// import { z } from 'zod';

// import dotenv from 'dotenv';
// import { createResource } from '@/lib/actions/resources';


// dotenv.config();


// const azure = createAzure({
//   baseURL: process.env.AZURE_INFERENCE_BASEURL,
//   apiKey: process.env.AZURE_API_KEY,
//   headers: {
//     'Authorization': `Bearer ${process.env.AZURE_API_KEY}`
//   }
// });

// // Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

// // Define the parameters for the Add Resource Tool using Zod schema
// const addResourceParameters = z.object({
//   resource: z.string().describe('The resource to add to the knowledge base'),
// });

// // Define the Add Resource Tool
// const addResourceTool: CoreTool<typeof addResourceParameters, void> = {
//   description: "Add a resource to your knowledge base. If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.",
//   parameters: addResourceParameters,
//   execute: async (args) => {
//     // Logic to add the resource to the knowledge base
//     console.log(`Resource added: ${args.resource}`);
//   },
// };

// // Export the tools
// const tools = {
//   addResource: addResourceTool,
// };

// export async function POST(req: Request) {
//     const { messages } = await req.json();
  
  
//     // Log the payload to ensure it is correctly formatted
//     console.log(JSON.stringify({
//       model: azure(''),
//       system: `You are a helpful assistant.`,      
//       tools,  
//       messages: convertToCoreMessages( messages),
//     }, null, 2));
  
//     // Ensure the model name and endpoint are correct
//     const result = await streamText({
//       model: azure(''),
//       toolChoice: 'none',
//       tools,      
//       system: `You are a helpful assistant. `,
//       messages: convertToCoreMessages(messages),
//     });
//     return result.toAIStreamResponse();
//   }


// // CHATGPT
import { createAzure } from '@ai-sdk/azure';
import { convertToCoreMessages, streamText, tool } from 'ai';
import { z } from 'zod';
import { findRelevantContent } from '@/lib/ai/embedding';
import dotenv from 'dotenv';
import { createResource } from '@/lib/actions/resources';


dotenv.config();


const azure = createAzure({
  baseURL: process.env.AZURE_INFERENCE_BASEURL,
  apiKey: process.env.AZURE_API_KEY,
  headers: {
    'Authorization': `Bearer ${process.env.AZURE_API_KEY}`
  }
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Define the parameters for the Add Resource Tool using Zod schema
const addResourceParameters = z.object({
  resource: z.string().describe('The resource to add to the knowledge base'),
});


export async function POST(req: Request) {
    const { messages } = await req.json();
  
  
    
  const result = await streamText({
    model: azure(''),
    messages: convertToCoreMessages(messages),
    toolChoice: 'none',
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
    tools: {
      addResource: {
        description: `add a resource to your knowledge base.
          If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
        parameters: z.object({
          content: z
            .string()
            .describe('the content or resource to add to the knowledge base'),
        }),
        execute: async ({ content }) => createResource({ content }),
      },
      getInformation: {
        description: `get information from your knowledge base to answer questions.`,
        parameters: z.object({
          question: z.string().describe('the users question'),
        }),
        execute: async ({ question }) => findRelevantContent(question),
      },
    },
  });

  return result.toAIStreamResponse();
}