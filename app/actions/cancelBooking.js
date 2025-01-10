'use server'

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import checkAuth from "./checkAuth";
import { revalidatePath } from "next/cache";


async function cancelBooking(bookingId) {
//   const sessionCookie = cookies().get('appwrite-session');
const cookieStore =  await cookies(); // Access the cookie store synchronously
const sessionCookie = cookieStore.get('appwrite-session'); // Fetch 'appwrite-session'
    if(!sessionCookie){
        redirect('/login');
    }

    try {

        // getting the databases
        const {databases} = await createSessionClient(sessionCookie.value);

        const {user} = await checkAuth();

        if(!user){
            return{
                error : 'You must be logged in to cancel a booking'
            }
        }

        // get the booking
        const booking = await databases.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
            bookingId
        );


        // check if booking belongs to the current user 
        if(booking.user_id !== user.id){
            return{
                error: 'You are not authorized to cancel this booking'
            }
        }

        // delete booking
        await databases.deleteDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
            bookingId      
        );

        revalidatePath('/bookings' , 'layout');

        return{
            success : true,
        };

    } catch (error) {
        console.log('Failed to cancel booking' , error);
        return{
            error: 'Failed to cancel booking'
        }
    }
}

export default cancelBooking;