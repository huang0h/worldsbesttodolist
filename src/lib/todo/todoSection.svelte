<script lang="ts">
  import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { Task, TaskSection } from '../../types';
  import { STORAGE_TASK_KEY } from '../../types';
	import TodoItem from './todoItem.svelte';

  interface TodoSectionProps {
    section: TaskSection;
  }

  let { section }: TodoSectionProps = $props();

  let taskSection = $state(section);

  function removeSubtask(actionToRemove: string) {
    const newTasks = taskSection.tasks.filter(t => {
      // console.log(t, t.action !== actionToRemove);
      return t.action !== actionToRemove;
    });
    // console.log(newTasks);

    taskSection.tasks = newTasks
  }

  $inspect(taskSection)
</script>

<div class="todo-list">
  <h3>{section.sectionName}</h3>
	{#each section.tasks as task}
    <!-- {console.info(task)} -->
		<TodoItem item={task} removeSubtask={removeSubtask} />
	{/each}
</div>

<style>
  .todo-list {
    width: 40%;
    padding: 10px;

    border: 1px solid blue;
    border-radius: 10px;

    font-size: 0.8rem;
  }
</style>
