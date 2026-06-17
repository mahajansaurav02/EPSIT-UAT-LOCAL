import { Paper } from "@mui/material";
import CountUp from "react-countup";

const Counter = ({ start = 0, end, delay, backgroundCol, text }) => {
  return (
    <>
      <Paper
        elevation={3}
        sx={{ p: 2, background: backgroundCol, minWidth: "140px" }}
      >
        <CountUp
          start={start}
          end={end}
          delay={delay}
          style={{ color: "#ffffff", fontWeight: 400, fontSize: "1.6em" }}
          useEasing={true}
        />
        <h4
          style={{ padding: 0, margin: 0, color: "#ffffff", textAlign: "end" }}
        >
          {text}
        </h4>
      </Paper>
    </>
  );
};

export default Counter;
