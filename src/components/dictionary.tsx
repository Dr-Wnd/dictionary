import React, { useState, useEffect } from 'react';
import './dictionary.css';

// Debounce function to limit the rate of API calls
const debounce = (func: Function, delay: number) => {
  let debounceTimer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func(...args), delay);
  };
};

const Dictionary: React.FC = () => {
  const [word, setWord] = useState('');
  const [infoText, setInfoText] = useState('');
  const [title, setTitle] = useState('');
  const [meaning, setMeaning] = useState('');
  const [audioSrc, setAudioSrc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAPI = async (word: string) => {
    try {
      setIsLoading(true);
      setInfoText(`Searching the meaning of "${word}"`);
      const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
      const result = await fetch(url).then((res) => res.json());

      if (result.title) {
        setTitle(word);
        setMeaning('N/A');
        setAudioSrc('');
      } else {
        setTitle(result[0].word);
        setMeaning(result[0].meanings[0].definitions[0].definition);
        setAudioSrc(result[0].phonetics[0].audio);
      }
    } catch (error) {
      console.error(error);
      setError('An error happened, try again later');
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchAPI = debounce(fetchAPI, 500);

  useEffect(() => {
    if (word) {
      debouncedFetchAPI(word);
    }
  }, [word]);

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      setWord(e.currentTarget.value);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWord(e.currentTarget.value);
  };

  return (
    <div className="dictionary-container">
      <input
        id="input"
        type="text"
        placeholder="Type a word and press Enter"
        onKeyUp={handleKeyUp}
        onChange={handleChange}
      />
      {isLoading && <p id="info-text">{infoText}</p>}
      {error && <p id="info-text">{error}</p>}
      <div id="meaning-container" style={{ display: title ? 'block' : 'none' }}>
        <h3 id="title">{title}</h3>
        <p id="meaning">{meaning}</p>
        {audioSrc && (
          <audio id="audio" controls>
            <source src={audioSrc} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    </div>
  );
};

export default Dictionary;