import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { useMantineTheme } from '@mantine/core';

const config = {
  loader: { load: ["input/tex", "output/chtml"] },
};

const Question = ({ question }: { question: string}) => {
  const theme = useMantineTheme();
  return (
    <MathJaxContext version={3} config={config}>
      <div style={{ fontFamily: theme.fontFamily, fontSize: theme.fontSizes.lg }}>
        <MathJax>{question}</MathJax>
      </div>
    </MathJaxContext>
  )
}

export default Question