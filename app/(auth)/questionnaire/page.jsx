// app/questionnaire/page.js
import Form from "./Form";

const QuestionnairePage = async ({ searchParams }) => {
  // Get userId from query parameters
  const userId = await searchParams.userId;

  return <Form userId={userId} />;
};

export default QuestionnairePage;
