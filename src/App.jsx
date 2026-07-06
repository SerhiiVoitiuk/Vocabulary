import { useState, useEffect } from "react";
import { getWords } from "./lib/appwriteConfig";

import CardDeck from "./components/CardDeck";

function App() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const data = await getWords();
        
        setWords(data);
      } catch (error) {
        console.error("FULL APPWRITE ERROR:", error);
      }
    };

    loadCards();
  }, []);

  return (
    <div className="App">
      <CardDeck words={words} />
    </div>
  );
}

export default App;
