import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./App";
import * as Sentry from "@sentry/react";
import "./css/index.css";
import ErrorBoundary from "./containers/Errors/ErrorBoundary";
import { InventoryProvider } from "./contexts/inventory.context.jsx";
import { OrdersProvider } from "./contexts/orders.context.jsx";

Sentry.init({
  dsn: "https://e214ebd47a774d789a8af571921ffda6@o4504973403029504.ingest.sentry.io/4504973408600064",
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <InventoryProvider>
      <OrdersProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </OrdersProvider>
    </InventoryProvider>{" "}
  </QueryClientProvider>,
);
