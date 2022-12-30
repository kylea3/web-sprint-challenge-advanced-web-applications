import React, { useState, useEffect } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/') }
  const redirectToArticles = () => { navigate('/articles') }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    const token = localStorage.getItem('token');
    if(token) {
      localStorage.removeItem('token');
      setMessage('Goodbye!')
    }
    redirectToLogin();
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage('');
    setSpinnerOn(true);
    axios.post(loginUrl, {username: username, password: password})
      .then(res => {
        console.log(res.data.message);
        localStorage.setItem('token', res.data.token);
        setMessage(res.data.message);
        setSpinnerOn(false);
        redirectToArticles();
      })
      .catch(err => {
        setMessage(err.response.data.message)
        setSpinnerOn(false)
      })

  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    const token = localStorage.getItem('token');
    setMessage('');
    axios.get(articlesUrl, {
      headers: {
      authorization: token
      }
    })
    .then(res => {
      setArticles(res.data.articles)
      setMessage(res.data.message)
    })
    .catch(err => console.log(err))
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setMessage('');
    const token = localStorage.getItem('token')
    axios.post(articlesUrl, article, {
      headers: {
        authorization: token
      }
    })
    .then(res => {
      setMessage(res.data.message);
      getArticles()
    })
    .catch(err => {
      console.error(err)
    })

  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    setMessage('');
    const token = localStorage.getItem('token')
    axios.put(articlesUrl, article_id, article, {
      headers: {
        authorization: token
      }
    })
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.error(err)
    })

  }
  
  const currentArticle = articles.find(article => {
    return article.article_id === currentArticleId
    })


// useEffect(() => {
//   console.log(currentArticle)
//   }, [currentArticleId])

  const deleteArticle = article_id => {
    // ✨ implement
    const token = localStorage.getItem('token');
    axios.delete(`${articlesUrl}/${article_id}`, {
      headers: {
        authorization: token
      }
    })
    .then(res => {
      setMessage(res.data.message)
      setArticles(articles.filter(article => article.article_id !== Number(article_id)))
    })
    .catch(err => console.error(err))
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm postArticle={postArticle} updateArticle={updateArticle} setCurrentArticleId={setCurrentArticleId} currentArticle={currentArticle} />
              <Articles getArticles={getArticles} articles={articles} setCurrentArticleId={setCurrentArticleId} currentArticleId={currentArticleId} deleteArticle={deleteArticle} />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
