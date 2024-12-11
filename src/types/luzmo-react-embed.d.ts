declare module "@luzmo/react-embed" {
  export interface LuzmoVizItemComponentProps {
    authKey: string;
    authToken: string;
    dashboardId: string;
    itemId: string;
    key?: string;
  }

  export const LuzmoVizItemComponent: React.FC<LuzmoVizItemComponentProps>;
}
