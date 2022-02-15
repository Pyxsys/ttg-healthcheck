import React, {useState} from 'react';
import {Modal} from 'react-bootstrap';
import Contextualizer, {AppServices} from '../services/context.service';

interface ModalOptions {
  width?: number
  modalClassName?: string

  showPrimaryButton?: boolean
  primaryButtonText?: string
  showSecondaryButton?: boolean
  secondaryButtonText?: string
}

/**
 * Calls the function, when a button is clicked.
 */
type ButtonClickedCallback = () => void

export interface IModalService {
  open(
    component: JSX.Element,
    size?: 'sm' | 'lg' | 'xl' | 'full',
    options?: ModalOptions
  ): void
  close(): void
  onPrimaryClicked: ButtonClickedCallback
  onSecondaryClicked: ButtonClickedCallback
}

const ModalContext = Contextualizer.createContext<IModalService>(
    AppServices.ModalService,
);
export const useModalService = () =>
  Contextualizer.use<IModalService>(AppServices.ModalService);

const ModalService = ({children}: any) => {
  const [primaryText, setPrimaryText] = useState('Save');
  const [secondaryText, setSecondaryText] = useState('Cancel');

  const [show, setShow] = useState(false);
  const [modalContent, setModalContent] = useState(<></>);
  const [size, setSize] = useState('lg' as 'sm' | 'lg' | 'xl' | undefined);
  const [fullscreen, setFullscreen] = useState(false);

  const [stylingClass, setStylingClass] = useState('');

  const modalService: IModalService = {
    open: (component, size = 'lg', options = undefined) => {
      // Modal Size
      if (size === 'full') {
        setFullscreen(true);
        setSize(undefined);
      } else {
        setFullscreen(false);
        setSize(size);
      }

      // Styling
      let styling = '';
      if (options?.width) {
        styling += `modal-custom-width w-${options.width}`;
        setSize(undefined);
        setFullscreen(false);
      }
      if (options?.modalClassName) {
        styling += options.modalClassName;
        setSize(undefined);
        setFullscreen(false);
      }

      // Footer Buttons
      if (options?.showPrimaryButton === false) {
        setPrimaryText('');
      } else if (options?.primaryButtonText) {
        setPrimaryText(options.primaryButtonText);
      }
      if (options?.showSecondaryButton === false) {
        setSecondaryText('');
      } else if (options?.secondaryButtonText) {
        setSecondaryText(options.secondaryButtonText);
      }

      setStylingClass(styling);
      setModalContent(component);
      setShow(true);
    },

    close: () => {
      setShow(false);
    },

    onPrimaryClicked: () => {},
    onSecondaryClicked: () => {},
  };

  return (
    <>
      <ModalContext.Provider value={modalService}>
        {children}
      </ModalContext.Provider>

      <Modal
        show={show}
        size={size}
        fullscreen={fullscreen ? true : undefined}
        onHide={() => setShow(false)}
        centered
        dialogClassName={stylingClass}
      >
        <Modal.Body className="modal-background text-white">
          {modalContent}
        </Modal.Body>
        {primaryText || secondaryText ? (
          <Modal.Footer className="modal-background modal-footer">
            {secondaryText ? (
              <button
                className="btn modal-buttons"
                onClick={() => {
                  modalService?.onSecondaryClicked();
                  setShow(false);
                }}
              >
                {secondaryText}
              </button>
            ) : (
              <></>
            )}
            {primaryText ? (
              <button
                className="btn modal-buttons"
                onClick={() => {
                  modalService?.onPrimaryClicked();
                  setShow(false);
                }}
              >
                {primaryText}
              </button>
            ) : (
              <></>
            )}
          </Modal.Footer>
        ) : (
          <></>
        )}
      </Modal>
    </>
  );
};
export default ModalService;
