import type { ApiInterface } from "./preload";

declare module '*.jpg' {
    const value: string;
    export default value;
}

declare module '*.png' {
    const value: string;
    export default value;
}

declare module '*.svg' {
    const value: string;
    export default value;
}

declare global {
    interface Window {
        api: ApiInterface
    }
}

export {};
