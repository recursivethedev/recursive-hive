const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        large: '75px',
        tab: '50px'
      },
      borderRadius: {
        radioButton: '20px'
      },
    },
    colors: {
      ...colors,
      malibu: '#5095ff',
      cornflower: '#6e85ff',
      cobalt: '#3280f8',
      blade: '#1f2225',
      ink: '#04111E',
      rhino: '#c8c8c8',
      pitch: '#262b31',
      gunmetal: '#282d34',
      manatee: '#969eab',
      whiteLilac: '#f7f9fc',
      silver: '#77808b',
      lightSilver: '#f6f7f9',
      frost: '#757f87',
      lightShade: '#ededed',
      lightGray: '#5d5d5d',
      dusk: '#35385b',
      selected: '#ffb629',
      muted: '#72799B'
    },
      backgroundImage: {
        buttonIcon: 'url("/assets/images/button-icon-2x.png")',
        buttonIconActive: 'url("/assets/images/button-icon-active-2x.png")'
      },
      boxShadow: {
        radioButton: '0px 4px 25px rgba(0, 0, 0, 0.05)'
      },
      fontSize: {
        xxs: '10px'
      }
    },
  plugins: []
};
