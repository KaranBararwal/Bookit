'use server'

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { Query } from "node-appwrite";
import { redirect } from "next/navigation";
import checkAuth from "./checkAuth";


async function getMyBookings() {
//   const sessionCookie = cookies().get('appwrite-session');
const cookieStore =  await cookies(); // Access the cookie store synchronously
const sessionCookie = cookieStore.get('appwrite-session'); // Fetch 'appwrite-session'
    if(!sessionCookie){
        redirect('/login');
    }

    try {

        // getting the databases
        const {databases} = await createSessionClient(sessionCookie.value);

        // get user's ID
        const {user} = await checkAuth();

        if(!user){
            return{
                error:'You must be logged in to view bookings'
            }
        }

        // fectch users bookings
        const {documents: bookings} = await databases.listDocuments( // renaming the documents as rooms
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE, // passing the id
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
            [Query.equal('user_id' , user.id)]
        );

        return bookings;

    } catch (error) {
        console.log('Failed to get user bookings' , error);
        return{
            error: 'Failed to get bookings',
        };
    }
}

export default getMyBookings;