import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Form from "./Form";
import { redirect } from "next/navigation";

const questionnairePage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }
  return <Form />;
};

export default questionnairePage;
