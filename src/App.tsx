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
import ImportExportCSV from "@pages/ImportExportCSV";
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
import UserProfile from "@pages/UserProfile";
import { useEffect } from "preact/hooks";
import ErrorBanner from "./components/ErrorBanner";
import { categoriesList } from "./api/product/categoriesList";
import IssueInventory from "@pages/IssueInventory";
import ItemTransfer from "@pages/ItemTransfer";

const App = () => {
  const isServerDown = useSignal<boolean>(false);
  const currentUrl = useSignal<string>(getCurrentUrl());
  const publicRoute = ["/welcome", "/login", "/forgot-password"];
  const getCategory = async () => {
    try {
      await categoriesList({ limit: 1, offset: 0 });
    } catch (error) {
      isServerDown.value = true;
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  const userState = isUser.value ? user.state.value : admin.state.value;

  if (isServerDown.value) {
    return <ErrorBanner errorMessage="We have an internal server error!" />;
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
      onChange={(e: RouterOnChangeArgs) => {
        (currentUrl.value = e.url), window.scrollTo({ top: 0 });
      }}
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
      <Route path="/item-transfer" component={ItemTransfer} />
      <Route path="/import-export-csv" component={ImportExportCSV} />
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
      <Route path="/user/:id" component={UserProfile} />
      <Route path="/issue-inventory" component={IssueInventory} />
    </Router>
  );
};

export default App;
