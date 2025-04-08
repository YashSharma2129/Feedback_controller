import { useState } from "react";
import "./App.css";
import FeedbackForm from "./components/FeedbackForm";
import AdminFeedbackList from "./components/AdminFeedbackList";
import Footer from "./components/Footer";
import { ThemeProvider } from "./components/ThemeProvider";
import { ThemeToggle } from "./components/ThemeToggle";
import { Toaster } from "./components/ui/toaster";
import { useToast } from "./components/ui/use-toast";

function App() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [showFeedbacks, setShowFeedbacks] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (data) => {
    try {
      const response = await fetch('/.netlify/functions/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to submit feedback');

      const result = await response.json();
      setFeedbacks(prev => [result.feedback, ...prev]);
      
      toast({
        title: "Success!",
        description: "Your feedback has been submitted successfully.",
      });
      
      return result;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
      });
      throw err;
    }
  };

  const fetchFeedbacks = async () => {
    if (hasLoaded) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/.netlify/functions/get-feedback');
      if (!response.ok) throw new Error('Failed to fetch feedbacks');
      
      const data = await response.json();
      setFeedbacks(data);
      setHasLoaded(true);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load feedbacks. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFeedbacks = () => {
    setShowFeedbacks(!showFeedbacks);
    if (!showFeedbacks) {
      fetchFeedbacks();
    }
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="min-h-screen flex flex-col items-center bg-background transition-colors duration-300">
        <main className="w-full flex-1 flex flex-col items-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl flex justify-end mb-4">
            <ThemeToggle />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-foreground">
            Feedback Collector
          </h1>

          <FeedbackForm onSubmit={handleFormSubmit} />
          
          <button
            onClick={handleToggleFeedbacks}
            className="mt-8 px-4 py-2 bg-secondary text-secondary-foreground rounded 
                     hover:bg-secondary/80 transition-all duration-300 transform hover:scale-105"
          >
            {showFeedbacks ? "Hide" : "View"} Submitted Feedback
          </button>
          
          {showFeedbacks && (
            <div className="mt-8 w-full max-w-4xl animate-in fade-in slide-in-from-bottom duration-500">
              {isLoading ? (
                <div className="text-center text-muted-foreground">
                  Loading feedbacks...
                </div>
              ) : (
                <AdminFeedbackList feedbacks={feedbacks} />
              )}
            </div>
          )}
        </main>
        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
