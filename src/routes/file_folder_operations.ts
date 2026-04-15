import { join } from "@tauri-apps/api/path";
import { exists, readDir, watch } from "@tauri-apps/plugin-fs";

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

export { checkPageChange, readFolderItems };
