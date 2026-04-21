import { join } from "@tauri-apps/api/path";
import { exists, readDir, remove, rename, stat } from "@tauri-apps/plugin-fs";
import { get } from "svelte/store";
import { currentPath } from "./store";
import { invoke } from "@tauri-apps/api/core";

export type FileStats = {
    name: string;
    fullPath: string;
    isDir: boolean;
    size: number;
    modified: Date | null;
    created: Date | null;
};

async function readFolderItems(currentPath: string): Promise<RouteItem[]> {
    try {
        const rawEntries = await readDir(currentPath);
        let entries = await Promise.all(
            rawEntries.map(async (entry) => ({
                name: entry.name,
                isDir: entry.isDirectory,
                fullPath: await join(currentPath, entry.name),
                isHidden: entry.name.startsWith("."),
            })),
        );
        entries = entries
            .filter((entry) => !entry.isHidden)
            .sort((a, b) => {
                if (a.isDir && !b.isDir) return -1;
                if (!a.isDir && b.isDir) return 1;
                return a.name.localeCompare(b.name);
            });
        return entries;
    } catch (error) {
        throw Error("Failed to load files");
    }
}

async function checkPageChange(
    currWorkingPath: string,
    newPath: string,
    onPathChange: (newPath: string) => void,
) {
    try {
        const pathExists = await exists(newPath);
        if (pathExists) {
            onPathChange(newPath);
        } else {
            alert("The path you entered does not exist.");
            onPathChange(currWorkingPath);
        }
    } catch (error) {
        onPathChange(currWorkingPath);
        alert("Unable to validate this path due to permission scope.");
    }
}

function navigateUp() {
    const currentPathValue = get(currentPath);
    const newPath = currentPathValue.split("/").slice(0, -1).join("/");
    checkPageChange(currentPathValue, newPath, (updatedPath) => {
        currentPath.set(updatedPath);
    });
}

async function searchForFileFolder(
    query: string,
    root: string,
): Promise<RouteItem[]> {
    try {
        const results = await invoke("search_files", { query, root }) as any[];
        const fileItems = results.map((item: any) => {
            return ({
                name: item.name as string,
                isDir: item.is_dir as boolean,
                fullPath: item.full_path as string,
                isHidden: false,
            });
        });
        return fileItems;
    } catch (error) {
        console.error(
            `Error searching for files/folders with name ${query}:`,
            error,
        );
        return [];
    }
}

async function renameItem(oldPath: string, newPath: string): Promise<void> {
    await rename(oldPath, newPath);
}

async function deleteItem(path: string, isDir: boolean): Promise<void> {
    await remove(path, { recursive: isDir });
}

async function getFileStats(
    path: string,
    name: string,
    isDir: boolean,
): Promise<FileStats> {
    const info = await stat(path);
    return {
        name,
        fullPath: path,
        isDir,
        size: info.size ?? 0,
        modified: info.mtime ? new Date(info.mtime) : null,
        created: info.birthtime ? new Date(info.birthtime) : null,
    };
}

export {
    checkPageChange,
    deleteItem,
    getFileStats,
    navigateUp,
    readFolderItems,
    renameItem,
    searchForFileFolder,
};
