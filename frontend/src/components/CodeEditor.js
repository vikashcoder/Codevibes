
import React, { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import io from 'socket.io-client';
import axios from 'axios';
import './CodeEditor.css';

const socket = io('http://localhost:5000', { autoConnect: false });

const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const CodeEditor = ({ sessionId, token }) => {
  const editorRef = useRef(null);
  const textareaRef = useRef(null);
  const isUpdatingRef = useRef(false);

  const updateCodeInBackend = debounce(async (code) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/sessions/update-code`,
        { sessionId, code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Failed to update code:', error.message);
    }
  }, 1000);
  

  useEffect(() => {
    // Initialize CodeMirror with settings
    editorRef.current = CodeMirror.fromTextArea(textareaRef.current, {
      mode: 'javascript',
      theme: 'dracula',
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
    });

    // Connect socket
    if (!socket.connected) socket.connect();

    // Fetch initial code from backend
    const fetchInitialCode = async () => {
      try {
        const res = await axios.post(
          'http://localhost:5000/api/sessions/join',
          { sessionId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const initialCode = (res.data.code || 'Happy Coding').trim();
        editorRef.current.setValue(initialCode);
      } catch (error) {
        console.error('Failed to fetch initial code:', error.message);
        editorRef.current.setValue('Happy Coding');
      }
    };

    fetchInitialCode();

    // Handle code changes
    const handleChange = () => {
      if (isUpdatingRef.current) return;
      const code = editorRef.current.getValue();
      socket.emit('codeChange', { sessionId, code });
      updateCodeInBackend(code);
    };

    editorRef.current.on('change', handleChange);

    // Listen for code updates from socket
    socket.emit('joinSession', sessionId);
    socket.on('codeUpdate', (code) => {
      if (code !== editorRef.current.getValue()) {
        isUpdatingRef.current = true;
        editorRef.current.setValue(code);
        editorRef.current.focus();
        isUpdatingRef.current = false;
      }
    });

    // Clean up on unmount
    return () => {
      editorRef.current.off('change', handleChange);
      socket.off('codeUpdate');
    };
  }, [sessionId, token, updateCodeInBackend]);

  return <textarea ref={textareaRef} className="code-editor" />;
};

export default CodeEditor;
