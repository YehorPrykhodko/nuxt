<template>
  <v-container>
    <v-row class="align-center">
      <v-col>
        <h1>Forum : {{ forumNom }}</h1>
      </v-col>
      <v-col class="text-right">
        <v-btn
          v-if="sess.user"
          color="primary"
          @click="dialog = true"
        >Nouveau sujet</v-btn>
        <div v-else>
          <NuxtLink to="/login">Connecte-toi</NuxtLink> pour créer un sujet.
        </div>
      </v-col>
    </v-row>

    <!-- Liste des sujets -->
    <v-row>
      <v-col cols="12" v-if="sujets.length === 0">
        Aucun sujet dans ce forum.
      </v-col>
      <v-col
        v-for="s in sujets"
        :key="s.id"
        cols="12"
      >
        <v-card class="mb-2">
          <v-card-title>
            <NuxtLink :to="`/sujet/${s.id}`">{{ s.titre }}</NuxtLink>
          </v-card-title>
          <v-card-subtitle>
            {{ s.auteur }} – dernière réponse par {{ s.dernierAuteur }} le {{ new Date(s.derniereDate).toLocaleString() }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- Pagination -->
    <v-pagination
      v-model="page"
      :length="pages"
      @input="reload"
      class="my-4"
    />

    <!-- Dialog création -->
    <v-dialog v-model="dialog" max-width="600">
      <template v-slot:activator="{ on, attrs }"></template>
      <v-card>
        <v-card-title>Nouveau sujet</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="titre" label="Titre" required />
            <v-textarea v-model="msg" label="Message initial" required />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Annuler</v-btn>
          <v-btn color="primary" @click="createSujet">Créer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useWs } from '~/composables/useWs'

const route = useRoute()
const forumId = Number(route.params.id)
console.log('[PAGE forum] forumId =', forumId)

const titre = ref('')
const msg = ref('')
const dialog = ref(false)

const { connect, send, lastEvent } = useWs()

onMounted(() => {
  console.log('[PAGE forum] onMounted')
  connect()
})

watch(lastEvent, evt => {
  console.log('[WS EVENT forum]', evt)
  if (evt?.type === 'newSujet' && evt.payload.forumId === forumId) {
    // reload list…
  }
})

async function createSujet() {
  console.log('[forum] createSujet', titre.value, msg.value)
  await $fetch('/api/sujets', {
    method: 'POST',
    credentials: 'include',
    body: { forumId, titre: titre.value, msg: msg.value }
  })
  console.log('[forum] Sujet created')
  send('newSujet', { forumId })
  titre.value = ''
  msg.value = ''
}
</script>


<style scoped>
h1 { margin-bottom: 1rem; }
</style>
