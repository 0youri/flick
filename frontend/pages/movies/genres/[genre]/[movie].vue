<template>
  <div class="flex flex-col items-center gap-10 text-dark py-10 lg:py-0">
    <div class="flex flex-col lg:flex-row justify-center items-center lg:items-start h-full gap-5" >
      <img 
        src="/img/poster.jpg" 
        alt="Movie poster" 
        class="w-5/6 lg:w-1/6 h-auto rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105"
      />
      <div class="py-5 flex flex-col gap-5 w-5/6 lg:w-1/4">
        <div class="space-y-5">
          <h1 class="text-2xl lg:text-3xl font-bold ">Venom: The Last Dance</h1>
          <div class="flex flex-col text-lg gap-0.5 lg:text-md">
            <span>📆 2024</span>
            <span>🎥 Science Fiction, Action, Adventure</span>
            <span>⏳ 1h 49m</span>
            <span>⭐ <span class="text-yellow-400 font-medium">69%</span> <span class="text-primary font-medium text-xs">(987 review)</span></span>
          </div>
        </div>
        <!-- Review & Trailer -->
        <div class="">
          <button
            @click="modal"
            class="flex w-fit items-center rounded-lg gap-2 text-dark hover:opacity-75 cursor-pointer"
          >
            <svg height="45" width="45" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 461.001 461.001" xml:space="preserve"><g><path style="fill:#F61C0D;" d="M365.257,67.393H95.744C42.866,67.393,0,110.259,0,163.137v134.728 c0,52.878,42.866,95.744,95.744,95.744h269.513c52.878,0,95.744-42.866,95.744-95.744V163.137 C461.001,110.259,418.135,67.393,365.257,67.393z M300.506,237.056l-126.06,60.123c-3.359,1.602-7.239-0.847-7.239-4.568V168.607 c0-3.774,3.982-6.22,7.348-4.514l126.06,63.881C304.363,229.873,304.298,235.248,300.506,237.056z"/></g></svg>
            <span>Play trailer</span>
          </button>
          <Modal
            :visible="modalState"
            @close="modal"
          >
            <iframe class="rounded-b-xl" width="560" height="315" src="https://www.youtube.com/embed/FKBN1qAzW3s?si=ndxRSfcLT_UGUSCM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          </Modal>
        </div>
        <!-- Overview -->
        <div class="">
          <h1 class="text-2xl font-semibold">Overview</h1>
          <p class="text-block font-light">Eddie and Venom are on the run. Hunted by both of their worlds and with the net closing in, the duo are forced into a devastating decision that will bring the curtains down on Venom and Eddie's last dance. </p>
        </div>
      </div>
    </div>

    <div class="flex flex-col items-center gap-2">
      <button class="bg-accent-gray text-dark hover:bg-accent-gray/80 px-5 py-3 rounded-lg text-lg">
        Another one! 🔄
      </button>
      <NuxtLink to="/movies" class="bg-red-300 text-dark hover:bg-red-300/80 px-3 py-1 rounded-lg text-sm w-max">
        reset
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const modalState = ref(false)

  const modal = () => {
    modalState.value = !modalState.value
  }
</script>

<style>

</style>