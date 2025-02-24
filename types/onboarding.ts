import { ImageSourcePropType } from 'react-native';
import { SvgProps } from 'react-native-svg';

export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: {
    source: ImageSourcePropType | React.FC<SvgProps>;
    type: 'svg' | 'image';
  };
} 