'use server'

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { Query } from "node-appwrite";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function deleteRoom(roomId) {
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

        // find room to delete
        const roomToDelete = rooms.find((room) => room.$id === roomId);

        // delete the room

        if(roomToDelete){
            await databases.deleteDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE, // passing the id
                process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
                roomToDelete.$id        
            );

            // revalidate my rooms and all rooms
            revalidatePath('/rooms/my' , 'layout');
            revalidatePath('/' , 'layout');

            return{
                success: true
            };
        }
        else{
            return {
                error : 'Room not found'
            }
        }
    } catch (error) {
        console.log('Failed to delete rooms' , error);
        return{
            error: 'Failed to delete room',
        };
    }
}

export default deleteRoom;