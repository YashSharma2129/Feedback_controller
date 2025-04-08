import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function AdminFeedbackList({ feedbacks = [] }) {
  if (feedbacks.length === 0) {
    return (
      <Card className="w-full max-w-4xl">
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            No feedback submitted yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl space-y-4">
      {feedbacks.map((feedback, index) => (
        <Card key={index} className="transition-all hover:shadow-lg">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {feedback.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feedback.email}
                </p>
              </div>
              {feedback.timestamp && (
                <span className="text-xs text-muted-foreground">
                  {new Date(feedback.timestamp).toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-foreground whitespace-pre-wrap">
              {feedback.message}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
