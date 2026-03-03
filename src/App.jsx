import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import OpeningPage from './pages/OpeningPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/signupPage'
import Home from './pages/homepage'
import EventsPage from './pages/EventsPage'
import EventDetails from './pages/EventDetails'
import Learn from './pages/learn'
import DomainDetail from './pages/DomainDetail'
import Talk from './pages/talk'
import APODPage from './pages/APODPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OpeningPage />} />
        <Route path="/login/*" element={<LoginPage />} />
        <Route path="/signup/*" element={<SignupPage />} />
        <Route path="/homepage" element={<Home />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/learn/domain/:id" element={<DomainDetail />} />
        <Route path="/talk" element={<Talk />} />
        <Route path="/apod" element={<APODPage />} />
      </Routes>
    </BrowserRouter>
  )
}