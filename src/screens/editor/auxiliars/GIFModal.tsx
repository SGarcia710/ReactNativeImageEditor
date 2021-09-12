import * as React from 'react';
import {Dimensions} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {GifSearch} from 'react-native-gif-search';

const {width, height} = Dimensions.get('window');
export interface ModalRefObject {
  show: () => void;
  close: () => void;
}

interface ModalProps {
  handleOnPressGif: (gifUrl: string) => void;
}

type ModalRef =
  | ((instance: ModalRefObject | null) => void)
  | React.MutableRefObject<ModalRefObject | null>
  | null;

const GIPHY_API_KEY = 'Pcd3LK0AaX4BovN4QACz3MI0fao6vn0J';

const GIFModal = (props: ModalProps, ref: ModalRef) => {
  const modalizeRef = React.useRef<Modalize>(null);

  const onClose = React.useCallback(() => {
    modalizeRef.current?.close();
  }, [modalizeRef.current]);

  const onShow = React.useCallback(() => {
    modalizeRef.current?.open();
  }, [modalizeRef.current]);

  React.useImperativeHandle(ref, () => ({
    show: onShow,
    close: onClose,
  }));

  return (
    <Modalize
      modalStyle={{
        overflow: 'hidden',
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
      }}
      scrollViewProps={{
        scrollEnabled: false,
        horizontal: true,
      }}
      modalHeight={height * 0.6}
      ref={modalizeRef}>
      <GifSearch
        //@ts-ignore
        gifType="sticker"
        giphyApiKey={GIPHY_API_KEY}
        onGifSelected={gif_url => {
          props.handleOnPressGif(gif_url);
        }}
        style={{
          paddingTop: 0,
          backgroundColor: 'transparent',
        }}
        gifStyle={{
          borderWidth: 0,
          //@ts-ignore
          resizeMode: 'contain',
        }}
        numColumns={3}
        gifListStyle={{
          height: height * 0.6 - 50,
        }}
        horizontal={false}
        showScrollBar={false}
        textInputStyle={{
          fontSize: 16,
          fontWeight: 'bold',
          color: 'white',
          height: 50,
        }}
      />
    </Modalize>
  );
};

export default React.forwardRef<ModalRefObject, ModalProps>(GIFModal);
