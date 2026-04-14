<script lang="ts">
    import ContentPane from "./components/ContentPane.svelte";
    import NavigationPane from "./components/NavigationPane.svelte";
</script>

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
