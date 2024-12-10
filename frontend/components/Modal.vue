<template>
  <!-- Modal Overlay -->
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
  >
    <!-- Modal Card -->
    <div class="bg-black border-1 border-black rounded-3xl">
      <div class="flex justify-between items-center text-white p-5">
        <p>Play trailer</p>
        <button @click="$emit('close')">x</button>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup>
  defineProps({
    visible: { type: Boolean, required: true },
  });

  const emit = defineEmits(["close"]);

  const regenerate = () => {
    emit("close");
  };
</script>