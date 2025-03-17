<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import { SETTINGS_KEY } from "../types";

  interface SettingsProps {
    closeSettingsModal: () => void;
    settings: Record<string, any>;
  }

  let { closeSettingsModal, settings }: SettingsProps = $props();
</script>

<div class="settings-container">
  <input type='radio' id='s1' name='s1' bind:value={settings['s1']} />
  <label for="s1">a</label>
  <input type='radio' id='s2' name='s2' bind:value={settings['s1']} />
  <label for="s2"></label>
  <input type='radio' id='s1' name='s1' bind:value={settings['s1']} />
  <label for="s1">a</label>
  <button onclick={closeSettingsModal}>Close</button>
</div>

<style>

</style>