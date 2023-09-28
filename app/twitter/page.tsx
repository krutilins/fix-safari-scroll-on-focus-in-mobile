"use client";
import React from "react";

const STICKY_INPUT_BUGGED_CLASS_NAME = "sticky-input-bugged";

export default function Home() {
  return (
    <main>
      <div className="container">
        <h1>Chat</h1>
        <div className="message-history">
          {Array.from(Array(100).keys()).map((i) => (
            <div className="list-item" key={i} id={`${i}`}>
              {i} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            </div>
          ))}
        </div>
        <div className="actions">
          <textarea
            autoFocus={false}
            className={`message-input ${STICKY_INPUT_BUGGED_CLASS_NAME}`}
            placeholder="Message"
          />
          <button className="btn btn-primary">Button</button>
        </div>
      </div>
    </main>
  );
}
