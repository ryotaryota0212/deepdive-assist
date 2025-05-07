import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

interface RatingProps {
  value: number;
  onValueChange: (value: number) => void;
  size?: number;
  style?: any;
  maxStars?: number;
}

const Rating: React.FC<RatingProps> = ({
  value,
  onValueChange,
  size = 24,
  style,
  maxStars = 5,
}) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => onValueChange(i)}
          style={{ padding: 2 }}
        >
          <Icon
            name={i <= value ? 'star' : 'star-outline'}
            type="material"
            size={size}
            color={i <= value ? '#FFD700' : '#CCCCCC'}
          />
        </TouchableOpacity>
      );
    }
    return stars as React.ReactNode[];
  };

  return (
    <View style={[styles.container, style]}>
      {renderStars()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Rating;
