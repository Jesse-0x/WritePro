import React, {useState} from 'react'
import { TrashIcon } from '@primer/octicons-react'
import {postAxios} from "@/utils/axios";

type SuggestionProps = {
  correctionType: String,
  content: String,
  error: String,
  fix: String,
  index: Number,
  app_id: String,
  hidden: Boolean,
  deleteSuggestion: Function,
  onClick: Function
}

export default function Suggestion(props: SuggestionProps) {
  let message: String
  if (props.correctionType == "spelling") {
    message = "Spelling mistake"
  } else if (props.correctionType == "grammar") {
    message = "Grammar mistake"
  } else if (props.correctionType == "punctuation") {
    message = "Punctuation mistake"
  } else if (props.correctionType == "tone") {
    message = "Tone mistake"
  } else if (props.correctionType == "logic") {
    message = "Logic mistake"
  } else {
    message = props.correctionType
  }

  let title: JSX.Element
  if (props.fix) {
    title = (
      <span>
        <span> </span>
        &rarr;
        <span> </span>
        <span className="p-1.5 bg-blue-600 rounded text-lg text-slate-100">
          { props.fix }
        </span>
      </span>
    )
  } else {
    title = <></>
  }

  let [history, setHistory] = useState<Array<any>>([])
  let [inputDisable, setInputDisable] = useState(false)
  let [question, setQuestion] = useState("")
  async function submit(event: React.KeyboardEvent) {
    if (event.key !== "Enter") return
    if (question === "") return
    const questionVal: string = question
    setQuestion("")
    setInputDisable(true)
    history.push(questionVal)
    setHistory(history)
    await postAxios("/api/dialogue", {
      user_feedback: questionVal,
      index: props.index,
      app_id: props.app_id
    }).then((data: any) => {
      history.push(data.feedback)
      setHistory(history)
      setInputDisable(false)
    })
  }

  return (
    <div
      className={"w-96 p-4 m-4 rounded-lg bg-white drop-shadow-lg transition-all duration-300 ease-in-out transform " +
        "hover:scale-105 hover:shadow-xl hover:bg-gray-50"}
      onClick={() => props.onClick()}
    >
      <div className={props.hidden ? "hidden" : ""}>
        <span className={"mr-2 text-base text-black before:content-[''] before:border before:rounded-lg before:mr-2 " +
          "before:border-blue-500 truncate max-w-[60%] inline-block"}>
          { props.error }
        </span>
        <span className={"before:content-[''] before:w-1.5 before:h-1.5 before:border before:rounded-full " +
          "before:inline-flex before:bg-gray-400 before:align-middle before:mt-1 before:mb-1 before:mr-2 " +
          "text-gray-500 font-thin relative -top-1.5"}>
          { message }
        </span>
      </div>
        <div className={!props.hidden ? "hidden" : ""}>
          <span className={"ml-1 uppercase text-[9px] text-blue-500 before:content-[''] before:border before:rounded-lg " +
            "before:mr-2 before:border-blue-500"}>
            { props.correctionType }
          </span>
          <div className="inline-flex"/>
          <button className="relative -top-2 float-right rounded-lg p-1 hover:bg-gray-200 active:bg-gray-300"
                  onClick={() => props.deleteSuggestion}>
            <TrashIcon size={18} />
          </button>
        <h2 className="mt-2 text-lg text-gray-600">
          <span>Do you mean: </span>
          <del className="decoration-red-600">{ props.error }</del>
          { title }
        </h2>
        <p className="mt-2 mb-3 text-base font-light indent-4">{ props.content }</p>
        <div className="border-t border-solid border-gray-200 mt-3 mb-5"/>
        <div className="grid">
          { history.map((text, i) => (
            <p key={i} className={"mb-4 p-2 odd:text-white even:text-gray-700 odd:bg-blue-400 even:bg-slate-200 rounded-xl " +
              "odd:place-self-end even:place-self-start"}>
              { text }
            </p>
          )) }
        </div>
        <input
          type="text"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="What's wrong with my content?"
          className={"w-full p-2 mt-2 border border-solid border-gray-200 rounded-lg focus:outline-none focus:ring-2 " +
            "focus:ring-blue-500 focus:border-transparent focus:border-blue-500 hover:outline-none hover:ring-2 " +
            "hover:ring-blue-500 hover:border-transparent"}
          disabled={inputDisable}
          onKeyDown={submit}
        />
      </div>
    </div>
  )
}