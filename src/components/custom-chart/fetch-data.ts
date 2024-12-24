import { embedToken } from "../../config/embed-token";

// More information about the API: https://developer.luzmo.com/api/getData
export async function fetchLuzmoData(filters?: any[]) {
  const response = await fetch("https://api.luzmo.com/0.1.0/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "get",
      version: "0.1.0",
      key: embedToken.authKey,
      token: embedToken.authToken,
      find: {
        queries: [
          {
            measures: [
              // Booking count column, aggregated by distinct count
              {
                column_id: "42d5bf84-6d50-4464-b5be-8b63f6566443",
                dataset_id: "c089126d-59aa-4029-9854-e03ef64126c4",
                aggregation: {
                  type: "distinctcount",
                },
              },
            ],
            dimensions: [
              // Hotel room column
              {
                column_id: "3b314617-2e47-48d7-baad-06a89f9336ea",
                dataset_id: "c089126d-59aa-4029-9854-e03ef64126c4",
              },
              // Booking date column aggregated by level 3 (month)
              {
                column_id: "b8f4cdc7-7253-4e04-aea2-770e27f79e60",
                dataset_id: "c089126d-59aa-4029-9854-e03ef64126c4",
                level: 3,
              },
            ],
            ...(filters && filters.length > 0 ? { filters } : {}),
          },
        ],
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
}
