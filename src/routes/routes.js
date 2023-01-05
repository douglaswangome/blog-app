import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import MyBlogs from "../pages/MyBlogs";
import MyProfile from "../pages/MyProfile";
import NotFound from "../pages/NotFound";

const app_router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />
  },
  {
    path: "/myblogs/:username",
    element: <MyBlogs />,
    errorElement: <NotFound />
  },
  {
    path: "/myblogs/",
    element: <MyBlogs />,
    errorElement: <NotFound />
  },
  {
    path: "/myprofile/:username",
    element: <MyProfile />,
    errorElement: <NotFound />
  },
  {
    path: "/myprofile",
    element: <MyProfile />,
    errorElement: <NotFound />
  }
]);

export default app_router;