import React from "react";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

const FaqChips = ({ actionProvider, faqData }) => (
  <Stack direction="row" flexWrap="wrap" gap={1}>
    {faqData.map((item, i) => (
      <Chip
        key={i}
        label={item.faq}
        clickable
        sx={{ mb: 1 }}
        onClick={() => actionProvider.showAnswer(item.desc)}
      />
    ))}
  </Stack>
);

export default FaqChips;
