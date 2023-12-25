import React from 'react';
import { AuthProvider } from "react-auth-kit";
import MainRoutes from "~/routes";
import refreshApi from "./components/RefreshToken/RefreshToken.js";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import { createContext } from "react";

export const FireBaseContext = createContext();

function App() {
  return (
    <AuthProvider
      authType={"localstorage"}
      authName={"token"}
      refresh={refreshApi}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MainRoutes />
      </LocalizationProvider>
    </AuthProvider>
  );
}

export default App;

