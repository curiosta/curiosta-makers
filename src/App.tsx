import Account from "@pages/Account";
import Home from "@pages/Home";
import Login from "@pages/Login";
import Signup from "@pages/Signup";
import Welcome from "@pages/Welcome";
import Router, { Route } from "preact-router";

const App = () => {
  return (
    <Router>
      <Route path="/" component={Welcome} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/home" component={Home} />
      <Route path="/account" component={Account} />
    </Router>
  );
};

export default App;
