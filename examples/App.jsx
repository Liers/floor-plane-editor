import { useState } from 'react'
import './App.css'

function App() {
  
  const [count, setCount] = useState(0)

  return (
    <>
      <svg id="lin" viewBox="0 0 1100 700"  preserveAspectRatio="xMidYMin slice" xmlns="http://www.w3.org/2000/svg" style="z-index:2;margin:0;padding:0;width:100vw;height:100vh;position:absolute;top:0;left:0;right:0;bottom:0">
        <g id="boxgrid">
          <rect width="8000" height="5000" x="-3500" y="-2000" fill="url(#grid)" />
        </g>
        <g id="boxpath"></g>
        <g id="boxSurface"></g>
        <g id="boxRoom"></g>
        <g id="boxwall"></g>
        <g id="boxcarpentry"></g>
        <g id="boxEnergy"></g>
        <g id="boxFurniture"></g>
        <g id="boxbind"></g>
        <g id="boxArea"></g>
        <g id="boxRib"></g>
        <g id="boxScale"></g>
        <g id="boxText"></g>
        <g id="boxDebug"></g>
      </svg>
      
    </>
  )
}

export default App
