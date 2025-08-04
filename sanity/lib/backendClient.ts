import { createClient } from "next-sanity";
import { dataset, projectId, apiVersion } from "../env";

export const backendClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    token: process.env.SANITY_API_TOKEN, // Ensure you have the token set in your environment variables
}); 