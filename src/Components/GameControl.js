import React, { useState } from 'react'
import { Modal, Button, Form } from "react-bootstrap";

export default function GameControl({moves, isCardOpen, restartGame, fetchReviews, handleGameDifficulty, deckSize}) {
  const [isResultsModalReady, setIsResultsModalReady] = useState(true)
  const [isFormModalShown, setIsFormModalShown] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    rating: '',
    comments: ''
  })
  
  function showModal() {
    return isCardOpen.find(card=>!card) === undefined ? true : false
  }

  
  function handleFormInfo(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setIsResultsModalReady(false)
    const gameDifficulty = () => {
      switch (deckSize) {
        case 10: return 'Easy'
        case 20: return 'Medium'
        case 30: return 'Hard'
        default: return 'Medium'
      }
    }
    fetch('http://localhost:4000/reviews',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        rating: form.rating !== '' ? parseInt(form.rating) : 5,
        comments: form.comments,
        gameDifficulty: gameDifficulty(),
        moves: moves,
        datePosted: Date.now()
      })
    }).then(fetchReviews)
    setForm({
      firstName: '',
      lastName: '',
      rating: '',
      comments: ''
    })
  }
  
  
  return (
    <div className='game-stats'>
      <i className="fas fa-retweet fa-2x" onClick={()=>{restartGame();setIsResultsModalReady(true);setIsFormModalShown(false)}}></i>
      <span>
        <div onChange={(e)=>{handleGameDifficulty(e);setIsResultsModalReady(true)}}>
          <Form.Check inline name='difficulty' type='radio' label='Easy' value='easy'/>
          <Form.Check inline name='difficulty' type='radio' label='Medium' value='medium' defaultChecked/>
          <Form.Check inline name='difficulty' type='radio' label='Hard' value='hard'/>
        </div>
      </span>
      <span><h5><strong>Moves: {Math.floor(moves)}</strong></h5></span>
      {isResultsModalReady && 
        <Modal centered show={isResultsModalReady && showModal()}>
          <Modal.Header closeButton onClick={()=>{setIsResultsModalReady(false);setIsFormModalShown(false)}}>
            <Modal.Title>Congratulations!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            You've matched all cards in {Math.floor(moves)} moves!
            <br/><br/>
            Would you like to save your results and rate us?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={()=>{setIsResultsModalReady(false);setIsFormModalShown(false)}}>
              No
            </Button>
            <Button variant="primary" onClick={()=>setIsFormModalShown(true)}>
              Yes
            </Button>
          </Modal.Footer>
          {isFormModalShown &&
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Control required type="text" placeholder="Enter first name" name="firstName" value={form.firstName} onChange={handleFormInfo}/>
              <Form.Control type="text" placeholder="Enter last name" name="lastName" value={form.lastName} onChange={handleFormInfo}/>
              <Form.Group controlId="formSelect">
              <Form.Label>Rate me:</Form.Label>
                <Form.Select required name="rating" onChange={handleFormInfo}>
                  <option value="5">Five</option>
                  <option value="4">Four</option>
                  <option value="3">Three</option>
                  <option value="2">Two</option>
                  <option value="1">One</option>
                  <option value="0">Zero</option>
                </Form.Select>
            </Form.Group>
              <br/>
              <Form.Control type="text" placeholder="Comments..." name="comments" value={form.comments} onChange={handleFormInfo}/>
              <br/>
              <Modal.Footer>
                <Button variant="success" type="submit">
                  Submit
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>}
        </Modal>}
    </div>
    )
}