'use server'

import { createAdminClient } from "@/config/appwrite";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


async function getAllRooms() {
    try {

        // getting the databases
        const {databases} = await createAdminClient();

        // fectch rooms
        const {documents: rooms} = await databases.listDocuments( // renaming the documents as rooms
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE, // passing the id
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS
        )

        // revalidata the cache for this path
        // revalidatePath('/' , 'layout');
        // revalidatePath('/');
        return rooms;

    } catch (error) {
        console.log('Failed to get rooms' , error);
        redirect('/error');
    }
}

export default getAllRooms;