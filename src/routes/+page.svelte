<script lang="ts">
  import Clock from '$lib/clock.svelte';
  import { onMount } from 'svelte';
  import type { TaskSection } from '../types';
  import { SETTINGS_KEY, STORAGE_TASK_KEY } from '../types';
  import TodoSection from '$lib/todo/todoSection.svelte';
  import Settings from '$lib/settings.svelte';

  let sections: TaskSection[] = $state([]);
  let settings: Record<string, any> = $state({});
  let displayHorizontal: boolean = $state(true);
  let settingsModal: HTMLDialogElement | undefined = $state();
  let sectionContainer: HTMLElement | undefined = $state();

  // Set task state on mount, since localStorage doesn't exist in the server:
  // wait for execution to occur on the browser
  onMount(() => {
    sections = JSON.parse(localStorage.getItem(STORAGE_TASK_KEY) || '[]');
    settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
  });

  $effect(() => {
    localStorage.setItem(STORAGE_TASK_KEY, JSON.stringify(sections));
  });

  $effect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  });

  function addSection() {
    sections.push({
      sectionName: `Section ${sections.length + 1}`,
      content: '',
      borderColor: '#FFFFFF'
    });

    if (sectionContainer && sections.length >= 4) {
      if (displayHorizontal) {
        sectionContainer.scroll({ left: sectionContainer.scrollWidth, behavior: 'smooth' })
      } else {

      }
    }
  }

  function switchOrientation() {
    displayHorizontal = !displayHorizontal;
  }

  function showSettingsModal() {
    if (settingsModal) {
      settingsModal.showModal();
    }
  }

  function closeSettingsModal() {
    if (settingsModal) {
      settingsModal.close();
    }
  }

  function removeSection(index: number) {
    return () => {
      sections.splice(index, 1);
    };
  }

  function moveSection(index: number, toLeft: boolean) {
    return () => {
      if (toLeft && index > 0) {
        const temp = sections[index];
        sections[index] = sections[index - 1];
        sections[index - 1] = temp;
      } else if (!toLeft && index < sections.length - 1) {
        const temp = sections[index];
        sections[index] = sections[index + 1];
        sections[index + 1] = temp;
      }
    };
  }
</script>

<div class="main">
  <Clock />
  <br />
  <div class="buttons">
    <button class="top-button" onclick={addSection}>+ Section</button>
    <button class="top-button" onclick={switchOrientation}>
      <span style:padding-bottom='5px'>{displayHorizontal ? '↕' : '↔'}</span>
    </button>
    <button class="top-button" onclick={showSettingsModal}>
      <span>⚙</span>
    </button>
  </div>
  <br />
  <div
    class={[
      'sections',
      sections.length <= 3 && 'sections-small',
      displayHorizontal ? 'horizontal' : 'vertical'
    ]}
    bind:this={sectionContainer}
  >
    {#each sections as section, index}
      <TodoSection
        {section}
        {index}
        numSections={sections.length}
        {displayHorizontal}
        moveLeft={moveSection(index, true)}
        moveRight={moveSection(index, false)}
        removeSelf={removeSection(index)}
      />
    {/each}
    <dialog bind:this={settingsModal}>
      <Settings {closeSettingsModal} {settings} />
    </dialog>
  </div>
</div>

<style>
  :global(body) {
    background-color: #1d1d1d;

    font-family: Arial, Helvetica, sans-serif;
  }

  .main {
    margin-top: -20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    color: white;
  }

  .buttons {
    display: flex;
    flex-direction: row;
    align-content: center;
    gap: 13px;

    margin-top: 15px;
  }

  .buttons > button {
    flex-grow: 0;
  }
  .top-button {
    background: none;

    color: white;
    border: 2px solid white;
    border-radius: 10px;
    padding: 5px 10px;
    box-shadow: 0 0 6px white;

    min-width: 40px;
    text-align: center;

    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .top-button:hover {
    background-color: #dbc5c533;
  }

  .sections {
    width: 90%;
    gap: 30px;
    margin-top: 25px;

    display: flex;

    overflow-x: auto;
    overflow-y: auto;
  }

  .sections-small {
    justify-content: center;
  }

  .horizontal {
    flex-direction: row;
  }

  .vertical {
    flex-direction: column;
    align-items: center;
  }

  dialog {
    border: 2px solid rgb(0, 157, 255);
    border-radius: 10px;
    box-shadow: 0 0 40px rgb(0, 191, 255);
  }

  dialog::backdrop {
    background-color: #1d1d1d;
    opacity: 0.6;
  }
</style>
