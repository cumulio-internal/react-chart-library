import GridLayout from "react-grid-layout";
import { LuzmoVizItemComponent } from "@luzmo/react-embed";
import { embedToken } from "../config/embed-token";
import type { Layout } from "react-grid-layout";
import type { GridChartLayout } from "../types";
import { CustomChart } from "./custom-chart/custom-chart";

interface DashboardGridProps {
  items: GridChartLayout[];
  isEditMode: boolean;
  onLayoutChange: (newLayout: Layout[]) => void;
  onRemoveChart: (itemId: string) => void;
}

export function DashboardGrid({
  items,
  isEditMode,
  onLayoutChange,
  onRemoveChart,
}: DashboardGridProps) {
  return (
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
      onLayoutChange={onLayoutChange}
    >
      {items.map((item) => (
        <div key={item.i} className="grid-item-container">
          {isEditMode && (
            <button
              className="remove-chart-button"
              onClick={() => onRemoveChart(item.i)}
            >
              Remove
            </button>
          )}
          {item.isCustomChart ? (
            <CustomChart />
          ) : (
            <LuzmoVizItemComponent
              key={item.i}
              authKey={embedToken.authKey}
              authToken={embedToken.authToken}
              dashboardId={item.dashboardId}
              itemId={item.i}
              canFilter="all"
            />
          )}
        </div>
      ))}
    </GridLayout>
  );
}
