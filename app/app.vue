<template>
  <div class="flex w-full bg-white h-16 drop-shadow-xl mb-6 p-3">
    <img src="/favicon.png" alt="Icon">
    <div class="flex-grow"/>
    <button class="bg-blue-500 text-white p-2 rounded-lg" @click="getSuggestions">
      <svg v-if="analyzeStatus" class="animate-spin -ml-1 mr-1 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {{ analyzeStatus ? "Analyzing..." : "Analyze" }}
    </button>
  </div>
  <div class="grid grid-cols-12">
    <div class="col-span-8 p-7">
      <p contenteditable="true"
           v-html="content"
           @input="onContentChange($event)"
           class="w-full h-screen font-light text-xl bg-transparent focus-visible:outline-none"
      >
      </p>
    </div>
    <div class="col-span-4 h-screen overflow-auto">
      <Suggestion
        v-for="suggestion in suggestions"
        :correctionType="suggestion.category"
        :content="suggestion.reason"
        :error="suggestion.incorrect"
        :fix="suggestion.fix"
        :index="suggestion.index"
        :app="app"
        @delete="index => deleteSuggestion(index)"
        :id="suggestion.index"
        @click="selected = suggestion.index"
        :hidden="selected != suggestion.index"
    />
    </div>
  </div>
</template>`

<script lang="ts" setup>
import Suggestion from './components/Suggestion.vue';
import {Ref} from "vue";

const appConfig = useAppConfig()

const suggestions: Ref<Suggestion[]> = ref([])
const app: Ref<String> = ref("")
const selected: Ref<number> = ref(-1)
const analyzeStatus: Ref<boolean> = ref(false)

let content: any = ""

onMounted(async () => {
  await getSuggestions()
  await useFetch(`${appConfig.url}/api/app_id`, {
    method: "GET",
    onResponse({response}) {
      app.value = response._data.app_id
    }
  })
})

async function getSuggestions() {
  analyzeStatus.value = true
  console.log(content)
  await useFetch(`${appConfig.url}/api/suggestions`, {
    method: "POST",
    body: {
      app_id: app.value,
      user_prompt: content
    },
    onResponse({response}) {
      suggestions.value = response._data
      analyzeStatus.value = false
    }
  })
  suggestions.value.forEach( suggestion => {
    const index = content.indexOf(suggestion.problem_sentence)
    const problem = suggestion.problem_sentence.replace(suggestion.incorrect, `<span class="underline">${suggestion.incorrect}</span>`)
    content = content.substring(0, index) + problem + content.substring(index + suggestion.problem_sentence.length)
  })
}

function deleteSuggestion(index: number) {
  suggestions.value.forEach( suggestion => {
    if (!suggestion) return
    if (suggestion.index == index) {
      suggestions.value.splice(suggestions.value.indexOf(suggestion), 1)
    }
  })
}

function onContentChange(event: any) {
  if (!event.target) return
  content = event.target.innerHTML
}
</script>
