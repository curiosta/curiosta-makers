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

const App = () => {
  const currentUrl = useSignal<string>(getCurrentUrl());
  const publicRoute = ["/welcome", "/login", "/forgot-password"];

  const userState = isUser.value ? user.state.value : admin.state.value;

  if (!publicRoute.includes(currentUrl.value) && userState === "loading") {
    return (
      <div className="h-screen">
        <Loading loadingText="loading" />
      </div>
    );
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
      <Route path="/product/:id" component={ProductInfo} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/password-reset" component={PasswordReset} />
      <Route path="/material-master" component={MaterialMaster} />
      <Route path="/material-master/edit/:id" component={ProductEdit} />
    </Router>
  );
};

export default App;
