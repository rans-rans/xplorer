use serde::Serialize;
use walkdir::WalkDir;

#[tauri::command]
fn search_files(query: String, root: String) -> Result<Vec<FileEntry>, String> {
    const MAX_RESULTS: usize = 100  ;

    let normalized_query = query.trim().to_lowercase();
    if normalized_query.is_empty() {
        return Ok(Vec::new());
    }

    let mut results = Vec::new();
    let walker = WalkDir::new(root)
        .follow_links(false)
        .into_iter()
        .filter_entry(|entry| {
            let name = entry.file_name().to_string_lossy();
            if entry.depth() == 0 {
                return true;
            }
            !name.starts_with('.')
        });

    for entry in walker {
        let entry = entry.map_err(|e| e.to_string())?;
        let name = entry.file_name().to_string_lossy().to_lowercase();
        if name.contains(&normalized_query) {
            results.push(FileEntry {
                full_path: entry.path().to_string_lossy().into_owned(),
                name: entry.file_name().to_string_lossy().into_owned(),
                is_dir: entry.file_type().is_dir(),
            });

            if results.len() >= MAX_RESULTS {
                break;
            }
        }
    }
    Ok(results)
}

#[derive(Serialize)]
pub struct FileEntry {
    full_path: String,
    name: String,
    is_dir: bool,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![search_files])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
