import { useState, useEffect } from 'react';
import { parse } from 'json-parse';

import logo from './logo.svg';
import './App.css';

function App() {
  const url = 'http://hn.algolia.com/api/v1/search?tags=front_page';

  const [data, setData] = useState();

  useEffect(() => {
    async function get() {
      try {
        const res = await fetch(url);
        const body = await res.text();
        const data = parse(body);
        setData(data);
      } catch(e) {
        console.error(e);
      }
    }
    get();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <ul>
          {data && data.hits.map((h) => {
            return (
              <li key={h.objectID}>
                <a href={h.url}>{h.title}</a>
              </li>
            );
          })}
        </ul>
      </header>
    </div>
  );
}

export default App;
