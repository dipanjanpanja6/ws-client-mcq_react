import { useSelector } from "react-redux";
import Loading from "../components/Loading/Loading";
import { Redirect } from "react-router";

const WithAuth = ({ children }) => {
  const auth = useSelector(state => state.user.auth);
  return auth === null ? <Loading /> : auth === true ? children : <Redirect to="/login" />;
};

export default WithAuth;
