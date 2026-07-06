import { Client, Databases, ID } from 'appwrite';

const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;

const client = new Client()
    .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID);
    
const databases = new Databases(client);

export const getWords = async () => {
    try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
        return response.documents;
    } catch (error) {
        console.error("Some mistake of getting words:", error);
        throw error;
    }
};

export const createNewWord = async (word, translation = '', example1 = '', example2 = '') => {
    try {
        const response = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            { word, translation, example1, example2 }
        );
        return response;
    } catch (error) {
        console.error("Mistake of creating word:", error);
        throw error;
    }
};

export const updateWord = async (documentId, updatedData) => {
    try {
        const response = await databases.updateDocument(
            DATABASE_ID,
            COLLECTION_ID,
            documentId,
            updatedData
        );
        return response;
    } catch (error) {
        console.error("Mistake of updating word:", error);
        throw error;
    }
};