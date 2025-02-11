<script lang="ts">
	import Clock from '$lib/clock.svelte';
	import { onMount } from 'svelte';
	import type { TaskSection } from '../types';
	import { STORAGE_TASK_KEY } from '../types';
	import TodoSection from '$lib/todo/todoSection.svelte';

	let sections: TaskSection[] = $state([]);
	let displayHorizontal: boolean = $state(true);

	// Set task state on mount, since localStorage doesn't exist in the server:
	// wait for execution to occur on the browser
	onMount(() => {
		sections = JSON.parse(localStorage.getItem(STORAGE_TASK_KEY) || '[]');
	});

	$effect(() => {
		localStorage.setItem(STORAGE_TASK_KEY, JSON.stringify(sections));
		// console.log(localStorage.getItem(STORAGE_TASK_KEY));
	});

	function addSection() {
		sections.push({
			sectionName: `Section ${sections.length + 1}`,
			content: '',
			borderColor: '#FFFFFF'
		});
	}

	function switchOrientation() {
		displayHorizontal = !displayHorizontal;
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
			<span>{displayHorizontal ? '↕' : '↔'}</span>
		</button>
	</div>
	<br />
	<div
		class={[
			'sections',
			sections.length <= 3 && 'sections-small',
			displayHorizontal ? 'horizontal' : 'vertical'
		]}
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

	.buttons > button > span {
		padding-bottom: 5px;
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
</style>
