import { useState, useEffect } from "react";
import { fetchDashboardItems } from "../utils/fetch-dashboard";
import { dashboards } from "../config/embed-token";
import type {
  DashboardItem,
  GridChartLayout,
  ChartLibraryState,
} from "../types";

/**
 * Custom hook to manage the chart library state and operations
 * Handles fetching available charts and managing the library modal state
 */
export function useChartLibrary(
  currentDashboardItems: GridChartLayout[]
): ChartLibraryState & {
  handleClose: (onClose: () => void) => void;
} {
  const [items, setItems] = useState<GridChartLayout[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  /**
   * Transforms API response items into grid layout format
   * @param items - Items from the API
   * @param dashboardId - ID of the dashboard these items belong to
   */
  const createLayoutItems = (
    items: DashboardItem[],
    dashboardId: string
  ): GridChartLayout[] =>
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
        // Fetch items from both the library and default dashboard
        const [libraryItems, defaultItems] = await Promise.all([
          fetchDashboardItems(dashboards.chartLibrary),
          fetchDashboardItems(dashboards.defaultGrid),
        ]);

        const allItems = [
          ...createLayoutItems(libraryItems, dashboards.chartLibrary),
          ...createLayoutItems(defaultItems, dashboards.defaultGrid),
        ];

        // Filter out items that are already in the dashboard
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

  /**
   * Handles the closing animation of the library modal
   */
  const handleClose = (onClose: () => void) => {
    setIsClosing(true);
    setTimeout(onClose, 200);
  };

  return {
    items,
    error,
    isClosing,
    handleClose,
  };
}
