import { getSession } from "next-auth/client";

export default function Home() {
  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>{error.message}</div>;

  // if (user) {
  // return <div>TEST</div>;
  // }

  return null;
}

Home.auth = true;

export async function getServerSideProps(context) {
  return {
    props: {
      session: await getSession(context),
    },
  };
}
