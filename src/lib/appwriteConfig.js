import { Client, Databases, ID, Query } from "appwrite";

const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);

const databases = new Databases(client);

export const getWords = async () => {
  let allDocuments = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.orderDesc("$createdAt"),
      Query.limit(limit),
      Query.offset(offset),
    ]);
    allDocuments = allDocuments.concat(response.documents);
    if (response.documents.length < limit) break;
    offset += limit;
  }

  return allDocuments;
};

export const createNewWord = async (
  word,
  translation = "",
  example1 = "",
  example2 = "",
) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      { word, translation, example1, example2 },
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
      updatedData,
    );
    return response;
  } catch (error) {
    console.error("Mistake of updating word:", error);
    throw error;
  }
};
