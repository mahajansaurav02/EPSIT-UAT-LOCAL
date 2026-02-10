// import { useMemo } from "react";
// import ChatBot from "react-chatbotify";
// import Fuse from "fuse.js";
// import { faqData } from "../../NotesArray/NotesArray";

// // Flatten for Fuse search
// const flatFaqList = faqData.flatMap((item) =>
//   item.ques.map((q) => ({
//     ...q,
//     category: item.category,
//   }))
// );

// const FAQChatbot = () => {
//   const fuse = useMemo(
//     () =>
//       new Fuse(flatFaqList, {
//         keys: ["faq", "desc"],
//         threshold: 0.3,
//       }),
//     []
//   );

//   const flow = {
//     start: {
//       message: "नमस्कार! कृपया विभाग निवडा किंवा प्रश्न टाइप करा.",
//       options: () => [...new Set(faqData.map((item) => item.category))],
//       action: ({ context = {} }) => {
//         context.selectedCategory = undefined;
//       },
//       path: "handle_input",
//     },

//     handle_input: {
//       message: ({ userInput, context = {} }) => {
//         const input = (userInput || "").trim();
//         if (!input) return "कृपया काहीतरी टाइप करा.";

//         const matchedCategory = faqData
//           .map((item) => item.category)
//           .find((cat) => cat.toLowerCase() === input.toLowerCase());

//         if (matchedCategory) {
//           context.selectedCategory = matchedCategory;
//           return `“${matchedCategory}” विभाग निवडला आहे. खाली प्रश्न दिसतील.`;
//         }

//         const results = fuse.search(input);
//         if (results.length > 0) {
//           return results[0].item.desc;
//         }

//         return "माफ करा, प्रश्न समजला नाही. कृपया पुन्हा विचार करा.";
//       },
//       path: ({ context }) =>
//         context?.selectedCategory ? "show_questions" : "handle_input",
//     },

//     show_questions: {
//       message: ({ context }) =>
//         context?.selectedCategory
//           ? "खालीलपैकी एखादा प्रश्न निवडा:"
//           : "कृपया विभाग निवडा.",
//       options: ({ context }) => {
//         const matched = faqData.find(
//           (item) => item.category === context?.selectedCategory
//         );
//         return matched ? matched.ques.map((q) => q.faq) : [];
//       },
//       path: "show_answer",
//     },

//     show_answer: {
//       message: ({ userInput, context }) => {
//         const match = flatFaqList.find(
//           (item) =>
//             item.faq.toLowerCase() === userInput.toLowerCase() &&
//             item.category === context?.selectedCategory
//         );
//         return match ? match.desc : "कृपया यादीतील प्रश्न निवडा.";
//       },
//       path: "ask_again",
//     },

//     ask_again: {
//       message:
//         "अजून काही विचारायचं आहे का? पुन्हा विभाग निवडा किंवा प्रश्न टाइप करा.",
//       options: () => [...new Set(faqData.map((item) => item.category))],
//       action: ({ context = {} }) => {
//         context.selectedCategory = undefined;
//       },
//       path: "handle_input",
//     },
//   };

//   return <ChatBot flow={flow} context={{}} />;
// };

// export default FAQChatbot;

//----------------------------------------------------------------------------------------------------

// import React, { useEffect } from "react";
// import { Widget, addResponseMessage } from "react-chat-widget";
// import "react-chat-widget/lib/styles.css";
// import { faqData } from "../../NotesArray/NotesArray";

// const FAQChatbot = () => {
//   useEffect(() => {
//     addResponseMessage("नमस्कार! कृपया तुमचा प्रश्न विचारा किंवा विभाग लिहा.");
//   }, []);

//   const handleNewUserMessage = (message) => {
//     const query = message.toLowerCase();

//     // First: Try matching category
//     const category = faqData.find(
//       (cat) => cat.category.toLowerCase() === query
//     );

//     if (category) {
//       const questions = category.ques.map((q, i) => `${i + 1}. ${q.faq}`);
//       addResponseMessage(
//         `“${category.category}” विभागासाठी प्रश्न:\n\n${questions.join("\n")}`
//       );
//       return;
//     }

//     // Then: Match any question
//     const flatQuestions = faqData.flatMap((cat) =>
//       cat.ques.map((q) => ({
//         ...q,
//         category: cat.category,
//       }))
//     );

//     const matched = flatQuestions.find((q) =>
//       q.faq.toLowerCase().includes(query)
//     );

//     if (matched) {
//       addResponseMessage(matched.desc);
//     } else {
//       addResponseMessage("माफ करा, प्रश्न समजला नाही. कृपया पुन्हा विचार करा.");
//     }
//   };

