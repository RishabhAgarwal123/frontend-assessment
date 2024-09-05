import React from "react";
import "./App.css";
import UserList from "./components/UserList";
import { UserProvider } from "./context/UserContext";


export const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Welcome to DoseSpot</h1>
      </header>

      <UserProvider>
        <UserList />
      </UserProvider>

      <footer>
      </footer>
    </div>
  );
};