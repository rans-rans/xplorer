<script lang="ts">
  import NavigationPane from "./components/NavigationPane.svelte";
</script>

<main>
  <div class="window_wrapper">
    <div class="nav_pane">
      <NavigationPane />
    </div>
    <div class="content_pane"></div>
  </div>
</main>

<style>
  .window_wrapper {
    display: flex;
    width: 100%;
    height: 100vh;
    height: 100dvh;
  }

  .nav_pane {
    width: 250px;
    height: 100%;
    background-color: rgb(231, 231, 231);
  }

  .content_pane {
    height: 100%;
    flex: 1;
    background-color: rgb(251, 251, 251);
  }
</style>
