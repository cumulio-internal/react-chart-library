import { useEffect, useState } from "react";
import "./App.css";
import GridLayout from "react-grid-layout";
import { fetchDashboardItems } from "./utils/fetch-dashboard";
import { dashboards, embedToken } from "./config/embed-token";
import type { Layout } from "react-grid-layout";
import { LuzmoVizItemComponent } from "@luzmo/react-embed";
import { ChartLibrary } from "./components/chart-library";

function App() {
  const [items, setItems] = useState<Layout[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);

  useEffect(() => {
    const getDashboardItems = async () => {
      try {
        const dashboardItems = await fetchDashboardItems(
          dashboards.defaultGrid
        );
        const layoutItems = dashboardItems.map((item) => ({
          i: item.id,
          x: item.position.col,
          y: item.position.row,
          w: item.position.sizeX,
          h: item.position.sizeY,
        }));
        setItems(layoutItems);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch dashboard items"
        );
      }
    };

    getDashboardItems();
  }, []);

  const handleAddChart = (newChart: Layout) => {
    // Find the highest y position to add the new chart at the bottom
    const maxY = Math.max(...items.map((item) => item.y + item.h), 0);
    const chartWithPosition = {
      ...newChart,
      y: maxY + 1, // Add some spacing
    };
    setItems([...items, chartWithPosition]);
    setShowLibrary(false);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-actions">
          {isEditMode && (
            <button
              onClick={() => setShowLibrary(true)}
              className="add-chart-button"
            >
              Add Chart
            </button>
          )}
          <label className="edit-mode-toggle">
            <input
              type="checkbox"
              checked={isEditMode}
              onChange={(e) => setIsEditMode(e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Edit Mode</span>
          </label>
        </div>
      </div>

      <GridLayout
        layout={items}
        cols={48}
        rowHeight={0}
        width={1568}
        className={`grid-layout ${isEditMode ? "edit-mode" : ""}`}
        margin={[16, 16]}
        useCSSTransforms={false}
        isDraggable={isEditMode}
        isResizable={isEditMode}
        resizeHandles={["s", "w", "e", "n", "sw", "nw", "se", "ne"]}
      >
        {items.map((item) => (
          <LuzmoVizItemComponent
            key={item.i}
            authKey={embedToken.authKey}
            authToken={embedToken.authToken}
            dashboardId={dashboards.defaultGrid}
            itemId={item.i}
          />
        ))}
      </GridLayout>

      {showLibrary && (
        <ChartLibrary
          onAddChart={handleAddChart}
          onClose={() => setShowLibrary(false)}
        />
      )}
    </div>
  );
}

export default App;
