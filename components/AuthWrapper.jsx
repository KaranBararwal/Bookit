'use client'
import { AuthProvider } from "@/context/authContext";

const AuthWrapper = ({children}) => {
    return <AuthProvider>{children}</AuthProvider>
}

export default AuthWrapper;

// we are making it in a seprate component instead of adding directy AuthProvide in the layout cuz then we need to  make the layout a client compnent that we don't want