import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "react-oidc-context";
import App from "./components/App";
import "./reset.css";

const cognitoAuthConfig = {
  authority: process.env.PUBLIC_AWS_COGNITO_AUTHORITY_URL,
  client_id: process.env.PUBLIC_AWS_COGNITO_CLIENT_ID,
  redirect_uri: process.env.PUBLIC_AWS_COGNITO_REDIRECT_URL,
  response_type: "code",
  scope: "email openid",
};

const rootEl = document.getElementById("root");
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(
    <StrictMode>
      <AuthProvider {...cognitoAuthConfig}>
        <App />
      </AuthProvider>
    </StrictMode>
  );
}
