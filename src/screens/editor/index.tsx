import {ScreenProps} from '@app/@types/screens';
import useProjectsStore, {ProjectsStore} from '@app/stores/useProjectsStore';
import * as React from 'react';
import {
  Button,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import ImagePicker, {Image as ImageType} from 'react-native-image-crop-picker';
import ToolIcon from './auxiliars/ToolIcon';
import GIFModal, {ModalRefObject} from './auxiliars/GIFModal';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
const {width, height} = Dimensions.get('window');
import {clamp} from 'react-native-redash';

interface Props extends ScreenProps<RootNavigatorParamList, 'Editor'> {}

const getProjectSelector = (state: ProjectsStore) => state.getProject;

interface PickedImage {
  uri: string;
  width: number;
  height: number;
  name: string | undefined;
  mime: string;
}

const GIF_SIZE = 80;
const GIF_RAIDUS = 40;

const AnimatedGif = (props: {
  url: string;
  imageSize: {
    width: number;
    height: number;
  };
}) => {
  const {top, bottom} = useSafeAreaInsets();
  // DRAG AND DROP GIFS
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const imageSize = useSharedValue(GIF_SIZE);
  // const focalX = useSharedValue(0)
  // const focalY = useSharedValue(0)

  const boundY = props.imageSize.height - GIF_SIZE;

  const onPanGestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {translateX: number; translateY: number}
  >({
    onStart: (event, context) => {
      context.translateX = translateX.value;
      context.translateY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.translateX;
      translateY.value = clamp(
        event.translationY + context.translateY,
        -(boundY / 2),
        boundY / 2,
      );
      // translateY.value = event.translationY + context.translateY;
    },
    onEnd: (event, context) => {},
  });

  const onPinchGestureHandler = useAnimatedGestureHandler<
    PinchGestureHandlerGestureEvent,
    {scale: number}
  >({
    onStart: (event, context) => {
      context.scale = scale.value;
    },
    onActive: (event, context) => {
      scale.value = event.scale * context.scale;
      // imageSize.value = imageSize.value * scale.value;
      // focalX.value = event.focalX;
      // focalY.value = event.focalY;
    },
    onEnd: (event, context) => {},
  });

  const animatedGifStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
        {perspective: 200},
        {scale: scale.value},
      ],
      // width: imageSize.value,
      // height: imageSize.value,
      // width: GIF_SIZE * scale.value,
      // height: GIF_SIZE * scale.value,
    };
  });

  return (
    <PinchGestureHandler onGestureEvent={onPinchGestureHandler}>
      <Animated.View>
        <PanGestureHandler
          minPointers={1}
          maxPointers={1}
          onGestureEvent={onPanGestureHandler}>
          <Animated.Image
            style={[
              {
                width: GIF_SIZE,
                height: GIF_SIZE,
                position: 'absolute',
                top: props.imageSize.height / 2 - GIF_RAIDUS,
                left: props.imageSize.width / 2 - GIF_RAIDUS,
              },
              animatedGifStyles,
            ]}
            source={{uri: props.url}}
          />
        </PanGestureHandler>
      </Animated.View>
    </PinchGestureHandler>
  );
};

const EditorScreen = (props: Props) => {
  const getProject = useProjectsStore(getProjectSelector);
  const project = getProject(props.route.params.projectId);
  const [image, setImage] = React.useState<PickedImage | null>();
  const {top, bottom} = useSafeAreaInsets();
  const gifModalRef = React.useRef<ModalRefObject>(null);

  const [gifs, setGifs] = React.useState<string[]>([]);

  const IMAGE_SIZE = React.useMemo(
    () => ({
      width,
      height: height - top - bottom,
    }),
    [top, height, bottom, width],
  );

  const pickImage = () => {
    ImagePicker.openPicker({
      ...IMAGE_SIZE,
      cropping: true,
      maxFiles: 1,
      forceJpg: true,
      mediaType: 'photo',
      enableRotationGesture: true,
      loadingLabelText: 'Cargando',
      cropperCancelText: 'Cancelar',
      cropperChooseText: 'Elegir',
      avoidEmptySpaceAroundImage: true,
      cropperToolbarTitle: 'Mueve y ajusta',
    })
      .then(image => {
        const source: PickedImage = {
          uri: image.path,
          width: image.width,
          height: image.height,
          name: image.filename,
          mime: image.mime,
        };
        setImage(source);
      })
      .catch(error => {
        if (!!error && error.code === 'E_PERMISSION_MISSING') {
          throw new Error('No hay persmisos');
        }
      });
  };

  const handleOnDeleteImage = () => {
    setImage(null);
  };

  const handleOnAddGif = (url: string) => {
    console.log(url);
    gifModalRef.current?.close();
    setGifs([...gifs, url]);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* Image */}
        {image && (
          <Image
            style={[
              styles.image,
              {
                ...IMAGE_SIZE,
                top,
                bottom,
              },
            ]}
            source={image}
          />
        )}

        {/* Layout */}
        <Animated.View style={styles.layout}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.iconBackground}
              onPress={props.navigation.goBack}>
              <Image
                style={styles.backIcon}
                source={require('@app/assets/images/chevronLeftIcon.png')}
              />
            </TouchableOpacity>
            {!image && <Text style={styles.projectName}>{project.name}</Text>}
          </View>
          {/* Image Picker Button */}
          {!image && (
            <TouchableOpacity
              onPress={pickImage}
              style={styles.pickImagesButton}>
              <Image
                style={styles.searchIcon}
                source={require('@app/assets/images/addIcon.png')}
              />
              <Text style={styles.searchText}>Selecciona una{'\n'}imagen</Text>
            </TouchableOpacity>
          )}
          {/* Toolbar */}
          {!!image && (
            <View style={styles.toolBar}>
              <ToolIcon iconName="delete" handleOnPress={handleOnDeleteImage} />
              <ToolIcon
                iconName="draw"
                handleOnPress={() => console.log('presionaste delete')}
              />
              <ToolIcon
                iconName="gif"
                handleOnPress={() => gifModalRef.current?.show()}
              />
              <ToolIcon
                iconName="song"
                handleOnPress={() => console.log('presionaste delete')}
              />
              <ToolIcon
                iconName="text"
                handleOnPress={() => console.log('presionaste delete')}
              />
            </View>
          )}
          {/* GIFS Container */}
          <>
            {React.Children.toArray(
              gifs.map(gif => {
                return <AnimatedGif imageSize={IMAGE_SIZE} url={gif} />;
              }),
            )}
          </>
        </Animated.View>
      </SafeAreaView>
      <GIFModal handleOnPressGif={handleOnAddGif} ref={gifModalRef} />
    </>
  );
};

export default EditorScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#161616',
    flex: 1,
    position: 'relative',
  },
  image: {
    position: 'absolute',
    zIndex: 1,
  },
  layout: {
    zIndex: 2,
    flex: 1,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    marginLeft: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  iconBackground: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    tintColor: 'white',
    width: 20,
    height: 20,
  },
  projectName: {
    color: 'white',
    marginLeft: 8,
  },
  pickImagesButton: {
    alignItems: 'center',
  },
  searchIcon: {
    width: 50,
    height: 50,
    tintColor: 'white',
  },
  searchText: {
    color: 'white',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
  },
  toolBar: {
    position: 'absolute',
    top: 10,
    right: 16,
  },
});
