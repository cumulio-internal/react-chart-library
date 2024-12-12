import { useEffect, useState } from "react";
import GridLayout from "react-grid-layout";
import { fetchDashboardItems } from "./utils/fetch-dashboard";
import { dashboards, embedToken } from "./config/embed-token";
import type { Layout } from "react-grid-layout";
import { LuzmoVizItemComponent } from "@luzmo/react-embed";
import { ChartLibrary } from "./components/chart-library";

interface ExtendedLayout extends Layout {
  dashboardId: string;
}

function App() {
  const [items, setItems] = useState<ExtendedLayout[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);

  useEffect(() => {
    const getDashboardItems = async () => {
      try {
        const dashboardItems = await fetchDashboardItems(
          dashboards.defaultGrid
        );
        console.log(dashboardItems);
        const layoutItems = dashboardItems.map((item) => ({
          i: item.id,
          x: item.position.col,
          y: item.position.row,
          w: item.position.sizeX,
          h: item.position.sizeY,
          dashboardId: dashboards.defaultGrid,
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

  const handleAddChart = (newChart: ExtendedLayout) => {
    // Create a new chart with proper positioning
    const chartWithPosition = {
      i: newChart.i, // Preserve the original ID
      x: 0,
      y: Infinity,
      w: newChart.w, // Keep original width
      h: newChart.h, // Keep original height
      dashboardId: newChart.dashboardId,
    };

    // Add the new chart to the grid
    setItems((currentItems) => [...currentItems, chartWithPosition]);
    setShowLibrary(false);

    // Scroll to bottom with animation
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }, 100); // Small delay to ensure the new chart is rendered
  };

  const handleRemoveChart = (itemId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.i !== itemId)
    );
  };

  const handleLayoutChange = (newLayout: Layout[]) => {
    // Preserve the dashboardId when updating the layout
    const updatedLayout = newLayout.map((item) => ({
      ...item,
      dashboardId:
        items.find((oldItem) => oldItem.i === item.i)?.dashboardId ||
        dashboards.defaultGrid,
    }));
    setItems(updatedLayout);
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
              className="add-chart-from-library-button"
              onClick={() => setShowLibrary(true)}
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
        width={1584}
        className={`grid-layout ${isEditMode ? "edit-mode" : ""}`}
        margin={[16, 16]}
        useCSSTransforms={false}
        isDraggable={isEditMode}
        isResizable={isEditMode}
        resizeHandles={["s", "w", "e", "n", "sw", "nw", "se", "ne"]}
        compactType="vertical"
        preventCollision={false}
        onLayoutChange={handleLayoutChange}
      >
        {items.map((item) => (
          <div key={item.i} className="grid-item-container">
            {isEditMode && (
              <button
                className="remove-chart-button"
                onClick={() => handleRemoveChart(item.i)}
              >
                Remove
              </button>
            )}
            <LuzmoVizItemComponent
              key={item.i}
              authKey={embedToken.authKey}
              authToken={embedToken.authToken}
              dashboardId={item.dashboardId}
              itemId={item.i}
              canFilter="all"
            />
          </div>
        ))}
      </GridLayout>

      {showLibrary && (
        <ChartLibrary
          onAddChart={handleAddChart}
          onClose={() => setShowLibrary(false)}
          currentDashboardItems={items}
        />
      )}
    </div>
  );
}

export default App;
