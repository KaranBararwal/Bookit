'use server'

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { Query } from "node-appwrite";
import { redirect } from "next/navigation";


async function getMyRooms() {
//   const sessionCookie = cookies().get('appwrite-session');
const cookieStore =  await cookies(); // Access the cookie store synchronously
const sessionCookie = cookieStore.get('appwrite-session'); // Fetch 'appwrite-session'
    if(!sessionCookie){
        redirect('/login');
    }

    try {

        // getting the databases
        const {account ,databases} = await createSessionClient(sessionCookie.value);

        // get user's ID
        const user = await account.get();
        const userID = user.$id;

        // fectch rooms
        const {documents: rooms} = await databases.listDocuments( // renaming the documents as rooms
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE, // passing the id
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
            [Query.equal('user_id' , userID)]
        );

        return rooms;

    } catch (error) {
        console.log('Failed to get rooms' , error);
        redirect('/error');
    }
}

export default getMyRooms;