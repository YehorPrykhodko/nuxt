<template>
  <v-container>
    <v-row>
      <v-col
        v-for="forum in forums"
        :key="forum.id"
        cols="12" sm="6" md="4"
      >
        <v-card class="ma-2">
          <v-card-title>
            <NuxtLink :to="`/forum/${forum.id}`">Forum: {{ forum.nom }}</NuxtLink>
          </v-card-title>
          <v-card-subtitle>
            {{ forum.sujets }} sujet{{ forum.sujets > 1 ? 's' : '' }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useFetch } from '#imports'

interface Forum {
  id: number
  nom: string
  sujets: number
}

const { data, error } = await useFetch<{ forums: Forum[] }>('/api/forums')

if (error.value) {
  console.error('Erreur fetch forums', error.value)
}

const forums = data.value?.forums || []
</script>
