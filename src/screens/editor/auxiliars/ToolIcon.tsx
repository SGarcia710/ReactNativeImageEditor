import * as React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface ToolIconProps {
  iconName: string;
  handleOnPress: () => void;
}

const ICONS = {
  delete: require('@app/assets/images/deleteIcon.png'),
  draw: require('@app/assets/images/pencilIcon.png'),
  gif: require('@app/assets/images/addImageIcon.png'),
  text: require('@app/assets/images/addTextIcon.png'),
  song: require('@app/assets/images/addSongIcon.png'),
};

const ToolIcon = (props: ToolIconProps) => {
  return (
    <TouchableOpacity onPress={props.handleOnPress} style={styles.container}>
      <Image
        style={styles.toolbarIcon}
        source={ICONS[props.iconName as keyof typeof ICONS]}
      />
    </TouchableOpacity>
  );
};

export default ToolIcon;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 36,
    height: 36,
    borderRadius: 36 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolbarIcon: {
    tintColor: 'white',
    width: 22,
    height: 22,
  },
});
