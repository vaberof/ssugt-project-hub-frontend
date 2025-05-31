import { useAuth } from "../context/AuthContext";
import { Header } from "./Header";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  return (
    <>
      <Header isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
      <main>{children}</main>
    </>
  );
};
export default Layout;
