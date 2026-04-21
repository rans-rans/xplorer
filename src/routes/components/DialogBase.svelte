<script lang="ts">
    import type { Snippet } from "svelte";

    let { open, label, onclose, children }: {
        open: boolean;
        label: string;
        onclose: () => void;
        children: Snippet;
    } = $props();
</script>

{#if open}
    <div
        class="dialog_backdrop"
        role="presentation"
        onclick={onclose}
        onkeydown={(e) => e.key === "Escape" && onclose()}
    >
        <div
            class="dialog_box"
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabindex="-1"
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => e.stopPropagation()}
        >
            {@render children()}
        </div>
    </div>
{/if}

<style>
    .dialog_backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    .dialog_box {
        background: #fff;
        border-radius: 12px;
        padding: 24px;
        min-width: 320px;
        max-width: 480px;
        width: 90%;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
    :global(.dialog_title) {
        font-size: 1.1rem;
        font-weight: 600;
        user-select: none;
    }
    :global(.dialog_actions) {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
    :global(.dialog_actions button) {
        padding: 7px 18px;
        border: none;
        border-radius: 8px;
        font-size: 0.9rem;
        cursor: pointer;
        font-weight: 500;
        transition: opacity 150ms;
    }
    :global(.dialog_actions button:hover) {
        opacity: 0.85;
    }
    :global(.btn_primary) {
        background: var(--primary-blue);
        color: #fff;
    }
    :global(.btn_secondary) {
        background: var(--primary-grey);
        color: #333;
    }
    :global(.btn_danger) {
        background: #d32f2f;
        color: #fff;
    }
</style>
