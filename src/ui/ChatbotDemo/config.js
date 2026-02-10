import { createChatBotMessage } from "react-chatbot-kit";
import FaqChips from "./FaqChips";
import faqData from "./faqData";

const config = {
  initialMessages: [
    createChatBotMessage("तुमचा प्रश्न निवडा किंवा टाइप करा:", {
      widget: "faqChips",
    }),
  ],
  widgets: [
    {
      widgetName: "faqChips",
      widgetFunc: (props) => <FaqChips {...props} faqData={faqData} />,
    },
  ],
  customStyles: {
    botMessageBox: { backgroundColor: "#016ab8" },
    chatButton: { backgroundColor: "#016ab8" },
  },
  language: "mr",
};

export default config;
