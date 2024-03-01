import React, { useContext, useEffect, useState } from 'react'
import OpenAI from "openai";
import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, CssBaseline, LinearProgress, PaletteMode, ThemeProvider, Typography, createTheme, useTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const openai = new OpenAI({
    apiKey: "YOUR_OPENAI_API_KEY",
    dangerouslyAllowBrowser: true
});

  // Define different system prompts for each type of response
  const systemPrompts = {
    general: "You are a helpful assistant to just give an answer to a YouTube comment. reply with 20 words maximum",
    humorous: "You are a very fun and humorous assistant responding to a YouTube comment. reply with 20 words maximum",
    thankful: "You are a grateful assistant expressing thanks for a YouTube comment. reply with 20 words maximum",
    witty: "You are a very witty assistant crafting a response to a YouTube comment. reply with 20 words maximum",
    informal: "You are a very friendly assistant engaging with a YouTube comment. reply with 20 words maximum",
  };

const isDarkMode =window.getComputedStyle(document.querySelector('ytd-app')).backgroundColor === 'rgb(15, 15, 15)'

export default function ContentScript({comment, replyDialog }:{comment: string, replyDialog: HTMLDivElement }) {
  const [loading, setLoading] = useState(false);
  const [replies, setReplies] = useState({});
  
  
  const [mode, setMode] = useState(isDarkMode ? 'dark' : 'light')

  
  const theme = createTheme({
    palette: {
      mode: mode as PaletteMode,
    },
  });

  const checkTheme = () => {
    const isDarkMode =window.getComputedStyle(document.querySelector('ytd-app')).backgroundColor === 'rgb(15, 15, 15)'
    setMode(isDarkMode ? 'dark' : 'light');
  };

  const observer = new MutationObserver(checkTheme);
  observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });

  chrome.runtime.onMessage.addListener((message) => {
    if(message.type === 'setLoading') {
      setLoading(message.value)
    }
  })

const sendMessage = async (comment: string) => {
  setLoading(true)
  try {
    // Send messages with different system prompts
    const responses = {};
    for (const type in systemPrompts) {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompts[type] },
          { role: 'user', content: comment }
        ],
        model: "gpt-3.5-turbo",
      });
      responses[type] = completion.choices[0].message.content;
    }

    // Update state with the responses
    chrome.runtime.sendMessage({type: "setLoading", value: false})
    setLoading(false)
    setReplies(responses);
    return responses;
  } catch (error) {
    console.error("Error sending message to OpenAI:", error);
    throw error;
  }
};

const handleReplyClick = (reply: string) => {
  const contentEditableRoot = replyDialog.querySelector('#contenteditable-root') as HTMLElement;

  if (contentEditableRoot) {
    contentEditableRoot.innerText = reply;
  }
  const inputEvent = new Event('input', { bubbles: true });
  contentEditableRoot.dispatchEvent(inputEvent);
};

useEffect(() => {
console.log(theme.palette.mode, 'mode');

}, [theme])

useEffect(() => {
  checkTheme();
  sendMessage(comment);
}, [])
  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
     <Box sx={{ mt: 2, mb: 2 }} id='content-script'>
    {!loading ? <Accordion defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{ fontSize: '1.4rem' }}
      >
        Possible Responses
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
          {Object.keys(replies).map((type) => (
            <Box
            onClick={(e) => handleReplyClick(replies[type])}
            sx={{
              cursor: 'pointer',
              "&:hover": {
                textDecoration: 'none',
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                border: '1px solid rgb(25, 118, 210)',
              },
              transition: '0.3s',
              height: 36,
              border: "1px solid #1976d280",
              borderRadius: 18,
              padding: '5px 15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              }}>
                <Typography sx={{
                  overflow: 'hidden', // Hide any content that overflows
                  textOverflow: 'ellipsis', // Display an ellipsis (...) when the text overflows
                  whiteSpace: 'nowrap', // Prevent the text from wrapping to the next line
                  fontSize: '12px'
                }} key={type+'body'} > {replies[type]} </Typography>
                <Typography 
                  key={type+'header'}
                  sx={{
                    minWidth: 70,
                    marginLeft: 2,
                    textAlign: 'center',
                  }}
                >
                  {type.toUpperCase()}
                </Typography>
            </Box>
            ))
          }
        </Box>
        </AccordionDetails>
  </Accordion> :  
    <Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box> }
  </Box> 
  </ThemeProvider>
  )
}