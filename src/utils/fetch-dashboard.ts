import { embedToken } from "../config/embed-token";

interface Item {
  id: string;
  position: {
    sizeX: number;
    sizeY: number;
    row: number;
    col: number;
  };
}

interface ApiResponse {
  rows: [
    {
      contents: {
        views: [
          {
            items: Item[];
          }
        ];
      };
    }
  ];
}

// Define the URL
const url = "https://api.luzmo.com/0.1.0/securable";

// Add error type
export class DashboardFetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DashboardFetchError";
  }
}

// Function to fetch data and parse items
export async function fetchDashboardItems(
  dashboardId: string
): Promise<Item[]> {
  if (!dashboardId) {
    throw new DashboardFetchError("Dashboard ID is required");
  }

  const payload = {
    action: "get",
    key: embedToken.authKey,
    token: embedToken.authToken,
    version: "0.1.0",
    find: {
      where: {
        id: dashboardId,
      },
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new DashboardFetchError(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();

    if (!data.rows?.[0]?.contents?.views?.[0]?.items) {
      throw new DashboardFetchError("Invalid dashboard data structure");
    }

    const items = data.rows[0].contents.views[0].items;

    return items;
  } catch (error) {
    if (error instanceof DashboardFetchError) {
      throw error;
    }
    console.error("Error:", error);
    throw new DashboardFetchError("Failed to fetch dashboard items");
  }
}
