import Account from "@pages/Account";
import Guide from "@pages/Guide";
import Home from "@pages/Home";
import Login from "@pages/Login";
import Request from "@pages/Request";
import Signup from "@pages/Signup";
import Welcome from "@pages/Welcome";
import Router, { Route } from "preact-router";

const App = () => {
  return (
    <Router>
      <Route path="/" component={Guide} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/home" component={Home} />
      <Route path="/account" component={Account} />
      <Route path="/create-requests" component={Request} />
    </Router>
  );
};

export default App;
