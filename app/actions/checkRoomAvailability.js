'use server'

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { Query } from "node-appwrite";
import { redirect } from "next/navigation";
import { DateTime } from "luxon";


// convert a date string to a luxon datetime object in UTC
function toUTCDateTime(dateString){
    return DateTime.fromISO(dateString , {zone : 'utc'}).toUTC();
}


//check for overlapping date ranges 
function dateRangesOverlap(checkInA , checkOutA , checkInB , checkOutB){
    return checkInA < checkOutB && checkOutA > checkInB;
}

async function checkRoomAvailability(roomId , checkIn , checkOut) {
//   const sessionCookie = cookies().get('appwrite-session');
    const cookieStore =  await cookies(); // Access the cookie store synchronously
    const sessionCookie = cookieStore.get('appwrite-session'); // Fetch 'appwrite-session'
        if(!sessionCookie){
            redirect('/login');
        }

    try {

        // getting the databases
        const {databases} = await createSessionClient(sessionCookie.value);

        const checkInDateTime = toUTCDateTime(checkIn);
        const checkOutDateTime = toUTCDateTime(checkOut);

       // fecth all bookings for a given room
       const {documents: bookings} = await databases.listDocuments( // renaming the documents as rooms
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE, // passing the id
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
        [Query.equal('room_id' , roomId)]
    );

        // loop over bookings and check for overlaps
        for (const booking of bookings){
            const bookingCheckInDateTime =toUTCDateTime(booking.check_in);
            const bookingCheckOutDateTime =toUTCDateTime(booking.checking_out);

            if(dateRangesOverlap(
                checkInDateTime,
                checkOutDateTime,
                bookingCheckInDateTime,
                bookingCheckOutDateTime,
            )){
                return false; // overlap found  , do not book
            }
        }

        // no overlap found , continue to book

        return true;

    } catch (error) {
        console.log('Failed to check availability' , error);
        return{
            error : 'Failed to check availability'
        }
    }
}

export default checkRoomAvailability;