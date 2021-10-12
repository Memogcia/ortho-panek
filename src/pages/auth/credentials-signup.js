import SignUp from "components/SignUp";
import { getCsrfToken } from "next-auth/client";

export default function credentialsSignIn({ csrfToken }) {
  return <SignUp csrfToken={csrfToken} />;
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
