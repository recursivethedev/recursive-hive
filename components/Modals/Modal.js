import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import clsx from 'clsx';
import { Icon } from "@iconify/react";
import CrossIcon from '../Icons/CrossIcon';

export default function Modal(props) {
  const { className, titleClassname, isOpen, title, children, onClose, paddingX = 5 } = props;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={onClose}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className={clsx(
              `relative inline-block align-bottom bg-dusk border-[0.5px] border-malibu rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle py-8 px-${paddingX}`,
              className
            )}>
              <button
                type="button"
                className="absolute right-8 top-[27px]"
                onClick={onClose}
              >
                <span className="sr-only">Close modal</span>

                <CrossIcon className="w-[13px]" color='#ffb629s'/>
              </button>
              {
                title && (
                  <Dialog.Title as="h3" className={clsx('text-center leading-6 text-selected font-medium mb-6', titleClassname || 'text-base')}>
                    { title }
                  </Dialog.Title>
                )
              }
              <div className="px-3">
                { children }
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}