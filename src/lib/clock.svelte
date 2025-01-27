<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let now = $state(new Date());
	// TODO get rid of seconds
	let currentTime = $derived(
		now.toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
			hour12: true,
			// second: '2-digit'
		})
	);
	let currentDate = $derived(
		now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
	);

	let interval = $state(0);

	onMount(() => {
		interval = setInterval(() => {
			now = new Date();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div>
	<p class="time">{currentTime}</p>
	<p class="date">{currentDate}</p>
</div>

<style>
  p.time {
    font-size: 4rem;
  }

  p.date {
    font-size: 2.5rem;
  }

	div {
		--lightteal: #299eec;

		display: flex;
    flex-flow: column;
		justify-content: flex-start;

		color: var(--lightteal);
		text-align: center;
		text-shadow:
			0 0 5px blue,
			0 0 7px blue,
			0 0 10px blue,
			0 0 14px var(--lightteal),
			0 0 18px #ffffff60;

		margin-top: 10px;
	}

  div > p {
    margin: 5px;
  }
</style>
