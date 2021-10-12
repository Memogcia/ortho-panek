import SignIn from "components/SignIn";
import { getCsrfToken } from "next-auth/client";

export default function credentialsSignIn({ csrfToken }) {
  return <SignIn csrfToken={csrfToken} />;
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
