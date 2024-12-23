// src/components/ChartLibrary.tsx
import { LuzmoVizItemComponent } from "@luzmo/react-embed";
import { embedToken } from "../config/embed-token";
import { useChartLibrary } from "../hooks/use-chart-library";
import type { ChartLibraryProps } from "../types";

export function ChartLibrary({
  onAddChart,
  onClose,
  currentDashboardItems,
}: ChartLibraryProps) {
  const { items, error, isClosing, handleClose } = useChartLibrary(
    currentDashboardItems
  );

  if (error) return <div>Error: {error}</div>;

  return (
    <div className={`chart-library ${isClosing ? "closing" : ""}`}>
      <div className="chart-library-header">
        <h1>Chart Library</h1>
        <button onClick={() => handleClose(onClose)} className="close-button">
          ✕
        </button>
      </div>

      <div className="chart-list">
        {items.map((item) => (
          <div key={item.i} className="chart-item">
            <button
              onClick={() => {
                onAddChart(item);
                handleClose(onClose);
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
