<script lang="ts">
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
            <HomeRouteItem name="Recent" icon={icons.recent} />
            <HomeRouteItem name="Starred" icon={icons.star} />
            <HomeRouteItem name="Home" icon={icons.home} />
            <HomeRouteItem name="Documents" icon={icons.document} />
            <HomeRouteItem
                name="Downloads"
                selected={true}
                icon={icons.download}
            />
            <HomeRouteItem name="Music" icon={icons.music} />
            <HomeRouteItem name="Pictures" icon={icons.picture} />
            <HomeRouteItem name="Videos" icon={icons.video} />
            <hr />
            <HomeRouteItem name="Primary" icon={icons.disk} />
            <HomeRouteItem name="IPhone" icon={icons.disk} />
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
