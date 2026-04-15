import { derived, writable } from "svelte/store";
import { readFolderItems } from "./file_folder_operations";

export const currentPath = writable("");
export const currentPathEntries = derived(
    currentPath,
    ($currentPath, set) => {
        readFolderItems($currentPath).then((newEntries) => {
            set(newEntries);
        });
        return () => {
        };
    },
    <RouteItem[]> [],
);
