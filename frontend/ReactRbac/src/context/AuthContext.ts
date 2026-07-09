// import { useState } from "react";
// import { createContext } from "react";

// type AuthContextType = {
//     isAuthenticated: boolean;
// };

// export const AuthContext = createContext<AuthContextType | null>(null);

// const  AuthProvider = ({
//     children,
// }: {
//     children: React.ReactNode;
// }) => {
//     const [isAuthenticated, setIsAuthenticated] = useState(
//         !!localStorage.getItem("accessToken"),
//     );

//     return (
//         <AuthContext.Provider
//             value={{
//                 isAuthenticated,
//             }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
// }

// export default AuthProvider