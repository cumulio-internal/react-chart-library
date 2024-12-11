// src/components/ChartLibrary.tsx
import { useEffect, useState } from "react";
import { fetchDashboardItems } from "../utils/fetch-dashboard";
import { dashboards, embedToken } from "../config/embed-token";
import { LuzmoVizItemComponent } from "@luzmo/react-embed";
import type { Layout } from "react-grid-layout";

interface ChartLibraryProps {
  onAddChart: (chart: Layout) => void;
  onClose: () => void;
}

export function ChartLibrary({ onAddChart, onClose }: ChartLibraryProps) {
  const [items, setItems] = useState<Layout[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getLibraryItems = async () => {
      try {
        const dashboardItems = await fetchDashboardItems(
          dashboards.chartLibrary
        );
        const layoutItems = dashboardItems.map((item) => ({
          i: item.id,
          x: 0, // Default position, will be adjusted when added to grid
          y: 0,
          w: item.position.sizeX,
          h: item.position.sizeY,
        }));
        setItems(layoutItems);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch chart library"
        );
      }
    };

    getLibraryItems();
  }, []);

  const filteredItems = items.filter((item) =>
    item.i.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="chart-library">
      <div className="chart-library-header">
        <h1>Chart Library</h1>
        <div className="chart-library-actions">
          <input
            type="search"
            placeholder="Search charts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button onClick={onClose} className="close-button">
            Close
          </button>
        </div>
      </div>

      <div className="chart-list">
        {filteredItems.map((item) => (
          <div key={item.i} className="chart-item">
            <div className="chart-item-header">
              <button
                onClick={() => onAddChart(item)}
                className="add-chart-button"
              >
                Add to dashboard
              </button>
            </div>
            <div className="chart-preview">
              <LuzmoVizItemComponent
                key={item.i}
                authKey={embedToken.authKey}
                authToken={embedToken.authToken}
                dashboardId={dashboards.chartLibrary}
                itemId={item.i}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
