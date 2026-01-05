import { Navigate } from "react-router-dom";
import { authService } from "../../api/auth.service";

function PrivateRoute({ children, role }) {
  if (!authService.isAuthenticated()) return <Navigate to="/login" />;

  if (role && authService.getRole() !== role) return <Navigate to="/" />;

  return children;
}
export default PrivateRoute;
