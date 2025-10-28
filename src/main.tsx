import { createRoot } from 'react-dom/client'
import * as Sentry from "@sentry/react";
import App from './App.tsx'
import './index.css'

Sentry.init({
  dsn: "https://51a6c70b0d1745d01f77d03df65d6bd6@o4510269412081664.ingest.us.sentry.io/4510269438099456",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration()
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/tail-fade-flow\.vercel\.app\.io\/api/],
  // Enable logs to be sent to Sentry
  enableLogs: true
});

createRoot(document.getElementById("root")!).render(<App />);
