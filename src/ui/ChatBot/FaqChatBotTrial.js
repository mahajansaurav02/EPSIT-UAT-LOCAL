import { useMemo } from "react";
import ChatBot from "react-chatbotify";
import Fuse from "fuse.js";
import { faq } from "../../NotesArray/NotesArray";

const FAQChatBotTrial = () => {
  // Configure Fuse.js options
  const fuse = useMemo(() => {
    return new Fuse(faq, {
      // keys: ["faq", "desc"],
      keys: ["faq"],
      threshold: 0.3, // adjust to your preferred fuzziness (0.0 = exact, 1.0 = loose)
    });
  }, []);

  const flow = {
    start: {
      message: "तुमचा प्रश्न विचारा.",
      path: "handle_question",
    },
    handle_question: {
      message: ({ userInput }) => {
        const input = userInput.trim();

        if (!input) {
          return "कृपया काहीतरी टाइप करा.";
        }

        const results = fuse.search(input);

        if (results.length > 0) {
          // Return the best matched FAQ description
          return results[0].item.desc;
        } else {
          return "माफ करा, तुमचा प्रश्न समजला नाही. कृपया पुन्हा विचार करा.";
        }
      },
      path: "start",
    },
  };

  return <ChatBot flow={flow} />;
};

export default FAQChatBotTrial;

//-----------------------------------------------------------

// import { useMemo } from "react";
// import ChatBot from "react-chatbotify";
// import { Chip, Box } from "@mui/material";
// import Fuse from "fuse.js";
// import { faq } from "../../NotesArray/NotesArray";

// const FAQChatBotTrial = () => {
//   const fuse = useMemo(() => {
//     return new Fuse(faq, {
//       keys: ["faq"],
//       threshold: 0.3,
//     });
//   }, []);

//   const flow = {
//     start: {
//       message:
//         "वारंवार विचारले जाणारे प्रश्न खाली दिले आहेत. कृपया एक प्रश्न निवडा.",
//       path: "faq_chips",
//     },

//     faq_chips: {
//       message: ({ setState, createMessage }) => (
//         <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
//           {faq.map((item, index) => (
//             <Chip
//               key={index}
//               label={item.faq}
//               clickable
//               variant="outlined"
//               onClick={() => {
//                 const userMessage = createMessage(item.faq, "user");
//                 const botMessage = createMessage(item.desc);

//                 setState((prev) => ({
//                   ...prev,
//                   messages: [...prev.messages, userMessage, botMessage],
//                 }));
//               }}
//             />
//           ))}
//         </Box>
//       ),
//       path: "faq_chips", // Stay on this path to keep chips visible
//     },
//   };

//   return <ChatBot flow={flow} />;
// };

// export default FAQChatBotTrial;
