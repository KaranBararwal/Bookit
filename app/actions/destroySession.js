'use server'
import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";

async function destroySession() {

    // retrive the session cookie
    const sessionCookie = cookies().get('appwrite-session');

    if(!sessionCookie){
        return {
            error : 'No session cookie found ',
        }
    }

    try {
        const  {account} = await createSessionClient(sessionCookie.value);

        // delete current session
        await account.deleteSession('current');

        // clear session cookie
        cookies().delete('appwrite-session');

        return {
            success : true, 
        };
        
    } catch (error) {

        return{
            error: 'Error deleting the session',
        };
    }

}

export default destroySession;