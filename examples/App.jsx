import { useRef, useEffect } from 'react';
import Editor from '../packages/Editor';
import './App.css';

function App() {
  const refContainer = useRef();
  const editorRef = useRef();

  useEffect(() => {
    const { current: container } = refContainer;
    if (!container) return;
    editorRef.current = new Editor(container);
  }, []);

  return (
    <div style={{background: '#f2eee5'}}>
      <svg id="lin" 
      viewBox="0 0 1100 700"  
      preserveAspectRatio="xMidYMin slice" 
      xmlns="http://www.w3.org/2000/svg" 
      style={{zIndex: 2, width: '100vw', height: '100vh'}}
      ref={refContainer}>
        <defs>
          <pattern id="grass" style={{patternUnits: 'userSpaceOnUse', width: 256, height: 256}}>
            <image xlinkHref="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWh5nEP_Trwo96CJjev6lnKe0_dRdA63RJFaoc3-msedgxveJd" x="0" y="0" width="256" height="256" />
          </pattern>
          <pattern id="wood" style={{patternUnits: 'userSpaceOnUse', width: 32, height: 256}}>
            <image xlinkHref="https://orig00.deviantart.net/e1f2/f/2015/164/8/b/old_oak_planks___seamless_texture_by_rls0812-d8x6htl.jpg" x="0" y="0" width="256" height="256" />
          </pattern>
          <pattern id="tiles" style={{patternUnits: 'userSpaceOnUse', width: 25, height: 25}}>
            <image xlinkHref="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrkoI2Eiw8ya3J_swhfpZdi_ug2sONsI6TxEd1xN5af3DX9J3R" x="0" y="0" width="256" height="256" />
          </pattern>
          <pattern id="granite" style={{patternUnits: 'userSpaceOnUse', width: 256, height: 256}}>
            <image xlinkHref="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9_nEMhnWVV47lxEn5T_HWxvFwkujFTuw6Ff26dRTl4rDaE8AdEQ" x="0" y="0" width="256" height="256" />
          </pattern>
          <pattern id="smallGrid" style={{patternUnits: 'userSpaceOnUse', width: 60, height: 60}}>
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#777" strokeWidth="0.25"/>
          </pattern>
          <pattern id="grid" style={{patternUnits: 'userSpaceOnUse', width: 180, height: 180}}>
            <rect width="180" height="180" fill="url(#smallGrid)"/>
            <path d="M 200 10 L 200 0 L 190 0 M 0 10 L 0 0 L 10 0 M 0 190 L 0 200 L 10 200 M 190 200 L 200 200 L 200 190" fill="none" stroke="#999" strokeWidth="0.8"/>
          </pattern>
          <pattern id="hatch" width="5" height="5" patternTransform="rotate(50 0 0)" patternUnits="userSpaceOnUse" >
            <path d="M 0 0 L 0 5 M 10 0 L 10 10 Z" style={{stroke: '#666', strokeWidth: 5}} />
          </pattern>
        </defs>
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
    </div>
  )
}

export default App
