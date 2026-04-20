<script lang="ts">
    import ContentPane from "./components/ContentPane.svelte";
    import NavigationPane from "./components/NavigationPane.svelte";
    import { navigateUp } from "./file_folder_operations";

    function isEditableTarget(target: EventTarget | null) {
        if (!(target instanceof HTMLElement)) {
            return false;
        }
        const tagName = target.tagName;
        if (tagName === "INPUT" || tagName === "TEXTAREA") {
            return true;
        }
        return target.isContentEditable;
    }
</script>

<svelte:body
    on:keydown={(e) => {
        if (e.key === "Backspace" && !isEditableTarget(e.target)) {
            navigateUp();
        }
    }}
/>
<main>
    <div class="window_wrapper">
        <div class="nav_pane">
            <NavigationPane />
        </div>
        <div class="content_pane">
            <ContentPane />
        </div>
    </div>
</main>

<style>
    .window_wrapper {
        display: flex;
        width: 100%;
        height: 100vh;
        height: 100dvh;
        overflow: hidden;
    }

    .nav_pane {
        width: 210px;
        flex-shrink: 0;
        height: 100%;
        background-color: rgb(237, 240, 243);
        overflow-y: scroll;
    }

    ::-webkit-scrollbar {
        background-color: rgb(237, 240, 243);
    }

    .content_pane {
        height: 100%;
        flex: 1;
        background-color: rgb(251, 251, 251);
        overflow-y: scroll;
    }
</style>
