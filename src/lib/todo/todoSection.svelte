<script lang="ts">
  import { tick } from 'svelte';
  import type { TaskSection } from '../../types';
  import { marked } from 'marked';

  interface TodoSectionProps {
    section: TaskSection;
    index: number;
    numSections: number;
    displayHorizontal: boolean;

    removeSelf: () => void;
    moveLeft: () => void;
    moveRight: () => void;
  }

  const tabsize = 2;

  let {
    section,
    removeSelf,
    index,
    numSections,
    moveLeft,
    moveRight,
    displayHorizontal
  }: TodoSectionProps = $props();
  let titleEditing = $state(false);
  let contentEditing = $state(false);

  let textarea: HTMLTextAreaElement | undefined = $state();
  let title: HTMLElement | undefined = $state();

  async function textareaOnKeyDown(event: KeyboardEvent) {
    if (event.key == 'Tab' && textarea) {
      event.preventDefault();

      const selectionPlace = textarea.selectionStart;
      section.content =
        section.content.slice(0, selectionPlace) +
        ' '.repeat(tabsize) +
        section.content.slice(selectionPlace);
      // tick() to wait for HTML updates to run, then set cursor place
      // otherwise, cursor will jump to the text end
      await tick();
      textarea.selectionEnd = selectionPlace + tabsize;
    }

    if ((event.ctrlKey && event.key == 'Enter') || event.key == 'Escape') {
      event.preventDefault();
      contentEditing = false;
    }
  }

  function textareaOnBlur() {
    contentEditing = false;
  }

  function titleOnKeyDown(event: KeyboardEvent) {
    if ((event.ctrlKey && event.key == 'Enter') || event.key == 'Escape') {
      event.preventDefault();
      titleEditing = false;
    }
  }

  function titleOnBlur() {
    titleEditing = false;
  }

  function onDivClick() {
    contentEditing = true;
  }

  // Focus textarea in an effect, since it technically doesn't exist until after onDivClick() finishes
  $effect(() => {
    if (contentEditing && textarea) {
      textarea.focus();
    }

    if (titleEditing && title) {
      title.focus();
    }
  });

  // e.g. Alt + 1 selects the first section (index 0)
  function windowSelectSection(event: KeyboardEvent) {
    if (event.altKey && parseInt(event.key) === index + 1) {
      contentEditing = true;
    }
  }
</script>

<svelte:window onkeydown={windowSelectSection} />

<div
  class={['todo-list', displayHorizontal ? 'horizontal' : 'vertical']}
  style="--coloring: {section.borderColor}"
>
  <div class="header">
    {#if titleEditing}
      <input
        bind:this={title}
        bind:value={section.sectionName}
        onkeydown={titleOnKeyDown}
        onblur={titleOnBlur}
      />
    {:else}
      <h3
        onclick={() => {
          titleEditing = true;
        }}
      >
        {section.sectionName}
      </h3>
    {/if}
    <div class="extras">
      {#if index !== 0}
        <button onclick={moveLeft}>&lt;</button>
      {/if}
      {#if index < numSections - 1}
        <button onclick={moveRight}>&gt;</button>
      {/if}
      <input bind:value={section.borderColor} type="color" />
      <button class="remove-section" onclick={removeSelf}>X</button>
    </div>
  </div>
  {#if contentEditing}
    <textarea
      bind:this={textarea}
      bind:value={section.content}
      onkeydown={textareaOnKeyDown}
      onblur={textareaOnBlur}
      class={[displayHorizontal ? 'horizontal' : 'vertical']}
      style:display={contentEditing ? 'block' : 'none'}
    ></textarea>
  {:else}
    <section
      class={['todo-content', displayHorizontal ? 'horizontal' : 'vertical']}
      onclick={onDivClick}
    >
      {@html marked(section.content)}
    </section>
  {/if}
</div>

<style>
  .todo-list {
    width: 80%;

    padding: 10px;

    border: 2px solid var(--coloring);
    border-radius: 10px;
    box-shadow: 0 0 15px var(--coloring);

    font-size: 1rem;

    display: flex;
    flex-direction: column;
    align-items: center;

    flex-shrink: 0;
  }

  div.horizontal {
    width: 25%;
    min-height: 380px;
  }

  div.vertical {
    min-height: 200px;
  }

  .header {
    width: 95%;
    margin-bottom: 10px;
    align-self: flex-start;
    margin-left: 15px;
  }

  .extras {
    float: right;
    display: inline;
    gap: 10px;
  }

  input[type='color'] {
    width: 40px;
    height: 20px;
    padding: 1px;
  }

  button {
    background: none;
    border: 1px solid;
    border-color: white;
    border-radius: 5px;
    color: white;
  }

  button:hover {
    background-color: #dbc5c555;
  }

  button.remove-section {
    background: none;
    border-color: red;
    border-radius: 5px;
    color: red;
  }

  button.remove-section:hover {
    background-color: #ff6e6e7a;
  }

  h3 {
    text-align: center;
    margin-top: 0px;
    display: inline;
  }

  .todo-content {
    text-align: left;

    min-height: 350px;
    width: 90%;
    padding: 10px;
    margin-bottom: 10px;

    background-color: #242424;
    border-radius: 25px;
  }

  textarea {
    width: 90%;
    margin: 10px;
    resize: vertical;

    margin-bottom: 20px;
  }

  textarea.horizontal,
  section.horizontal {
    min-height: 350px;
  }

  textarea.vertical,
  section.vertical {
    min-height: 200px;
  }

  input {
    margin-bottom: 5px;
  }
</style>
