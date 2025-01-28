<script lang="ts">
	import type { TaskSection } from '../../types';
	import { marked } from 'marked';

	interface TodoSectionProps {
		section: TaskSection;
		removeSelf: () => void;
		index: number;
	}

	let { section, removeSelf, index }: TodoSectionProps = $props();
	let titleEditing = $state(false);
	let contentEditing = $state(false);

	let textarea: HTMLElement | undefined = $state();
	let title: HTMLElement | undefined = $state();

	function textareaOnKeyDown(event: KeyboardEvent) {
		if (event.key == 'Tab') {
			event.preventDefault();
			section.content += '   ';
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

<div class="todo-list" style="--coloring: {section.borderColor}">
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
		<span class="extras">
			<input bind:value={section.borderColor} type="color" />
			<button class="remove-section" onclick={removeSelf}>X</button>
		</span>
	</div>
	{#if contentEditing}
		<textarea
			bind:this={textarea}
			bind:value={section.content}
			onkeydown={textareaOnKeyDown}
			onblur={textareaOnBlur}
			style:display={contentEditing ? 'block' : 'none'}
		></textarea>
	{:else}
		<div class="todo-content" onclick={onDivClick}>{@html marked(section.content)}</div>
	{/if}
</div>

<style>
	.todo-list {
		width: 25%;
		min-height: 380px;
		padding: 10px;
		margin: 25px 0;

		border: 2px solid var(--coloring);
		border-radius: 10px;
		box-shadow: 0 0 15px var(--coloring);

		font-size: 1rem;

		display: flex;
		flex-direction: column;
		align-items: center;

		flex-shrink: 0;
	}

	.header {
		width: 95%;
		margin-bottom: 10px;
	}

	span.extras {
		float: right;
		display: inline;
	}

	button.remove-section {
		background: none;
		border: 1px solid red;
		border-radius: 5px;
		color: red;

		margin-left: 10px;
	}

	button.remove-section:hover {
		background-color: #ff6e6e7a;
	}

	h3 {
		text-align: center;
		margin-top: 0px;
		display: inline;

		margin-left: 20px;
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
		min-height: 350px;
		margin: 10px;
		resize: vertical;

		margin-bottom: 20px;
	}

	input {
		margin-bottom: 5px;
	}
</style>
