<script lang="ts">
	import type { TaskSection } from '../../types';
	import { marked } from 'marked';

	interface TodoSectionProps {
		section: TaskSection;
	}

	let { section }: TodoSectionProps = $props();
  let titleEditing = $state(false);
	let contentEditing = $state(false);

	let textarea: HTMLElement;

	function onkeydown(event: KeyboardEvent) {
		if (event.key == 'Tab') {
			event.preventDefault();
			section.content += '   ';
		}

		if (event.ctrlKey && event.key == 'Enter') {
			event.preventDefault();
			contentEditing = false;
		}
	}

	function onblur() {
		contentEditing = false;
	}

	function onDivClick() {
    // console.log(textarea.focus)
		contentEditing = true;
		// textarea.focus();
	}

  // Focus textarea in an effect, since it technically doesn't exist until after onDivClick() finishes
  $effect(() => {
    if (contentEditing) {
      textarea.focus();
    }
  })
</script>

<div class="todo-list">
  {#if titleEditing}
    <input bind:value={section.sectionName} />
  {:else}
    <h3>{section.sectionName}</h3>
  {/if}
	<!-- <button onclick={() => { editing = !editing }}>switch</button> -->
  {#if contentEditing}
    <textarea bind:this={textarea} bind:value={section.content} {onkeydown} {onblur}
      style:display={contentEditing ? "block" : "none"}
    ></textarea>
	{:else}
		<div class="todo-content" onclick={onDivClick}>{@html marked(section.content)}</div>
	{/if}
</div>

<style>
	.todo-list {
		width: 35%;
		min-height: 300px;
		padding: 10px;

		border: 1px solid blue;
		border-radius: 10px;

		font-size: 0.8rem;

		display: flex;
		flex-direction: column;
		align-items: center;
	}

	h3 {
		text-align: center;
	}

	.todo-content {
		text-align: left;

		min-height: 200px;
		width: 90%;
    padding: 10px;

		background-color: #242424;
		border-radius: 25px;
	}

	textarea {
		width: 90%;
		min-height: 200px;
		margin: 10px;
		resize: vertical;
	}
</style>
