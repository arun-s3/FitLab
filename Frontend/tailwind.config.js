/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      safelist: [
        'before:content-[""]', 
        'before:absolute',
        'before:bg-black'
      ],
      screens: {
        't': '300px',
        'mob': '360px',
        'xxs-sm': '400px',
        'xs-sm2': '450px',
        'xs-sm': '500px',
        's-sm': '570px',
        'x-sm': '700px',
        'l-md': '800px',
        'x-md': '840px',
        'xx-md': '900px',
        'x-lg': '1150px',
        'xx-lg': '1230px',
        'x-xl': '1350px', 
        'xx-xl': '1420px',
        'deskt': '1500px'

        // sm: 640px
        // md: 768px
        // lg: 1024px
        // xl: 1280px
        // 2xl: 1536px
      },
      colors:{
        primary:"rgba(215, 241, 72, 1)",
        primaryDark: "#f1c40f",
        primaryLight: "rgb(248, 253, 224)",
        secondary:"rgba(159, 42, 240, 1)",
        secondaryLight: "rgba(113, 34, 168, 0.09)",
        secondaryLight2: "rgb(216, 174, 245)",
        secondaryLighter: "rgba(243, 230, 251, 0.52)",
        inputBorderSecondary: "rgb(218, 179, 246)",
        inputBgSecondary: "rgb(244, 236, 250)",
        inputBorderLow: "rgb(209, 213, 219)",
        muted:"rgb(125, 124, 140)",    //rgb(111, 110, 127)
        mutedLight: "rgb(151, 154, 160)",
        mutedDashedSeperation: "rgba(132, 120, 138, 0.52)",
        dropdownBorder: "rgba(210, 199, 215, 0.52)",
        home:"#EBEAEC",
        borderLight: "rgb(222 226 231)",
        borderLight2: "rgb(223, 195, 242)",
        grayMuted: "#e7e7e7",
        grayLightMuted: 'rgb(244, 244, 244)',
        whitesmoke: 'rgb(245,245,245)'
      },
      fontFamily:{
        funCity:['funCity'],
        sairaCondensed:['"Saira Condensed", sans-serif']
      },
      fontSize:{
        TitleMain:['35px'],
        descReg1:'15px', // can use this for "subtitleSmall1"
        descReg2:'17px',
        descReg2Med:['17px',{
          fontWeight:'500'
        }],
        descMed1:['19px',{
          fontWeight:'500'
        }],
        impText:['21px',{
          fontWeight:'700'
        }],
        snackbar:['11px',{
          fontWeight:'600'
        }],
        subtitleSmall1:'13px', // this is actually 15px in Figma. Use this if wanted 13px
        // subtitleSmall2:'15px',
        subtitleMain:'41px',
        small:['15px',{
          fontFamily:"Saira Condensed"
        }],
        h3Semibold:['30px',{
          fontWeight:'700'
        }],
        breadcrumbTitle:['23px',{
          fontWeight:'600'
        }],
        h3InterMed1:['54px',{
          fontFamily:'Inter',
          fontWeight:'500'
        }],
        h3InterMed1:['50px',{
          fontFamily:'Inter',
          fontWeight:'500'
        }],
        h2InterMed:['60px',{
          fontFamily:'Inter',
          fontWeight:'600'
        }],
        h6InterReg:'13px',

        adminTitle:['24px',{
          fontWeight:'700'
        }],
        adminSubtitle:['18px'],
        adminSubtitleSmall:['16px',{
          fontWeight:'500'
        }],
        adminDecMed:['15px',{
          fontWeight:'500'
        }],
        adminDecRegInter:['15px',{
          fontFamily:'Inter'
        }],



      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}