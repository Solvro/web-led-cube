import React from "react";
import ReactMarkdown from "react-markdown";
import "./Tutorial.css";

// TODO zmienić poniższe na faktyczny Tutorial

const tutorialContent = `
# LED Cube Tutorial

## Wprowadzenie
W tym samouczku dowiesz się, jak używać panelu do animacji LED Cube.

## Podstawowe kroki
1. **Załaduj kod** – możesz wkleić kod sterujący kostką.
2. **Uruchom animację** – zobacz efekt na żywo.
3. **Zapisz projekt** – możesz zapisać swoje prace.

> Pamiętaj, aby korzystać z dokumentacji do tworzenia bardziej zaawansowanych efektów!

---

Dalsze instrukcje będą dodawane na bieżąco...
`;

export const Tutorial = () => {
    return (
        <div className="tutorial-container">
            <div className="tutorial-content">
                <ReactMarkdown>{tutorialContent}</ReactMarkdown>
            </div>
        </div>
    );
};