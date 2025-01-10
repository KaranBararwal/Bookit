import { NextResponse } from "next/server";
import checkAuth from "./app/actions/checkAuth";

export async function middleware(request) {
    // const {pathname} = request.nextUrl;

    // console.log(`Requested Page : ${pathname}`);


    // if the user is not logged in than it will be redirected to the login page

    const {isAuthenticated} = await checkAuth();

    if(!isAuthenticated){
        return NextResponse.redirect(new URL('/login' , request.url));
    }

    return NextResponse.next();
}

// if we want to run it only for a specific page

// protected pages so anyone without login or permission can't go there
export const config = {
    matcher : ['/bookings' , '/rooms/add' , '/rooms/my'],
};