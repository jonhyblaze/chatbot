import { useState, useRef, useEffect } from "react"
import styles from "./index.module.css"

export default function Home() {
  const [textInput, setTextInput] = useState("")
  const [result, setResult] = useState()
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const outputContainerRef = useRef(null)
  
  
  async function onSubmit(event) {
    event.preventDefault()
    setQuestions([...questions, textInput])
    setTextInput("")
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: textInput }),
      });
      
      const data = await response.json()
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`)
      }

      setResult(data.choices[0].text)
      setAnswers([...answers, data.choices[0].text])
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error)
      alert(error.message)
    }
    finally {
       // Scroll to the bottom of the output container
      if(answers.length > 1) {
        outputContainerRef.current.scrollTop = outputContainerRef.current.scrollHeight
      }  
    }
  }

  return (
    <div>
      <main className={styles.main}>
      {result && 
        <header className={styles.outputContainer} ref={outputContainerRef}>
          {questions.map((question, index) => (
            <section key={index} className={styles.textOutput}>
              <aside className={styles.question}>{question}</aside>
              <DelayedRender delay={750}>
                <article className={styles.result}>{answers[index]}</article>
              </DelayedRender>
            </section>
            ))}
        </header>
      }
        <form onSubmit={onSubmit} className={styles.form}>
          <input
            type="text"
            name="text"
            placeholder="Ask me something"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className={styles.input}
            autoComplete="off" 
          />
          <input type="submit" value="Send" className={styles.button}/>
        </form>
      </main>
    </div>
  )
}


function DelayedRender({ delay, children }) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShouldRender(true);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [delay]);

  return shouldRender ? children : null;
}