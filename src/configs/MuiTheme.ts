import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            padding: '12px 16px',
          },
          '& .MuiFormHelperText-root': {
            marginLeft: 0,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiSelect-select': {
            padding: '12px 16px',
          },
        },
      },
    },
  },
});

export default theme;
