"use client";
import { useState, useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

interface AetherEditorProps {
  code: string;
  language: string;
  onChange: (value: string | undefined) => void;
  onExecute: () => Promise<void>;
}

export function AetherEditor({
  code,
  language,
  onChange,
  onExecute,
}: AetherEditorProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  // FIX: Expliziter Typ für die Monaco-Instanz
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleRun = async () => {
    setIsExecuting(true);
    try {
      await onExecute();
    } catch (error) {
      console.error("Kernel Execution Error:", error);
    } finally {
      // Das "Processing" Delay für das Terminal-Feeling
      setTimeout(() => setIsExecuting(false), 1200);
    }
  };

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    // Cursor-Animation & Smoothness optimieren
    editor.updateOptions({
      cursorBlinking: "expand",
      cursorSmoothCaretAnimation: "on",
      mouseWheelZoom: true,
    });
  };

  return (
    <div className="h-full w-full bg-[#050505] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col transition-all duration-700 hover:border-blue-500/20">
      {/* Editor Toolbar: AETHER Style */}
      <div className="flex items-center justify-between px-10 py-6 bg-[#080808] border-b border-white/5">
        <div className="flex gap-3">
          <div className="size-2 rounded-full bg-red-500/20 border border-red-500/40" />
          <div className="size-2 rounded-full bg-orange-500/20 border border-orange-500/40" />
          <div className="size-2 rounded-full bg-green-500/20 border border-green-500/40" />
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <div
              className={`size-1.5 rounded-full ${isExecuting ? "bg-blue-500 animate-ping" : "bg-blue-500/40"}`}
            />
            <span className="text-[9px] font-black uppercase tracking-[0.6em] text-white/30">
              Aether Script Engine //{" "}
              <span className="text-blue-500">{language}</span>
            </span>
          </div>
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent mt-2" />
        </div>

        <button
          onClick={handleRun}
          disabled={isExecuting}
          className={`relative group px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border overflow-hidden ${
            isExecuting
              ? "text-blue-400 border-blue-500/20 cursor-wait bg-blue-500/5"
              : "text-white border-white/10 hover:border-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]"
          }`}
        >
          <span className="relative z-10">
            {isExecuting ? "Injecting_Data..." : "Deploy to System"}
          </span>
          {!isExecuting && (
            <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity" />
          )}
        </button>
      </div>

      <div className="flex-1 relative min-h-[600px]">
        {/* Glow Effekt für die Matrix-Optik */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.08),transparent_70%)]" />

        <Editor
          height="100%"
          theme="aether-dark"
          language={language}
          value={code}
          onChange={onChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "JetBrains Mono, Menlo, Monaco, monospace",
            lineNumbers: "on",
            padding: { top: 40 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            smoothScrolling: true,
            roundedSelection: true,
            scrollbar: {
              vertical: "hidden",
              horizontal: "hidden",
            },
            contextmenu: false,
            renderLineHighlight: "all",
            fontLigatures: true,
          }}
          beforeMount={(monaco) => {
            monaco.editor.defineTheme("aether-dark", {
              base: "vs-dark",
              inherit: true,
              rules: [
                { token: "comment", foreground: "444444", fontStyle: "italic" },
                { token: "keyword", foreground: "3b82f6", fontStyle: "bold" },
                { token: "string", foreground: "00FF00" }, // Strings im Matrix-Grün
                { token: "number", foreground: "f97316" }, // Zahlen Orange
              ],
              colors: {
                "editor.background": "#050505",
                "editor.lineHighlightBackground": "#0a0a0a",
                "editorLineNumber.foreground": "#222222",
                "editorLineNumber.activeForeground": "#3b82f6",
                "editorIndentGuide.background": "#111111",
                "editor.selectionBackground": "#3b82f633",
                "editorCursor.foreground": "#3b82f6",
              },
            });
          }}
        />
      </div>

      {/* Status Bar */}
      <div className="px-10 py-3 bg-[#030303] border-t border-white/5 flex justify-between items-center">
        <span className="text-[8px] font-mono text-white/10 italic uppercase">
          System_Status: Stable
        </span>
        <span className="text-[8px] font-mono text-white/10 italic uppercase">
          Cluster_Node: Alpha_01
        </span>
      </div>
    </div>
  );
}
