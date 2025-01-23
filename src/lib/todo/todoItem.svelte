<script lang="ts">
  import TodoItem from './todoItem.svelte';
  import type { Task } from '../../types';

  interface TodoItemProps {
    item: Task;
    removeSubtask: (taskToRemove: string) => void;
  }
  
  let { item, removeSubtask: parentRemoveSubtask }: TodoItemProps = $props();
  let itemState = $state(item)

  function addStuff() {
    itemState.subtasks.push({ action: 'something else', subtasks: [] });
  }

  function removeSubtask(item: Task) {
    return (taskToRemove: string) => item.subtasks = item.subtasks.filter(task => task.action !== taskToRemove);
  }
</script>

<ul>
  <li>
  <p>
    <button class="complete-button" onclick={() => parentRemoveSubtask(itemState.action)}>✅</button>
    {itemState.action}
    <button class="add-button" onclick={addStuff}>+</button>
  </p>
  {#if itemState.subtasks.length > 0}
    {#each itemState.subtasks as subtask}
      <TodoItem item={subtask} removeSubtask={removeSubtask(item)} />
    {/each}
  {/if}
  </li>
</ul>

<style>
  ul {
    list-style: none;
    line-height: 1.4;
  }

  li {
    /* width: 90%; */
    box-sizing: border-box;
  }

  p {
    border: 1px solid blue;
    border-radius: 5px;

    padding: 5px 10px;
  }

  p .complete-button {
    float: left;
    margin-right: 10px;

    /* background: none;
    border: none; */
  }

  p .add-button {
    float: right;
  }
</style>