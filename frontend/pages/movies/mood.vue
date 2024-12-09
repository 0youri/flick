<template>
  <div class="flex flex-col items-center gap-5 lg:gap-5 text-dark">
   <!-- Page Header -->
   <div class="text-2xl font-medium text-center">
      Match Your Mood
    </div>
   <svg width="150" height="1" viewBox="0 0 150 1" fill="none" xmlns="http://www.w3.org/2000/svg"><line y1="0.5" x2="150" y2="0.5" stroke="#0A2E36" /></svg>
   <div class="grid grid-cols-2 px-5 lg:px-0 text-center gap-5">
     <NuxtLink
       v-for="mood in moods"
       :key="mood.title"
       :to="`genre/x`"
       class="border-2 border-accent-sky text-accent-sky w-full px-6 py-3 text-lg md:text-md rounded-2xl hover:bg-accent-sky hover:text-white"
     >
       {{ mood.title }}
     </NuxtLink>
   </div>
 </div>
</template>

<script lang="ts" setup>
 const moods = ref([
   {
     title: 'feel-good 🌞',
   },
   {
     title: 'chill 😌',
   },
   {
     title: 'thrilling ⚡',
   },
   {
     title: 'romantic ❤️',
   },
   {
     title: 'adventurous 🌍',
   },
   {
     title: 'funny 😂',
   },
   {
     title: 'spooky 👻',
   },
   {
     title: 'epic 🏆',
   },

 ])
</script>

<style>

</style>