//   return (
//     <Widget
//       handleNewUserMessage={handleNewUserMessage}
//       title="ईप्सित माहिती"
//       subtitle="विभाग किंवा प्रश्न विचारा"
//       senderPlaceHolder="आपला प्रश्न येथे टाका..."
//       showCloseButton
//     />
//   );
// };

// export default FAQChatbot;

//------------------------------------------------------------------------------------------

// import React, { useState, useMemo } from "react";
// import { Box, Typography, Chip, TextField, Button, Paper } from "@mui/material";
// import Fuse from "fuse.js";
// import { faqData } from "../../NotesArray/NotesArray";

// const FAQChatbot = () => {
//   const [messages, setMessages] = useState([
//     { type: "bot", text: "नमस्कार! कृपया विभाग निवडा किंवा प्रश्न टाका." },
//   ]);
//   const [userInput, setUserInput] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState(null);

//   const categories = useMemo(
//     () => [...new Set(faqData.map((f) => f.category))],
//     []
//   );

//   const flatFaqs = useMemo(
//     () =>
//       faqData.flatMap((cat) =>
//         cat.ques.map((q) => ({
//           ...q,
//           category: cat.category,
//         }))
//       ),
//     []
//   );

//   const fuse = useMemo(() => {
//     return new Fuse(flatFaqs, {
//       keys: ["faq", "desc"],
//       threshold: 0.3,
//     });
//   }, [flatFaqs]);

//   const handleSend = () => {
//     if (!userInput.trim()) return;

//     const input = userInput.trim();
//     addMessage("user", input);

//     // 1. Check if category selected by name
//     const matchedCategory = categories.find(
//       (cat) => cat.toLowerCase() === input.toLowerCase()
//     );

//     if (matchedCategory) {
//       setSelectedCategory(matchedCategory);
//       addMessage(
//         "bot",
//         `“${matchedCategory}” विभाग निवडला आहे. खाली प्रश्न दिसतील.`
//       );
//       return;
//     }

//     // 2. Search by question
//     const result = fuse.search(input);
//     if (result.length > 0) {
//       addMessage("bot", result[0].item.desc);
//     } else {
//       addMessage("bot", "माफ करा, प्रश्न समजला नाही. कृपया पुन्हा विचार करा.");
//     }

//     setUserInput("");
//   };

//   const addMessage = (type, text) => {
//     setMessages((prev) => [...prev, { type, text }]);
//   };

//   const handleCategoryClick = (category) => {
//     setSelectedCategory(category);
//     addMessage("bot", `“${category}” विभाग निवडला आहे. खाली प्रश्न दिसतील.`);
//   };

//   const handleQuestionClick = (question, answer) => {
//     addMessage("user", question);
//     addMessage("bot", answer);
//   };

//   return (
//     <Paper elevation={4} sx={{ p: 2, maxWidth: 600, mx: "auto", mt: 4 }}>
//       <Typography variant="h6" gutterBottom>
//         ईप्सित FAQ Chatbot
//       </Typography>

//       <Box sx={{ maxHeight: 300, overflowY: "auto", mb: 2 }}>
//         {messages.map((msg, i) => (
//           <Box
//             key={i}
//             sx={{
//               display: "flex",
//               justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
//               mb: 1,
//             }}
//           >
//             <Box
//               sx={{
//                 bgcolor: msg.type === "user" ? "#1976d2" : "#f1f1f1",
//                 color: msg.type === "user" ? "#fff" : "#000",
//                 px: 2,
//                 py: 1,
//                 borderRadius: 2,
//                 maxWidth: "80%",
//               }}
//             >
//               {msg.text}
//             </Box>
//           </Box>
//         ))}
//       </Box>

//       {/* Category Chips */}
//       {!selectedCategory && (
//         <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
//           {categories.map((cat) => (
//             <Chip
//               key={cat}
//               label={cat}
//               onClick={() => handleCategoryClick(cat)}
//               color="primary"
//               variant="outlined"
//             />
//           ))}
//         </Box>
//       )}

//       {/* Question List */}
//       {selectedCategory && (
//         <Box sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 1 }}>
//           {faqData
//             .find((cat) => cat.category === selectedCategory)
//             ?.ques.map((q, idx) => (
//               <Chip
//                 key={idx}
//                 label={q.faq}
//                 onClick={() => handleQuestionClick(q.faq, q.desc)}
//                 color="secondary"
//                 variant="outlined"
//               />
//             ))}
//         </Box>
//       )}

