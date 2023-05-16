import React from 'react';

export const Creatorlist = (child) => {
  return (
    <div>
      {child.data.map((creators) => (
        <>
          <div className="home_content_rightbar_topcreators_map_content_div">
            <img
              className="home_content_rightbar_topcreators_map_content_img"
              src={creators.profilephoto}
            />
            {/* <p>{creators.follwersusername.length}</p> */}
            <a href={`/user/${creators.username}`}>{creators.username}</a>
          </div>
        </>
      ))}
    </div>
  );
};
