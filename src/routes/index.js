import Home from "~/pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DefaultLayout } from "~/components/Layout";
import { RequireAuth } from "react-auth-kit";

const MainRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route
          path={"/"}
          element={
            // <RequireAuth loginPath={'/publisher/login'}>
            <DefaultLayout>
              <Home />
            </DefaultLayout>
            // </RequireAuth>
          }
          exact
        />
      </Routes>
    </BrowserRouter>
  );
};

export default MainRoutes;
