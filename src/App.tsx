import Login from "@pages/Login";
import Welcome from "@pages/Welcome";
import Router, { Route } from "preact-router";

const App = () => {
  return (
    <Router>
      <Route path="/" component={Welcome} />
      <Route path="/login" component={Login} />
    </Router>
  );
};

export default App;
