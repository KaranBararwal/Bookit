'use server'

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { ID } from "node-appwrite";
import { redirect } from "next/navigation";
import checkAuth from "./checkAuth";
import { revalidatePath } from "next/cache";
import checkRoomAvailability from "./checkRoomAvailability";


async function bookRoom(previousState , formData) {
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
                error: 'You must be logged in to book a room'
            }
        }

        // extract date and time from the formData
        const checkInDate = formData.get('check_in_date');
        const checkInTime = formData.get('check_in_time');
        const checkOutDate = formData.get('check_out_date');
        const checkOutTime = formData.get('check_out_time');

        
        // combine date and time to ISO 8601 format
        const checkInDateTime = `${checkInDate}T${checkInTime}`;
        const checkOutDateTime = `${checkOutDate}T${checkOutTime}`;
        
        const roomId = formData.get('room_id');
        
        // check if room is available
        const isAvailable = await checkRoomAvailability(roomId , checkInDateTime , checkOutDateTime);

        if(!isAvailable){
            return{
                error : 'This room is already booked for the selected time slot',
            }
        }

        const bookingData = {
            // these attributes are present in our database
            check_in : checkInDateTime,
            checking_out : checkOutDateTime,
            user_id : user.id,
            room_id : roomId,
        }

        // create booking
        const newBooking = await databases.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
            ID.unique(),
            bookingData
        );

        // revalidate cache
        revalidatePath('/bookings' , 'layout');

        return{
            success: true,
        };

    } catch (error) {
        console.log('Failed to book room' , error);
        return{
            error: 'Something went wrong while booking the room'
        }
    }
}

export default bookRoom;