

import Editor from '@monaco-editor/react';


const CodeEditor = () => {
  return (
    <>
        <h1>This is the Code Editor</h1>
         <Editor className='m-10' theme="vs-dark"  height="80vh" defaultLanguage="javascript" defaultValue="// some comment" />;
    </>
  )
}

export default CodeEditor