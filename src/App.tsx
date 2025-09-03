  import { useEffect } from "react";
  import { Toaster } from "@/components/ui/toaster";
  import { Toaster as Sonner } from "@/components/ui/sonner";
  import { TooltipProvider } from "@/components/ui/tooltip";
  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  import { BrowserRouter, Routes, Route } from "react-router-dom";
  import Index from "./pages/Index";
  import NotFound from "./pages/NotFound";
  import { supabase } from "./integrations/supabase/client";

  const queryClient = new QueryClient();

  function App() {
    useEffect(() => {
      const handler = async (event: MessageEvent) => {

        if (event.origin !== "https://consultory.netlify.app") {
          return; // only accept messages from parent app
        }

        if (event.data.type === "supabase-auth") {
          const session = event.data.session;

          if (session) {
            const { data, error } = await supabase.auth.setSession(session);
          } else {
            await supabase.auth.signOut();
          }
        }
      };

      window.addEventListener("message", handler);
      return () => window.removeEventListener("message", handler);
    }, []);

    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  export default App;
