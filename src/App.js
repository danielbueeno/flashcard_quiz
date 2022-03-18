import {useState, useEffect, useRef} from 'react'
import axios from 'axios';

import './app.css'

import FlashCardList from './FlashCardList';

function App() {
  const [flashcards, setFlascards] = useState([])
  const [categories, setCategories] = useState([])

  const categoryEl = useRef()
  const amountEl = useRef()

  useEffect(()=>{
    axios
    .get('https://opentdb.com/api_category.php')
    .then(res=>{
      setCategories(res.data.trivia_categories) 
    })
  },[])
 

  function decodeString(str) {
    const textArea = document.createElement('textarea')
    textArea.innerHTML= str
    return textArea.value
  }
  function handleSubmit(e){
    e.preventDefault()
    axios
    .get('https://opentdb.com/api.php',{
      params: {
        amount: amountEl.current.value,
        category: categoryEl.current.value
      }
    })
    .then(res=>{
      setFlascards(
        res.data.results.map((questionItem,index)=>{
        const answer =  decodeString(questionItem.correct_answer)
        const options = [...questionItem.incorrect_answers.map(a => decodeString(a)), answer]
        return{
          id:`${index}--${Date.now}`,
          question: decodeString(questionItem.question),
          answer: answer, 
          options: options.sort(()=>Math.random - 0.5)
        }  
      })) 
    })
  }

  return (
    <>
      <form className='header' onSubmit={handleSubmit}>

        <div className='form-group'>
          <label htmlFor='category'>Category</label>
          <select id='category' ref={categoryEl}>
            {categories.map(category =>{
              return <option value={category.id} key={category.id}>{category.name}</option>
            })}
          </select>
        </div>

        <div className='form-group'>
          <label htmlFor='amount'>Number of Questions</label>
          <input type="number" min="1" id='amount' step="1" defaultValue={10} ref={amountEl}></input>
        </div>

        <div className='form-group'>
          <button className='btn'>Generate</button>
        </div>
      </form>

      <div className="container">
        <FlashCardList flashcards={flashcards}/>
      </div>
    </>
    
    
  );
}


export default App;
