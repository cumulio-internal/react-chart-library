import { useState, useEffect } from "react";
import type { Layout } from "react-grid-layout";
import { fetchDashboardItems } from "../utils/fetch-dashboard";
import { dashboards } from "../config/embed-token";
import {
  DashboardGridState,
  DashboardGridActions,
  GridChartLayout,
} from "../types";

/**
 * Custom hook to manage the dashboard grid's state and operations
 * Handles fetching, adding, removing, and updating chart positions
 * @returns Combined state and actions for the dashboard grid
 */
export function useDashboardGrid(): DashboardGridState & DashboardGridActions {
  // Core state for managing dashboard items and UI state
  const [items, setItems] = useState<GridChartLayout[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);

  // Fetch initial dashboard items on mount
  useEffect(() => {
    const getDashboardItems = async () => {
      try {
        const dashboardItems = await fetchDashboardItems(
          dashboards.defaultGrid
        );
        // Transform API response into grid layout format
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

  /**
   * Adds a new chart to the grid
   * Places the chart at the bottom of the grid and scrolls to it
   * @param newChart - The chart configuration to add
   */
  const handleAddChart = (newChart: GridChartLayout) => {
    const chartWithPosition = {
      i: newChart.i,
      x: 0, // Start at the leftmost position
      y: Infinity, // Place at the bottom of the grid
      w: newChart.w,
      h: newChart.h,
      dashboardId: newChart.dashboardId,
    };

    setItems((currentItems) => [...currentItems, chartWithPosition]);
    setShowLibrary(false);

    // Scroll to the newly added chart
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  /**
   * Removes a chart from the grid
   * @param itemId - ID of the chart to remove
   */
  const handleRemoveChart = (itemId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.i !== itemId)
    );
  };

  /**
   * Updates the layout when charts are moved or resized
   * Preserves the dashboardId when updating positions
   * @param newLayout - The new layout configuration from react-grid-layout
   */
  const handleLayoutChange = (newLayout: Layout[]) => {
    const updatedLayout = newLayout.map((item) => ({
      ...item,
      dashboardId:
        items.find((oldItem) => oldItem.i === item.i)?.dashboardId ||
        dashboards.defaultGrid,
    }));
    setItems(updatedLayout);
  };

  return {
    items,
    error,
    isEditMode,
    showLibrary,
    handleAddChart,
    handleRemoveChart,
    handleLayoutChange,
    setIsEditMode,
    setShowLibrary,
  };
}
