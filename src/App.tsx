import Account from "@pages/Account";
import Guide from "@pages/Guide";
import Home from "@pages/Home";
import Login from "@pages/Login";
import Request from "@pages/Request";
import RequestItems from "@pages/RequestItems";
import Welcome from "@pages/Welcome";
import { useSignal } from "@preact/signals";
import Router, {
  Route,
  RouterOnChangeArgs,
  getCurrentUrl,
} from "preact-router";
import user from "@api/user";
import Loading from "@/components/Loading";
import admin from "@api/admin";
import { isUser } from "@store/userState";
import PickItems from "@pages/PickItems";
import Cart from "@pages/Cart";
import Orders from "@pages/Orders";
import OrderInfo from "@components/Orders/OrderInfo";
import Return from "@pages/Return";
import ReturnItems from "@pages/ReturnItems";
import Inbound from "@pages/Inbound";
import Fulfill from "@pages/Fulfill";
import Approve from "@pages/Approve";
import Master from "@pages/Master";
import CategoryMaster from "@pages/CategoryMaster";
import ProductInfo from "@pages/ProductInfo";
import ForgotPassword from "@pages/ForgotPassword";
import PasswordReset from "@pages/PasswordReset";
import MaterialMaster from "@pages/MaterialMaster";
import ProductEdit from "@pages/ProductEdit";
import LocationMaster from "@pages/LocationMaster";
import AccessMaster from "@pages/AccessMaster";
import UserAccess from "@pages/UserAccess";
import AdminUserAccess from "@pages/AdminUserAccess";
import ProductAdd from "@pages/ProductAdd";
import SearchResult from "@pages/SearchResult";
import { listRegion } from "./api/region/listRegion";
import { useEffect } from "preact/hooks";
import Typography from "./components/Typography";

const App = () => {
  const isServerDown = useSignal<boolean>(false);
  const currentUrl = useSignal<string>(getCurrentUrl());
  const publicRoute = ["/welcome", "/login", "/forgot-password"];
  const getRegion = async () => {
    try {
      await listRegion({ limit: 2, offset: 0 });
    } catch (error) {
      console.log(error);
      isServerDown.value = true;
    }
  };
  console.log(isServerDown.value);

  useEffect(() => {
    // getRegion();
  }, []);

  const userState = isUser.value ? user.state.value : admin.state.value;

  if (!isServerDown.value) {
    return (
      <div className="flex flex-col h-screen justify-center items-center gap-2 ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-16 h-16  text-danger-600"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>

        <Typography size="body1/semi-bold" variant="error">
          We have an internal server error!
        </Typography>
        <Typography size="small/semi-bold">Please try again later.</Typography>
      </div>
    );
  } else {
    if (!publicRoute.includes(currentUrl.value) && userState === "loading") {
      return (
        <div className="h-screen">
          <Loading loadingText="loading" />
        </div>
      );
    }
  }

  // if user not authenticated then redirect to /login page
  if (
    !publicRoute.includes(currentUrl.value) &&
    userState !== "authenticated" &&
    currentUrl.value !== "/" &&
    !currentUrl.value.includes("/password-reset")
  ) {
    currentUrl.value = "/login";
  }
  // if user authenticated then redirect to /home page
  if (currentUrl.value === "/" && userState === "authenticated") {
    currentUrl.value = "/home";
  }

  return (
    <Router
      url={currentUrl.value}
      onChange={(e: RouterOnChangeArgs) => (currentUrl.value = e.url)}
    >
      <Route path="/" component={Guide} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/login" component={Login} />
      <Route path="/home" component={Home} />
      <Route path="/account" component={Account} />
      <Route path="/create-requests" component={Request} />
      <Route path="/create-requests/:id" component={RequestItems} />
      <Route path="/pick-items/:id" component={PickItems} />
      <Route path="/cart" component={Cart} />
      <Route path="/orders" component={Orders} />
      <Route path="/orders/:id" component={OrderInfo} />
      <Route path="/return" component={Return} />
      <Route path="/return/:order_id/:return_id?" component={ReturnItems} />
      <Route path="/inbound" component={Inbound} />
      <Route path="/fulfill" component={Fulfill} />
      <Route path="/approve" component={Approve} />
      <Route path="/master" component={Master} />
      <Route path="/category-master" component={CategoryMaster} />
      <Route path="/product/:id/:handle?" component={ProductInfo} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/password-reset" component={PasswordReset} />
      <Route path="/material-master" component={MaterialMaster} />
      <Route path="/material-master/add" component={ProductAdd} />
      <Route path="/material-master/edit/:id" component={ProductEdit} />
      <Route path="/location-master" component={LocationMaster} />
      <Route path="/access-master" component={AccessMaster} />
      <Route path="/access-master/user-access" component={UserAccess} />
      <Route path="/access-master/admin-access" component={AdminUserAccess} />
      <Route path="/search" component={SearchResult} />
    </Router>
  );
};

export default App;
