import Editor from "@monaco-editor/react";

function CodeEditor({ language, code, setCode }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow bg-white">
      <Editor
        height="500px"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{
          fontSize: 16,
          minimap: {
            enabled: false,
          },
          automaticLayout: true,
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}

export default CodeEditor;