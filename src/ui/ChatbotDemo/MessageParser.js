import faqData from "./faqData";

class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message = "") {
    const q = message.toLowerCase();
    const match = faqData.find((f) =>
      q.includes(f.faq.toLowerCase().slice(0, 6))
    );
    if (match) {
      this.actionProvider.showAnswer(match.desc);
    } else {
      this.actionProvider.showAnswer(
        "माफ करा, प्रश्न समजला नाही. कृपया चिपवर क्लिक करा."
      );
    }
  }
}

export default MessageParser;
