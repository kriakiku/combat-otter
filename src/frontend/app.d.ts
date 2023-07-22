import type { ApiInterface } from "../preload";

declare module '*.jpg';
declare module '*.svg' {
    const value: string;
    export default value;
}

declare global {
    interface Window {
        api: ApiInterface
    }
}