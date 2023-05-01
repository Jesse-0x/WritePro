import Image from "next/image";
import Head from "next/head";
import {getAxios, postAxios} from "@/utils/axios";
import React, {useState} from "react";
import Suggestion from "@/components/Suggestion";

export default function Index() {
  let [analyzeStatus, setAnalyzeStatus] = useState(false)
  let app_id: string;
  let [contentEditable, setContentEditable] = useState<HTMLDivElement>()
  let [text, setText] = useState("")
  let [suggestions, setSuggestions] = useState<Array<any>>([])
  let [selection, setSelection] = useState(-1)

  async function getSuggestion() {
    getAxios("/api/app_id", {}).then((data: any) => {
      app_id = data.app_id
    })
    setAnalyzeStatus(true)
    await postAxios("/api/suggestions", {
      app_id: app_id,
      user_prompt: text
    }).then((data: any) => {
      setSuggestions(data)
      setAnalyzeStatus(false)
    })
    suggestions.forEach((suggestion) => {
      const problem_sentence_with_highlight = suggestion.problem_sentence.replace(suggestion.incorrect, `<span class="underline bg-red-300 p-1 rounded-lg">${suggestion.incorrect}</span>`)
      const text = contentEditable?.innerHTML
      // @ts-ignore
      contentEditable.innerHTML = text.replace(suggestion.problem_sentence, problem_sentence_with_highlight)
      setContentEditable(contentEditable)
    })
  }

  function deleteSuggestion(index: number) {
    suggestions.forEach( suggestion => {
      if (!suggestion) return
      if (suggestion.index === index) {
        setSuggestions(suggestions.slice(suggestions.indexOf(suggestion), 1))
      }
    })
  }

  function pasteAsPlainText(event: any) {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  }

  function onInput(event: any) {
    setText(event.target.innerText)
    // setContentEditable(event.target.innerHTML)
    setSelection(-1)
    console.log(text)
    console.log(contentEditable)
  }

  let buttonContent: JSX.Element
  if (analyzeStatus) {
    buttonContent = (
      <svg className="animate-spin -ml-1 mr-1 h-5 w-5 text-white inline"
           xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    )
  } else {
    buttonContent = <></>
  }
  return (
    <>
      <Head>
        <title>WritePro</title>
        <meta name="description" content="WritePro"/>
        <link rel="icon" href="/favicon.png"/>
      </Head>
      <div className="flex w-full bg-white h-16 drop-shadow-xl mb-6 p-3">
        <Image src="/favicon.png" alt="WritePro Icon" width={42} height={100}/>
        <span className={"ml-2 text-3xl p-0.5 text-gray-700"}>
          WritePro
        </span>
        <div className="flex-grow"/>
        <button className="bg-blue-500 text-white p-2 rounded-lg" onClick={getSuggestion}>
          { buttonContent }
          { analyzeStatus ? "Analyzing..." : "Analyze" }
        </button>
      </div>
      <div className="grid grid-cols-12">
        <div className="col-span-8 p-7">
          <div
            className={"border-2 border-gray-300 p-5 rounded-lg h-max overflow-auto focus-visible:border-gray-400 " +
              "focus-visible:outline-none"}
            ref={(element: any) => setContentEditable(element)}
            contentEditable={true}
            autoFocus={true}
            onInput={onInput}
            onPaste={(event: any) => pasteAsPlainText(event)}
          >
          </div>
        </div>
        <div className="col-span-4 h-max overflow-auto">
          {
            suggestions.map((suggestion, index) => {
                return (
                    <Suggestion
                      key={index}
                      correctionType={suggestion.category}
                      content={suggestion.reason}
                      error={suggestion.incorrect}
                      fix={suggestion.fix}
                      index={suggestion.index}
                      app_id={app_id}
                      hidden={selection === index}
                      deleteSuggestion={() => deleteSuggestion(suggestion.index)}
                      onClick={() => setSelection(index)}
                    />
                )
            })
          }
        </div>
      </div>
    </>
  )
}