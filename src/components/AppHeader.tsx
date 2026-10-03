import { useAuth } from "react-oidc-context";
import headerStyles from "../styles/AppHeader.module.css";

const AppHeader = () => {
  const auth = useAuth();

  if (auth.isLoading) {
    return <header>Loading...</header>;
  }

  if (auth.error) {
    return <header>Encountering error... {auth.error.message}</header>;
  }

  if (auth.isAuthenticated) {
    return (
      <header className={headerStyles.header}>
        <section className={headerStyles.header__controls}>
          <pre> Hello: {auth.user?.profile.email} </pre>
          {/* <pre> ID Token: {auth.user?.id_token} </pre>
          <pre> Access Token: {auth.user?.access_token} </pre>
          <pre> Refresh Token: {auth.user?.refresh_token} </pre> */}

          <button onClick={() => auth.removeUser()}>Sign out</button>
        </section>
      </header>
    );
  }

  return (
    <header className={headerStyles.header}>
      <section className={headerStyles.header__controls}>
        <button onClick={() => auth.signinRedirect()}>Sign in</button>
      </section>
    </header>
  );
};

export default AppHeader;
