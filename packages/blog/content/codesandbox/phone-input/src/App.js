import React from "react";
import { PhoneInput } from "./PhoneInput";

function App() {
  const [value, setValue] = React.useState("");
  return (
    <div className="App">
      <PhoneInput
        value={value}
        onChange={newValue => {
          setValue(newValue);
        }}
      />
    </div>
  );
}

export default App;