//       {/* Input Box */}
//       <Box sx={{ display: "flex", gap: 1 }}>
//         <TextField
//           fullWidth
//           size="small"
//           variant="outlined"
//           placeholder="तुमचा प्रश्न टाका..."
//           value={userInput}
//           onChange={(e) => setUserInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSend()}
//         />
//         <Button variant="contained" onClick={handleSend}>
//           पाठवा
//         </Button>
//       </Box>
//     </Paper>
//   );
// };

// export default FAQChatbot;

//----------------------------------------------------------------------------------------------

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Chip,
  TextField,
  Button,
  Paper,
  SpeedDial,
  SpeedDialAction,
  Backdrop,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CloseIcon from "@mui/icons-material/Close";
import Fuse from "fuse.js";
import { faqData } from "../../NotesArray/NotesArray";

const FAQChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: "bot", text: "नमस्कार! कृपया विभाग निवडा किंवा प्रश्न टाका." },
  ]);
  const [userInput, setUserInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = useMemo(
    () => [...new Set(faqData.map((f) => f.category))],
    []
  );

  const flatFaqs = useMemo(
    () =>
      faqData.flatMap((cat) =>
        cat.ques.map((q) => ({
          ...q,
          category: cat.category,
        }))
      ),
    []
  );

  const fuse = useMemo(() => {
    return new Fuse(flatFaqs, {
      keys: ["faq", "desc"],
      threshold: 0.3,
    });
  }, [flatFaqs]);

  const handleSend = () => {
    if (!userInput.trim()) return;
    const input = userInput.trim();
    addMessage("user", input);

    const matchedCategory = categories.find(
      (cat) => cat.toLowerCase() === input.toLowerCase()
    );

    if (matchedCategory) {
      setSelectedCategory(matchedCategory);
      addMessage(
        "bot",
        `“${matchedCategory}” विभाग निवडला आहे. खाली प्रश्न दिसतील.`
      );
      setUserInput("");
      return;
    }

    const result = fuse.search(input);
    if (result.length > 0) {
      addMessage("bot", result[0].item.desc);
    } else {
      addMessage("bot", "माफ करा, प्रश्न समजला नाही. कृपया पुन्हा विचार करा.");
    }

    setUserInput("");
  };

  const addMessage = (type, text) => {
    setMessages((prev) => [...prev, { type, text }]);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    addMessage("bot", `“${category}” विभाग निवडला आहे. खाली प्रश्न दिसतील.`);
  };

  const handleQuestionClick = (question, answer) => {
    addMessage("user", question);
    addMessage("bot", answer);
  };

  return (
    <>
      <Backdrop
        open={open}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        onClick={() => setOpen(false)}
      />

      <SpeedDial
        ariaLabel="FAQ Chatbot"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        icon={<HelpOutlineIcon />}
        onClick={() => setOpen((prev) => !prev)}
        open={open}
        FabProps={{ color: "primary" }}
      >
        {open && (
          <SpeedDialAction
            icon={<CloseIcon />}
            tooltipTitle="Close"
            onClick={() => setOpen(false)}
          />
        )}
      </SpeedDial>

      {open && (
        <Paper
          elevation={5}
          sx={{
            position: "fixed",
            bottom: 90,
            right: 16,
            width: 390,
            maxHeight: 500,
            p: 2,
            overflow: "auto",
            zIndex: (theme) => theme.zIndex.drawer + 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {/* ईप्सित Chatbot */}
            ईप्सित प्रश्नोत्तर सहाय्यक
          </Typography>

          <Box sx={{ maxHeight: 250, overflowY: "auto", mb: 2 }}>
            {messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.type === "user" ? "flex-end" : "flex-start",
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    bgcolor: msg.type === "user" ? "#1976d2" : "#f1f1f1",
                    color: msg.type === "user" ? "#fff" : "#000",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: "80%",
                  }}
                >
                  {msg.text}
                </Box>
              </Box>
            ))}
          </Box>

          {!selectedCategory && (
            <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {categories.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  onClick={() => handleCategoryClick(cat)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          )}

          {selectedCategory && (
            <Box
              sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 1 }}
            >
              {faqData
                .find((cat) => cat.category === selectedCategory)
                ?.ques.map((q, idx) => (
                  <Chip
                    key={idx}
                    label={q.faq}
                    onClick={() => handleQuestionClick(q.faq, q.desc)}
                    color="secondary"
                    variant="outlined"
                  />
                ))}
            </Box>
          )}

          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="तुमचा प्रश्न टाका..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button variant="contained" onClick={handleSend}>
              पाठवा
            </Button>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default FAQChatbot;
