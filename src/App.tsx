import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import "@aws-amplify/ui-react/styles.css";
import "./index.scss";
import "./styles/authenticator.scss";

Amplify.configure(outputs);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Authenticator>
        <Dashboard />
      </Authenticator>
    </QueryClientProvider>
  );
}

export default App;
