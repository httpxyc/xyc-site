import { ReactNode } from "react";
export interface PathsType {
    [key: string]: () => Promise<ReactNode>;
}
export type CustomerRouteProps = {
    hasDone: boolean;
    element: React.ReactNode;
    path: string;
    children?: CustomerRouteProps[];
};
