<template>
  <div
    class="w-96 p-4 m-4 rounded-lg bg-white drop-shadow-lg
    transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:bg-gray-50">
    <div :class="{hidden: !props.hidden}">
      <span class="mr-2 text-base text-black before:content-[''] before:border before:rounded-lg before:mr-2 before:border-blue-500 truncate max-w-[60%] inline-block">
        {{ props.error }}
      </span>
      <span
         class="before:content-[''] before:w-1.5 before:h-1.5 before:border before:rounded-full before:inline-flex
         before:bg-gray-400 before:align-middle before:mt-1 before:mb-1 before:mr-2 text-gray-500 font-thin relative -top-1.5"
      >
          {{ message }}
      </span>
    </div>
    <div :class="{hidden: props.hidden}">
      <div>
        <span class="ml-1 uppercase text-[9px] text-blue-500 before:content-[''] before:border before:rounded-lg before:mr-2 before:border-blue-500">
          {{ props.correctionType }}
        </span>
        <div class="inline-flex"/>
        <button class="relative -top-2 float-right rounded-lg p-1 hover:bg-gray-200 active:bg-gray-300" @click="deleteSuggestion">
          <Icon size="18" name="octicon:trash-24"/>
        </button>
      </div>
      <h2 class="mt-2 text-lg text-gray-600">
        Do you mean:
        <del class="decoration-red-600">{{ props.error }}</del>
        <span v-if="props.fix">
          &rarr;
          <span class="p-1.5 bg-blue-600 rounded text-lg text-slate-100">{{ props.fix }}</span>
        </span>
      </h2>
      <p class="mt-2 mb-3 text-base font-light indent-4">{{ props.content }}</p>
      <div class="border-t border-solid border-gray-200 mt-3 mb-5"/>
      <div class="grid">
        <p v-for="text in history"
           class="mb-4 p-2 odd:text-white even:text-gray-700 odd:bg-blue-400 even:bg-slate-200 rounded-xl
           odd:place-self-end even:place-self-start
        ">
          {{ text }}
      </p>
      </div>
      <input
          v-model="question"
          placeholder="What's wrong with my content?"
          @keyup.enter="submit"
          class="w-full p-2 mt-2 border border-solid border-gray-200 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:border-blue-500
          hover:outline-none hover:ring-2 hover:ring-blue-500 hover:border-transparent"
          :disabled="inputDisable">
    </div>
  </div>
</template>

<script lang="ts" setup>
const appConfig = useAppConfig()

const props = defineProps({
  correctionType: String,
  content: String,
  error: String,
  fix: String,
  index: Number,
  app: String,
  hidden: Boolean,
})

const message = computed(() => {
  if (props.correctionType == "spelling") {
    return "Spelling mistake"
  } else if (props.correctionType == "grammar") {
    return "Grammar mistake"
  } else if (props.correctionType == "punctuation") {
    return "Punctuation mistake"
  } else if (props.correctionType == "tone") {
    return "Tone mistake"
  } else if (props.correctionType == "logic") {
    return "Logic mistake"
  } else {
    return props.correctionType
  }
})

const question = ref("")
const inputDisable = ref(false)
const emit = defineEmits(["delete"])

let history: String[] = []

async function submit() {
  if (question.value == "") return
  const questionVal: string = question.value
  question.value = ""
  inputDisable.value = true
  history.push(questionVal)
  await useFetch(`${appConfig.url}/api/dialogue`, {
    method: "POST",
    body: {
      user_feedback: questionVal,
      index: props.index,
      app: props.app,
    } as DialogRequest,
    onResponse({response}) {
      history.push(response._data.feedback)
      inputDisable.value = false
    }
  })
}

function deleteSuggestion() {
  emit("delete", props.index)
}
</script>