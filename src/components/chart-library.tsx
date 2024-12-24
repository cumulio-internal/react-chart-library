// src/components/ChartLibrary.tsx
import { LuzmoVizItemComponent } from "@luzmo/react-embed";
import { embedToken } from "../config/embed-token";
import { useChartLibrary } from "../hooks/use-chart-library";
import type { ChartLibraryProps } from "../types";
import { CustomChart } from "./custom-chart/custom-chart";

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
        {/* Custom chart preview */}
        <div className="chart-item">
          <button
            onClick={() => {
              onAddChart({
                i: "custom-chart",
                x: 0,
                y: 0,
                w: 48,
                h: 48,
                dashboardId: "custom",
                isCustomChart: true,
              });
              handleClose(onClose);
            }}
            className="add-chart-button"
          >
            Add Custom Chart
          </button>
          <div className="chart-preview">
            <CustomChart />
          </div>
        </div>
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
