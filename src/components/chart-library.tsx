// src/components/ChartLibrary.tsx
import { useEffect, useState } from "react";
import { fetchDashboardItems } from "../utils/fetch-dashboard";
import { dashboards, embedToken } from "../config/embed-token";
import { LuzmoVizItemComponent } from "@luzmo/react-embed";
import type { Layout } from "react-grid-layout";

interface ExtendedLayout extends Layout {
  dashboardId: string;
}

interface ChartLibraryProps {
  onAddChart: (chart: ExtendedLayout) => void;
  onClose: () => void;
}

export function ChartLibrary({ onAddChart, onClose }: ChartLibraryProps) {
  const [items, setItems] = useState<ExtendedLayout[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getLibraryItems = async () => {
      try {
        const dashboardItems = await fetchDashboardItems(
          dashboards.chartLibrary
        );
        console.log(dashboardItems);
        const layoutItems = dashboardItems.map((item) => ({
          i: item.id,
          x: item.position.col,
          y: item.position.row,
          w: item.position.sizeX,
          h: item.position.sizeY,
          dashboardId: dashboards.chartLibrary,
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

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="chart-library">
      <div className="chart-library-header">
        <h1>Chart Library</h1>
        <button onClick={onClose} className="close-button">
          ✕
        </button>
      </div>

      <div className="chart-list">
        {items.map((item) => (
          <div key={item.i} className="chart-item">
            <button
              onClick={() => {
                onAddChart(item);
                onClose();
              }}
              className="add-chart-button"
            >
              Add to dashboard
            </button>
            <div className="chart-preview">
              <LuzmoVizItemComponent
                key={item.i}
                authKey={embedToken.authKey}
                authToken={embedToken.authToken}
                dashboardId={item.dashboardId}
                itemId={item.i}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
