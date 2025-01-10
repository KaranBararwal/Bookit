'use server'

import { createAdminClient } from "@/config/appwrite";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


async function getSingleRoom(id) {
    try {

        // getting the databases
        const {databases} = await createAdminClient();

        // fectch rooms
        const room = await databases.getDocument( // renaming the documents as rooms
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE, // passing the id
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
            id
        )

        // revalidata the cache for this path
        // revalidatePath('/' , 'layout');
        // revalidatePath('/');
        return room;

    } catch (error) {
        console.log('Failed to get room' , error);
        redirect('/error');
    }
}

export default getSingleRoom;