import type { Layout } from "react-grid-layout";

export interface GridChartLayout extends Layout {
  dashboardId: string;
}

export interface DashboardGridState {
  items: GridChartLayout[];
  error: string | null;
  isEditMode: boolean;
  showLibrary: boolean;
}

export interface DashboardGridActions {
  handleAddChart: (newChart: GridChartLayout) => void;
  handleRemoveChart: (itemId: string) => void;
  handleLayoutChange: (newLayout: Layout[]) => void;
  setIsEditMode: (isEdit: boolean) => void;
  setShowLibrary: (show: boolean) => void;
}

export interface DashboardItem {
  id: string;
  position: {
    col: number;
    row: number;
    sizeX: number;
    sizeY: number;
  };
}

export interface ChartLibraryState {
  items: GridChartLayout[];
  error: string | null;
  isClosing: boolean;
}

export interface ChartLibraryProps {
  onAddChart: (chart: GridChartLayout) => void;
  onClose: () => void;
  currentDashboardItems: GridChartLayout[];
}

// API Types
export interface DashboardApiItem {
  id: string;
  position: {
    sizeX: number;
    sizeY: number;
    row: number;
    col: number;
  };
}

export interface DashboardApiResponse {
  rows: [
    {
      contents: {
        views: [
          {
            items: DashboardApiItem[];
          }
        ];
      };
    }
  ];
}
