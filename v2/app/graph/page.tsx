import React from 'react';
import { ReactFlow, Background } from '@xyflow/react';
 
export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow>
      <Background />
    </ReactFlow>
    </div>
    
  );
}