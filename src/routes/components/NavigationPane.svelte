<script lang="ts">
    import {
        audioDir,
        documentDir,
        downloadDir,
        homeDir,
        pictureDir,
        videoDir,
    } from "@tauri-apps/api/path";
    import { icons } from "../images";
    import HomeRouteItem from "./HomeRouteItem.svelte";
    import Icon from "./Icon.svelte";
</script>

<div style="padding: 0.1rem" class="nav_inner">
    <div class="top-header">
        <Icon src={icons.search} height={16} width={16} />
        <p style="font-weight: bold;font-size: 14px;">Files</p>
        <Icon src={icons.menu} height={16} width={16} />
    </div>
    <div class="scroll-area">
        <div class="home-routes">
            <HomeRouteItem
                name="Home"
                icon={icons.home}
                onPathSet={async () => {
                    const homePath = await homeDir();
                    return homePath;
                }}
            />
            <HomeRouteItem
                name="Documents"
                onPathSet={async () => {
                    const homePath = await documentDir();
                    return homePath;
                }}
                icon={icons.document}
            />
            <HomeRouteItem
                name="Downloads"
                icon={icons.download}
                onPathSet={async () => {
                    const homePath = await downloadDir();
                    return homePath;
                }}
            />
            <HomeRouteItem
                name="Music"
                icon={icons.music}
                onPathSet={async () => {
                    const homePath = await audioDir();
                    return homePath;
                }}
            />
            <HomeRouteItem
                name="Pictures"
                icon={icons.picture}
                onPathSet={async () => {
                    const homePath = await pictureDir();
                    return homePath;
                }}
            />
            <HomeRouteItem
                name="Videos"
                icon={icons.video}
                onPathSet={async () => {
                    const homePath = await videoDir();
                    return homePath;
                }}
            />
            <hr />
        </div>
    </div>
</div>

<style>
    .nav_inner {
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .top-header {
        display: flex;
        gap: 0.45rem;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem;
        margin-bottom: 1.2rem;
    }

    .home-routes {
        padding-inline: 0.7rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
</style>
