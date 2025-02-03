<script lang="ts">
	import Clock from '$lib/clock.svelte';
	import { onMount } from 'svelte';
	import type { TaskSection } from '../types';
	import { STORAGE_TASK_KEY } from '../types';
	import TodoSection from '$lib/todo/todoSection.svelte';

	let sections: TaskSection[] = $state([]);

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
    }
  }
</script>

<div class="main">
	<Clock />
	<br />
	<button class="add-section" onclick={addSection}>+ Section</button>
	<br />
	<div class={sections.length > 3 ? 'sections-large' : 'sections'}>
		{#each sections as section, index}
			<TodoSection {section} removeSelf={removeSection(index)} {index} numSections={sections.length} moveLeft={moveSection(index, true)} moveRight={moveSection(index, false)} />
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

	.add-section {
		margin-top: 15px;
		background: none;

		color: white;
		border: 2px solid white;
		border-radius: 10px;
		padding: 5px 10px;
		box-shadow: 0 0 10px white;
	}

	.add-section:hover {
		background-color: #dbc5c533;
	}

	.sections {
		width: 90%;

		display: flex;
		flex-direction: row;
		justify-content: center;
    
		gap: 30px;
		overflow-x: auto;
	}

  .sections-large {
		width: 90%;

		display: flex;
		flex-direction: row;
		/* justify-content: center; */
    
		gap: 30px;
		overflow-x: auto;
	}
</style>
