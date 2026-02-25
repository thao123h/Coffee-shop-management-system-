import { createContext, useState } from "react";
import { AuthContext } from "./AuthContext";



function AuthProvider( {children}){
    const [user,setUser] = useState(()=>{
        try{
            const savedUser = localStorage.getItem('user')
            console.log("user from local storage", savedUser)
            return savedUser ? JSON.parse(savedUser) : null
        }
        catch(error){
            console.error('Error parsing user data from localStorage:', error)
            return null
        }
    })
    const [loading, setLoading] = useState(false)
 const login = (loginResponse) => {
    const { accessToken, tokenType, username, role } = loginResponse || {};

    if (accessToken && tokenType) {
        localStorage.setItem("token", `${tokenType} ${accessToken}`);
    }

    const userInfo = { username, role };
    localStorage.setItem("user", JSON.stringify(userInfo));

    setUser(userInfo);
};
  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setUser(null);
};
        const isAuthenticated = !!user;

        return (
                <AuthContext.Provider value = {{user, login, logout, loading, isAuthenticated}}>
                {!loading && children}
                </AuthContext.Provider>
        )

}
export default AuthProvider