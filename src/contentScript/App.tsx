import React from 'react';
import { createRoot } from 'react-dom/client';
import ContentButton from './generateReplyButton';
import ContentScript from './contentScript';

export default function App() {
  const existingAppContainer = document.querySelector('#app-container');
  if (existingAppContainer) {
    return null;
  }

  const setLoading = (value: boolean) => {
    chrome.runtime.sendMessage({ type: 'setLoading', value });
  };

  const drawContent = async (container: HTMLElement, commentContent: string) => {
    setLoading(true);
    const replyDialog = container.querySelector<HTMLDivElement>('#reply-dialog');
    const contentCont = document.createElement('div');
    replyDialog?.appendChild(contentCont);

    const root = createRoot(contentCont);
    root.render(<ContentScript comment={commentContent} replyDialog={replyDialog} />);
  };

  const getComment = (container: HTMLElement) => {
    let commentContent = '';

    const message = container.querySelector<HTMLElement>('#content-text');
    if (message) {
      message.childNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // If the node is an element
          const elementNode = node as HTMLElement;
          const alt = elementNode.getAttribute('alt');
          if (alt) {
            commentContent += alt;
          } else {
            // If it's another element, get its text content
            commentContent += node.textContent || '';
          }
        } else if (node.nodeType === Node.TEXT_NODE) {
          // If the node is a text node
          commentContent += node.textContent || '';
        }
      });
      return commentContent;
    }
  };

  document.addEventListener('click', (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('yt-spec-touch-feedback-shape__fill')) {
      const commentContainer = target.closest('ytd-comment-renderer') as HTMLElement;

      if (commentContainer) {
        // Get the message
        const commentContent = getComment(commentContainer);
        const buttonsElement = commentContainer.querySelector('#buttons');

        if (buttonsElement) {
          // Check if appContainer already exists
          const existingContainer = commentContainer.querySelector('#app-container');

          // If it exists, remove it
          if (existingContainer) {
            existingContainer.remove();
          }
          // Render the GenerateReplyButton component at the start of buttonsElement
          const appContainer = document.createElement('div');
          appContainer.id = 'app-container';
          buttonsElement.insertAdjacentElement('beforebegin', appContainer);

          const root = createRoot(appContainer);
          root.render(<ContentButton
            onClick={() => {
              setTimeout(() => {
                drawContent(commentContainer, commentContent);
              }, 0);
            }}
          />);
          const replyDialog = commentContainer.querySelector('#reply-dialog');

          // Find the cancel button inside the "buttons" element
          const cancelButton = buttonsElement.querySelector('#cancel-button');

          // Add a click event listener to the cancel button
          cancelButton.addEventListener('click', () => {
            // Remove all UI elements added under the reply-dialog element
            Array.from(replyDialog.children).forEach((child: Element) => {
              child.remove();
            });
            appContainer.remove();
          });
        }
      }
    }
  });
  return null;
}
