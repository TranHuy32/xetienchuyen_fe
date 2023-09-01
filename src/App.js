import { AuthProvider } from "react-auth-kit";
import MainRoutes from "~/routes";
import refreshApi from "./components/RefreshToken/RefreshToken.js";
import { createContext } from "react";

export const FireBaseContext = createContext();

function App() {
  return (
    <AuthProvider
      authType={"localstorage"}
      authName={"token"}
      refresh={refreshApi}
    >
      <MainRoutes />
    </AuthProvider>
  );
}

export default App;
