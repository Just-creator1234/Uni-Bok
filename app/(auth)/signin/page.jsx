import { getUser } from "@/app/actions/updateUser";
import Signin from "./Signin";
const Signing = async () => {
  const user = await getUser();

  return <Signin user={user || {}} />;
};

export default Signing;
