<script lang="ts">
    import { icons } from "../images";
    import Icon from "./Icon.svelte";
</script>

<div style="padding: 0.1rem">
    <div class="top-header">
        <Icon src={icons.star} />
        <p>Files</p>
        <Icon src={icons.menu} />
    </div>
    <div class="home-routes">
        
    </div>
</div>

<style>
    .top-header {
        display: flex;
        gap: 0.45rem;
        align-items: center;
        background: rgb(231, 231, 231);
        justify-content: space-between;
        padding: 0.5rem;
    }
</style>
