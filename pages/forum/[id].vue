<template>
  <v-container>
    <v-row class="align-center">
      <v-col><h1>Forum : {{ forumNom }}</h1></v-col>
      <v-col class="text-right">
        <pre style="color: red">USER: {{ user.login }}</pre>
        <v-btn v-if="user" color="primary" @click="dialog = true">
          Nouveau sujet
        </v-btn>
        <div v-else>
          <NuxtLink to="/login">Connecte-toi</NuxtLink> pour créer un sujet.
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" v-if="sujets.length === 0">
        Aucun sujet dans ce forum.
      </v-col>
      <v-col v-for="s in sujets" :key="s.id" cols="12">
        <v-card class="mb-2">
          <v-card-title>
            <NuxtLink :to="`/sujet/${s.id}`">{{ s.titre }}</NuxtLink>
          </v-card-title>
          <v-card-subtitle>
            {{ s.auteur }} – dernière réponse par {{ s.dernierAuteur }}
            le {{ new Date(s.derniereDate).toLocaleString() }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <v-pagination
      v-model="page"
      :length="pages"
      @input="reload"
      class="my-4"
    />

    <v-dialog v-model="dialog" max-width="600">
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
import { useFetch } from '#imports'
import { useWs } from '~/composables/useWs'
import { useAuthStore } from '~/stores/authStore'
import { computed } from 'vue'

const auth = useAuthStore()
const user = computed(() => auth.user)
console.log(auth)

const route = useRoute()
const forumId = Number(route.params.id)
const forumNom = ref('…chargement…')

const sujets = ref<any[]>([])
const page   = ref(1)
const pages  = ref(1)
const titre  = ref('')
const msg    = ref('')
const dialog = ref(false)

const { connect, send, lastEvent } = useWs()

const { data: forumData } = await useFetch(`/api/forums/${forumId}`)
forumNom.value = forumData.value.nom

async function reload() {
  const res: any = await $fetch('/api/sujets', {
    query: { forumId, page: page.value },
    headers: {
      Authorization: `Bearer ${auth.token}`
    }
  })
  sujets.value = res.sujets
  pages.value  = res.pages
}

onMounted(async () => {
  connect()
  await reload()
})

watch(lastEvent, evt => {
  if (evt?.type === 'newSujet' && evt.payload.forumId === forumId) {
    reload()
  }
})
watch(page, () => reload())

async function createSujet() {
  await $fetch('/api/sujets', {
    method: 'POST',
    headers: {
      // auth.token — Pinia ref, в котором у вас JWT
      Authorization: `Bearer ${auth.token}`
    },
    body: {
      forumId,
      titre: titre.value,
      msg:   msg.value
    }
  })
  titre.value = ''
  msg.value = ''
  dialog.value = false
  send('newSujet', { forumId })
  reload()
}
</script>

<style scoped>
h1 { margin-bottom: 1rem; }
</style>
