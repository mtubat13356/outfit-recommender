// Use in a route's catch block when something fails on OUR side
// (e.g. the database is down).
// - Logs the full error on the server, so we can debug it.
// - Sends the user only a vague message: raw errors can leak internal
//   details (table names, file paths, connection info).
export function serverError(context: string, error: unknown) {
  console.error(`[${context}]`, error);
  return Response.json(
    { error: "Something went wrong on our side. Please try again." },
    { status: 500 }
  );
}
