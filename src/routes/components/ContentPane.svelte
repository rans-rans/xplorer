<script lang="ts">
    import { icons } from "../images";
    import FileItem from "./FileItem.svelte";
    import Icon from "./Icon.svelte";
</script>

<div class="wrapper">
    <div class="route_input_wrapper">
        <input type="text" class="route_input" />
    </div>
    <div class="dir_contents">
        <FileItem isDir={true} />
        <FileItem isDir={false} />
    </div>
</div>

<style>
    .wrapper {
        padding: 12px;
        display: flex;
        flex-direction: column;
        width: 100%;
        box-sizing: border-box;
    }
    .route_input_wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
        position: sticky;
        top: 0;
        z-index: 10;
        padding-bottom: 12px;
        margin-bottom:24px;
    }
    .route_input {
        width: 55%;
        padding-block: 4px;
        padding-inline: 8px;
        height: 36px;
        background-color: rgb(236, 236, 236);
        border: none;
        border-radius: 12px;
    }
    .dir_contents {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
        gap: 12px;
        width: 100%;
    }
</style>
