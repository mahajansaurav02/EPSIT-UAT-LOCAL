import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { filterOnlyMarathiAndEnglishLettersWithSpaces } from "../../Validations/utils";

const TransliterationTextField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
}) => {
  const [text, setText] = useState(value);

  useEffect(() => {
    setText(value);
  }, [value]);

  // const handleInputChange = (event) => {
  //   const { value } = event.target;
  //   setText(value);
  //   onChange(event);
  // };

  const handleInputChange = (event) => {
    const { value } = event.target;
    const filteredValue = filterOnlyMarathiAndEnglishLettersWithSpaces(value);
    setText(filteredValue);
    onChange({ target: { name, value: filteredValue } });
  };

  const handleKeyDown = async (event) => {
    if (event.key === " " && text.trim() !== "") {
      try {
        const response = await fetch(
          `https://inputtools.google.com/request?text=${encodeURIComponent(
            text
          )}&itc=${encodeURIComponent("mr-t-i0-und")}&num=1`
        );
        const data = await response.json();
        const marathiValue = data[1][0][1];

        setText(marathiValue + " ");
        onChange({ target: { name, value: marathiValue + " " } });
      } catch (error) {
        console.error("Error fetching transliteration:", error);
      }
    }
  };

  return (
    <TextField
      fullWidth
      className="textfield"
      variant="outlined"
      size="small"
      label={label}
      placeholder={placeholder}
      name={name}
      value={text}
      onBlur={onBlur}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      error={error}
    />
  );
};

export default TransliterationTextField;
