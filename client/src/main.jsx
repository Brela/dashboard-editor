import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./App";
// import * as Sentry from "@sentry/react";
import "./css/index.css";
import ErrorBoundary from "./containers/Errors/ErrorBoundary";

import { AuthProvider } from "./contexts/auth.context.jsx";
import { DashboardProvider } from "./contexts/dash.context.jsx";

// this is for sending emails to me when there's an error
/* Sentry.init({
  dsn: "https://e214ebd47a774d789a8af571921ffda6@o4504973403029504.ingest.sentry.io/4504973408600064",
}); */

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </AuthProvider>
  </QueryClientProvider>,
);
