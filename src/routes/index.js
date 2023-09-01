import Home from "~/pages/Home/index";
import CreateGroup from "~/pages/CreateGroup/index";
import Users from "~/pages/Users/index";
import Login from "~/pages/Login/login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DefaultLayout } from "~/components/Layout";
import { RequireAuth } from "react-auth-kit";

const MainRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path={"/login"} element={<Login />} exact />
        {/* Home */}
        <Route
          path={"/"}
          element={
            <RequireAuth loginPath={"/login"}>
              <DefaultLayout>
                <Home />
              </DefaultLayout>
            </RequireAuth>
          }
          exact
        />
        <Route
          path={"/createGroup"}
          element={
            <RequireAuth loginPath={"/login"}>
              <DefaultLayout>
                <CreateGroup />
              </DefaultLayout>
            </RequireAuth>
          }
          exact
        />
        <Route
          path={"/users/:group_id"}
          element={
            <RequireAuth loginPath={"/login"}>
              <DefaultLayout>
                <Users />
              </DefaultLayout>
            </RequireAuth>
          }
          exact
        />
      </Routes>
    </BrowserRouter>
  );
};

export default MainRoutes;
