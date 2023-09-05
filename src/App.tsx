import Account from "@pages/Account";
import Guide from "@pages/Guide";
import Home from "@pages/Home";
import Login from "@pages/Login";
import Request from "@pages/Request";
import RequestItems from "@pages/RequestItems";
import Signup from "@pages/Signup";
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
import Fulfill from "@pages/Fulfill";
import Approve from "@pages/Approve";
import Master from "@pages/Master";
import CategoryMaster from "@pages/CategoryMaster";

const App = () => {
  const currentUrl = useSignal<string>(getCurrentUrl());
  const publicRoute = ["/welcome", "/login", "/signup"];

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
    currentUrl.value !== "/"
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
      <Route path="/signup" component={Signup} />
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
      <Route path="/fulfill" component={Fulfill} />
      <Route path="/approve" component={Approve} />
      <Route path="/master" component={Master} />
      <Route path="/category-master" component={CategoryMaster} />
    </Router>
  );
};

export default App;
