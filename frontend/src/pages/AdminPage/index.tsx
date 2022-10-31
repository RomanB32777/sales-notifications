import { useAppSelector } from "../../redux/hooks";

import CongratulationFormBlock from "./congratulationForm";
import AuthBlock from "./auth";
import EmployeesBlock from "./employees";
import TransactionsBlock from "./transactions";
import SettingsBlock from "./settings";
import "./style.scss";

const AdminPage = () => {
  const user = useAppSelector((state) => state.user);

  return (
    <div className="page page-padding">
      {!user.isAuth ? (
        <AuthBlock />
      ) : (
        <>
          <CongratulationFormBlock />
          <SettingsBlock />
          <EmployeesBlock />
          <TransactionsBlock />
        </>
      )}
    </div>
  );
};

export default AdminPage;
