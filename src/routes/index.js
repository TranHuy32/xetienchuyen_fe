import Home from "~/pages/Home/index";
import CreateGroup from "~/pages/CreateGroup/index";
import Users from "~/pages/Users/index";
import Login from "~/pages/Login/login";
import FollowProvince from "~/pages/FollowProvince";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DefaultLayout } from "~/components/Layout";
import { RequireAuth } from "react-auth-kit";
import CreateUser from "~/pages/CreateUser";

const MainRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path={"/"} element={<Login />} exact />
        {/* Home */}
        {/* <Route
          path={"/"}
          element={
            <RequireAuth loginPath={"/login"}>
              <DefaultLayout>
                <Home />
              </DefaultLayout>
            </RequireAuth>
          }
          exact
        /> */}
        <Route
          path={"/createGroup"}
          element={
            <RequireAuth loginPath={"/"}>
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
            <RequireAuth loginPath={"/"}>
              <DefaultLayout>
                <Users />
              </DefaultLayout>
            </RequireAuth>
          }
          exact
        />
        <Route
          path={"/createUser"}
          element={
            <RequireAuth loginPath={"/"}>
              <DefaultLayout>
                <CreateUser />
              </DefaultLayout>
            </RequireAuth>
          }
          exact
        />
        <Route
          path={"/followProvince"}
          element={
            <RequireAuth loginPath={"/"}>
              <DefaultLayout>
                <FollowProvince />
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