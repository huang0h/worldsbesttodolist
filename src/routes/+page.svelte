<script lang="ts">
	import Clock from '$lib/clock.svelte';
  import Todo from '$lib/todo/todoSection.svelte';
	import { onMount } from 'svelte';
	import type { TaskSection } from '../types';
	import { STORAGE_TASK_KEY } from '../types';
	import TodoSection from '$lib/todo/todoSection.svelte';

  let sections: TaskSection[] = $state([]);

  // Set task state on mount, since localStorage doesn't exist in the server:
  // wait for execution to occur on the browser
  onMount(() => {
    sections = JSON.parse(localStorage.getItem(STORAGE_TASK_KEY) || '[]');
  //   sections = [
  //     {
  //       sectionName: 'section 1',
  //       tasks: [
  //         {
  //           action: 'something hard',
  //           subtasks: [
  //             {
  //               action: 'something easy',
  //               subtasks: []
  //             }
  //           ]
  //         },
  //         {
  //           action: 'something medium',
  //           subtasks: []
  //         }
  //       ]
  //     }
  //   ]
  });

  $effect(() => {
    localStorage.setItem(STORAGE_TASK_KEY, JSON.stringify(sections));
    // console.log(localStorage.getItem(STORAGE_TASK_KEY));
  });

  // $inspect(sections);

</script>

<div class="main">
	<Clock />
	<br />
  <button class="add-section">+</button>
  <br />
  <div class="sections">
    {#each sections as section}
      <TodoSection section={section} />
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

  .sections {
    margin-top: 20px;
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: center;
  }
</style>
