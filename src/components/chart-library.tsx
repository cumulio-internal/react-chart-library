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
  currentDashboardItems: ExtendedLayout[];
}

interface DashboardItem {
  id: string;
  position: {
    col: number;
    row: number;
    sizeX: number;
    sizeY: number;
  };
}

export function ChartLibrary({
  onAddChart,
  onClose,
  currentDashboardItems,
}: ChartLibraryProps) {
  const [items, setItems] = useState<ExtendedLayout[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const createLayoutItems = (items: DashboardItem[], dashboardId: string) =>
    items.map((item) => ({
      i: item.id,
      x: item.position.col,
      y: item.position.row,
      w: item.position.sizeX,
      h: item.position.sizeY,
      dashboardId,
    }));

  useEffect(() => {
    const getLibraryItems = async () => {
      try {
        const [libraryItems, defaultItems] = await Promise.all([
          fetchDashboardItems(dashboards.chartLibrary),
          fetchDashboardItems(dashboards.defaultGrid),
        ]);

        const allItems = [
          ...createLayoutItems(libraryItems, dashboards.chartLibrary),
          ...createLayoutItems(defaultItems, dashboards.defaultGrid),
        ];

        const currentIds = new Set(currentDashboardItems.map((item) => item.i));
        const availableItems = allItems.filter(
          (item) => !currentIds.has(item.i)
        );

        setItems(availableItems);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch chart library"
        );
      }
    };

    getLibraryItems();
  }, [currentDashboardItems]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 200);
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className={`chart-library ${isClosing ? "closing" : ""}`}>
      <div className="chart-library-header">
        <h1>Chart Library</h1>
        <button onClick={handleClose} className="close-button">
          ✕
        </button>
      </div>

      <div className="chart-list">
        {items.map((item) => (
          <div key={item.i} className="chart-item">
            <button
              onClick={() => {
                onAddChart(item);
                handleClose();
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
