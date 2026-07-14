import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

export const TaskyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#E3F0EA',
      100: '#C8E6D8',
      200: '#A5D7C0',
      300: '#7EC7A5',
      400: '#56B78B',
      500: '#176B52', // brand
      600: '#145E49',
      700: '#114F3D',
      800: '#0C4032',
      900: '#072B22',
      950: '#031612'
    },
     focusRing: {
        width: '2px',
        style: 'solid',
        color: '#176B52',
        offset: '2px'
    },

    colorScheme: {
      light: {
        surface: {
          0: '#FFFFFF',
          50: '#F7F7F5',
          100: '#F1F0ED',
          200: '#E5E3DE',
          300: '#D6D3CC',
          400: '#C4C0B7',
          500: '#9A978F',
          600: '#6B6963',
          700: '#55534E',
          800: '#383734',
          900: '#1C1B1A'
        }
      },

      dark: {
        surface: {
          0: '#151A17',
          50: '#1B211D',
          100: '#263029',
          200: '#313A34',
          300: '#3B4740',
          400: '#4A564E',
          500: '#6E7770',
          600: '#9AA39C',
          700: '#D5D8D4',
          800: '#EDEFEA',
          900: '#FFFFFF'
        }
      }
    }
  },
  primitive:{
        borderRadius:{
            none:'0',
            xs:'6px',
            sm:'10px',
            md:'14px',
            lg:'18px',
            xl:'24px'
        }
    }
});
