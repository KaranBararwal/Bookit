'use server'
import { createAdminClient } from "@/config/appwrite";
import checkAuth from "./checkAuth";
import { ID } from "node-appwrite";
import { revalidatePath } from "next/cache";

async function createRoom(previousState , formData) {
    // get database instance

    // we are getting these from the appwrite file in the config folder
    const {databases , storage} = await createAdminClient();

    try {
        const {user} = await checkAuth();

        if(!user){
            return {
                error: 'You must be logged in to create the room',
            };
        }

        // uploading the image
        let imageID;
        
        // cuz in the form the name for the image tag is 'image'
        const image = formData.get('image');

        if(image && image.size > 0 && image.name !== 'undefined'){
            try {
                // upload

                // self explanatory
                const response = await storage.createFile('rooms' , ID.unique() , image);
                imageID = response.$id;
            } catch (error) {
                console.log('Error uploading image' , error);
                return{
                    error: 'Error uploading image',
                };
            }
        }
        else{
            console.log('No file is provided or file is invalid');
        }

        // creating the room
        const newRoom = await databases.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
            ID.unique(),
            {
                user_id: user.id,
                name : formData.get('name'),
                description: formData.get('description'),
                sqft: formData.get('sqft'),
                capacity: formData.get('capacity'),
                location: formData.get('location'),
                address: formData.get('address'),
                availability: formData.get('availability'),
                price_per_hour: formData.get('price_per_hour'),
                amenities: formData.get('amenities'),
                image: imageID,
            }
        );

        revalidatePath('/' , 'layout');

        return{
            success: true,
        };
    } catch (error) {
        console.log(error);
        const errorMessage = error.response.message || 'An unexpected error has been occured';

        return{
            error:errorMessage,
        }; 
    }
}

export default createRoom;