import { ChartLibrary } from "./components/chart-library";
import { useDashboardGrid } from "./hooks/use-dashboard-grid";
import { DashboardGrid } from "./components/dashboard-grid";
import { dashboards } from "./config/embed-token";

function App() {
  const {
    items,
    error,
    isEditMode,
    showLibrary,
    handleAddChart,
    handleRemoveChart,
    handleLayoutChange,
    setIsEditMode,
    setShowLibrary,
  } = useDashboardGrid();

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

      <DashboardGrid
        items={items}
        isEditMode={isEditMode}
        onLayoutChange={handleLayoutChange}
        onRemoveChart={handleRemoveChart}
      />

      {showLibrary && (
        <ChartLibrary
          onAddChart={handleAddChart}
          onClose={() => setShowLibrary(false)}
          currentDashboardItems={items}
        />
      )}

      <div className="dashboard-footer">
        <div className="dashboard-ids">
          <div>
            <span className="dashboard-id-label">Default Dashboard ID: </span>
            <span className="dashboard-id">{dashboards.defaultGrid}</span>
          </div>
          <div>
            <span className="dashboard-id-label">
              Chart Library Dashboard ID:{" "}
            </span>
            <span className="dashboard-id">{dashboards.chartLibrary}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
