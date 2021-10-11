import SignUp from "components/SignUp";
import { getCsrfToken } from "next-auth/client";

export default function credentialsSignIn({ csrfToken }) {
  return (
    <SignUp csrfToken={csrfToken} />
    // <form method="post" action="/api/auth/callback/credentials">
    //   <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
    //   <label>
    //     Username
    //     <input name="username" type="text" />
    //   </label>
    //   <label>
    //     Password
    //     <input name="password" type="password" />
    //   </label>
    //   <button type="submit">Sign in</button>
    // </form>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
