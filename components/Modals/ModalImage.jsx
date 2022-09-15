/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */
import React from "react";
// import Image from 'next/image';

export default function ModalImage(props) {
  const { image, onToggleModal } = props;
  return (
    <>
      {image ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none"
            onClick={onToggleModal}
          >
            <div className="relative w-auto my-6 mx-auto max-w-2xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none">
                <div className="relative p-6 flex-auto">
                  <img
                    className="rounded-[20px]"
                    src={image}
                    width="1106"
                    height="1082"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
