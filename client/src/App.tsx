import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Home } from "./components/Home"
import Todo from "./components/Todo"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todo/:userid" element={<Todo />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
