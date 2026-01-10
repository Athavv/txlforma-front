import { Navigate } from "react-router-dom";
import { authService } from "../../api/auth.service";
import { ROUTES } from "../../constants";

function PrivateRoute({ children, role }) {
  if (!authService.isAuthenticated()) return <Navigate to={ROUTES.LOGIN} />;

  if (role && authService.getRole() !== role)
    return <Navigate to={ROUTES.HOME} />;

  return children;
}
export default PrivateRoute;
