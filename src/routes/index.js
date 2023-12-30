
import CreateGroup from "~/pages/CreateGroup/index";
import Users from "~/pages/Users/index";
import Login from "~/pages/Login/login";
import FollowProvince from "~/pages/FollowProvince";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DefaultLayout } from "~/components/Layout";
import { RequireAuth } from "react-auth-kit";
import CreateUser from "~/pages/CreateUser";
import Transaction from "~/pages/Transaction";
import DetailUser from "~/pages/DetailUser";
import Recharge from "~/pages/Recharge";

import UsersManual from "~/pages/UserManual";
import NapTien from "~/pages/naptien/naptien";
import RutTien from "~/pages/ruttien/ruttien";

import AdminDefaultLayout from "~/components/Layout/AdminDefaultLayout/AdminDefaultLayout";
import AdminLogin from "~/AdminPages/AdminLogin";
import AdminHome from "~/AdminPages/AdminHome";
import AdminAds from "~/AdminPages/AdminAds/index"
import AdminOwner from "~/AdminPages/AdminOwner/index"

const MainRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* admin routes */}
        <Route path={"/adminlogin"} element={<AdminLogin />} exact />

        <Route path={"/adminlogin/adminhome"} element={<RequireAuth loginPath={"/adminlogin"}><AdminDefaultLayout><AdminHome /></AdminDefaultLayout></RequireAuth>} exact />

        <Route path={"/adminlogin/adminadsmanager"} element={<RequireAuth loginPath={"/adminlogin"}><AdminDefaultLayout><AdminAds /></AdminDefaultLayout></RequireAuth>} exact />

        <Route path={"/adminlogin/adminownermanager"} element={<RequireAuth loginPath={"/adminlogin"}><AdminDefaultLayout><AdminOwner /></AdminDefaultLayout></RequireAuth>} exact />
        {/* user ROUTES */}
        {/* <Route path={"/naptien"} element={<NapTien />} exact /> */}
        <Route path={"/usermanual"} element={<UsersManual />} exact />
        <Route path={"/usermanual/naptien"} element={<NapTien />} exact />
        <Route path={"/usermanual/ruttien"} element={<RutTien />} exact />

        <Route path={"/"} element={<Login />} exact />

        <Route path={"/createGroup"} element={<RequireAuth loginPath={"/"}><DefaultLayout><CreateGroup /></DefaultLayout></RequireAuth>} exact />
        <Route path={"/users/:group_id"} element={<RequireAuth loginPath={"/"}><DefaultLayout><Users /></DefaultLayout></RequireAuth>} exact />
        <Route path={"/createUser"} element={<RequireAuth loginPath={"/"}><DefaultLayout><CreateUser /></DefaultLayout></RequireAuth>} exact />
        <Route path={"/recharge"} element={<RequireAuth loginPath={"/"}><DefaultLayout><Recharge /></DefaultLayout></RequireAuth>} exact />
        <Route path={"/followProvince"} element={<RequireAuth loginPath={"/"}><DefaultLayout><FollowProvince /></DefaultLayout></RequireAuth>} exact />
        <Route path={"/transaction/:group_id"} element={<RequireAuth loginPath={"/"}><DefaultLayout><Transaction /></DefaultLayout></RequireAuth>} exact />
        <Route path={"/userDetail/:user_id"} element={<RequireAuth loginPath={"/"}><DefaultLayout><DetailUser /></DefaultLayout></RequireAuth>} exact />
      </Routes>
    </BrowserRouter>
  );
};

export default MainRoutes;
