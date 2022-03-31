import { getSession } from "next-auth/react";

const HomePage = (props) => {
  return <div>I am Logged In</div>;
};
export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
export default HomePage;
