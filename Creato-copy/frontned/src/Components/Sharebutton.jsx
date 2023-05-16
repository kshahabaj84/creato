import React from 'react';
import {
  FacebookIcon,
  FacebookShareButton,
  InstapaperIcon,
  InstapaperShareButton,
  PinterestIcon,
  PinterestShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';
import Popup from 'reactjs-popup';

export const Sharebutton = (child) => {
  return (
    <div>
      <Popup trigger={<button>Share</button>} modal nested>
        {(close) => (
          <div className="modal">
            <div className="content">
              <FacebookShareButton url={child.url}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <InstapaperShareButton url={child.url}>
                <InstapaperIcon size={32} round />
              </InstapaperShareButton>
              <PinterestShareButton url={child.url}>
                <PinterestIcon size={32} round />
              </PinterestShareButton>
              <WhatsappShareButton url={child.url}>
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
              <TwitterShareButton url={child.url}>
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <button onClick={() => navigator.clipboard.writeText(child.url)}>
                Copy link
              </button>
            </div>
            <div>
              <button onClick={() => close()}>Close modal</button>
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
};
